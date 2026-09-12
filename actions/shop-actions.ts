'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { QuestActionResult } from './quest-actions';

/**
 * Server Action: Purchase Shop Item
 * Atomically verifies balance, deducts gold, and adds item to user inventory.
 */
export async function buyShopItem(
  itemId: string
): Promise<QuestActionResult<{ itemId: string; newGold: number }>> {
  try {
    const user = await getAuthenticatedUser();

    const result = await db.$transaction(async (tx) => {
      // 1. Fetch item
      const item = await tx.item.findUnique({
        where: { id: itemId },
      });

      if (!item || !item.isAvailable) {
        throw new Error('Item is unavailable or does not exist.');
      }

      // 2. Fetch fresh user balance
      const freshUser = await tx.user.findUniqueOrThrow({
        where: { id: user.id },
      });

      if (freshUser.gold < item.cost) {
        throw new Error(`Insufficient gold! Requires ${item.cost} G (You have ${freshUser.gold} G).`);
      }

      // 3. Check if already owned
      const existingInventory = await tx.inventory.findUnique({
        where: {
          userId_itemId: {
            userId: user.id,
            itemId: item.id,
          },
        },
      });

      if (existingInventory) {
        throw new Error('You already own this item in your inventory.');
      }

      // 4. Deduct gold
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          gold: { decrement: item.cost },
        },
      });

      // 5. Add to inventory
      await tx.inventory.create({
        data: {
          userId: user.id,
          itemId: item.id,
          isEquipped: false,
        },
      });

      return {
        itemId: item.id,
        newGold: updatedUser.gold,
      };
    });

    revalidatePath('/shop');
    revalidatePath('/character');
    revalidatePath('/dashboard');

    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Purchase failed.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Equip / Unequip Item
 */
export async function toggleEquipItem(
  inventoryId: string
): Promise<QuestActionResult<{ inventoryId: string; isEquipped: boolean }>> {
  try {
    const user = await getAuthenticatedUser();

    const inventoryRecord = await db.inventory.findFirst({
      where: {
        id: inventoryId,
        userId: user.id,
      },
      include: { item: true },
    });

    if (!inventoryRecord) {
      throw new Error('Item not found in inventory.');
    }

    const nextState = !inventoryRecord.isEquipped;

    await db.inventory.update({
      where: { id: inventoryId },
      data: { isEquipped: nextState },
    });

    revalidatePath('/character');
    revalidatePath('/shop');

    return { success: true, data: { inventoryId, isEquipped: nextState } };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to equip item.';
    return { success: false, error: errorMessage };
  }
}
