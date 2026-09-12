'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import {
  CreateQuestSchema,
  CompleteQuestSchema,
  CreateQuestInput,
} from '@/lib/validations/quest';
import {
  DIFFICULTY_REWARDS,
  evaluateStreak,
  calculateFinalRewards,
  calculateLevelFromTotalXp,
  calculateAttributeProgress,
  AttributeType,
} from '@/lib/progression';

export type QuestActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface QuestCompletionData {
  questId: string;
  questTitle: string;
  rewards: {
    xp: number;
    gold: number;
    attributeXp: number;
    attributeType: AttributeType;
  };
  streak: {
    count: number;
    bonusMultiplier: number;
    isMaintained: boolean;
  };
  levelUp: {
    didLevelUp: boolean;
    oldLevel: number;
    newLevel: number;
    levelsGained: number;
  };
  attributeLevelUp: {
    didLevelUp: boolean;
    attribute: AttributeType;
    oldLevel: number;
    newLevel: number;
  };
  updatedHero: {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    totalXp: number;
    gold: number;
    streakCount: number;
  };
}

/**
 * Server Action: Create Quest
 * Enforces server-side reward calculation (Anti-Cheat)
 */
export async function createQuest(
  input: CreateQuestInput
): Promise<QuestActionResult<{ id: string; title: string }>> {
  try {
    const user = await getAuthenticatedUser();
    const validatedData = CreateQuestSchema.parse(input);

    // Anti-Cheat: Compute rewards strictly server-side from difficulty table
    const baseRewards = DIFFICULTY_REWARDS[validatedData.difficulty];

    const newQuest = await db.quest.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        difficulty: validatedData.difficulty,
        attributeType: validatedData.attributeType,
        xpReward: baseRewards.xp,
        goldReward: baseRewards.gold,
        dueDate: validatedData.dueDate,
        isRecurring: validatedData.isRecurring,
      },
      select: {
        id: true,
        title: true,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/quests');

    return { success: true, data: newQuest };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create quest.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Complete Quest
 * Atomic transaction handling XP calculation, streak checks, level-up calculation,
 * attribute progression, and economy updates.
 */
export async function completeQuest(
  questId: string
): Promise<QuestActionResult<QuestCompletionData>> {
  try {
    const user = await getAuthenticatedUser();
    CompleteQuestSchema.parse({ questId });

    // Execute completion inside an isolated ACID database transaction
    const result = await db.$transaction(async (tx) => {
      // 1. Fetch Quest and verify ownership + pending status
      const quest = await tx.quest.findFirst({
        where: {
          id: questId,
          userId: user.id,
        },
      });

      if (!quest) {
        throw new Error('Quest not found or unauthorized.');
      }

      if (quest.completed || quest.status === 'COMPLETED') {
        throw new Error('Quest has already been completed.');
      }

      // 2. Fetch fresh user data with attributes
      const currentUser = await tx.user.findUniqueOrThrow({
        where: { id: user.id },
        include: { attributes: true },
      });

      const userAttributes =
        currentUser.attributes ??
        (await tx.userAttribute.create({
          data: {
            userId: currentUser.id,
            strength: 1,
            intellect: 1,
            stamina: 1,
            agility: 1,
          },
        }));

      // 3. Streak Evaluation & Streak Multipliers
      const now = new Date();
      const streakEval = evaluateStreak(
        currentUser.lastActiveDate,
        now,
        currentUser.streakCount
      );

      // 4. Calculate Final Multiplied Rewards
      const finalRewards = calculateFinalRewards(
        quest.difficulty,
        streakEval.streakBonusMultiplier
      );

      // 5. Calculate User Level Progression
      const newTotalXp = currentUser.totalXp + finalRewards.xp;
      const levelProgress = calculateLevelFromTotalXp(newTotalXp, currentUser.level);

      // 6. Calculate Attribute XP & Level Progression
      const attrKey = quest.attributeType.toLowerCase() as
        | 'strength'
        | 'intellect'
        | 'stamina'
        | 'agility';

      const currentAttrXp = userAttributes[`${attrKey}Xp`] as number;
      const currentAttrLevel = userAttributes[attrKey] as number;
      const newAttrTotalXp = currentAttrXp + finalRewards.attributeXp;

      const attrProgress = calculateAttributeProgress(
        quest.attributeType,
        newAttrTotalXp,
        currentAttrLevel
      );

      // 7. Update User Record
      const updatedUser = await tx.user.update({
        where: { id: currentUser.id },
        data: {
          level: levelProgress.level,
          totalXp: newTotalXp,
          currentXp: levelProgress.currentXp,
          nextLevelXp: levelProgress.nextLevelXp,
          gold: { increment: finalRewards.gold },
          streakCount: streakEval.newStreakCount,
          longestStreak: Math.max(
            currentUser.longestStreak,
            streakEval.newStreakCount
          ),
          lastActiveDate: now,
        },
      });

      // 8. Update User Attributes Record
      await tx.userAttribute.update({
        where: { userId: currentUser.id },
        data: {
          [attrKey]: attrProgress.level,
          [`${attrKey}Xp`]: newAttrTotalXp,
        },
      });

      // 9. Mark Quest as Completed
      await tx.quest.update({
        where: { id: quest.id },
        data: {
          completed: true,
          status: 'COMPLETED',
          completedAt: now,
        },
      });

      return {
        questId: quest.id,
        questTitle: quest.title,
        rewards: {
          xp: finalRewards.xp,
          gold: finalRewards.gold,
          attributeXp: finalRewards.attributeXp,
          attributeType: quest.attributeType,
        },
        streak: {
          count: streakEval.newStreakCount,
          bonusMultiplier: streakEval.streakBonusMultiplier,
          isMaintained: streakEval.isStreakMaintained,
        },
        levelUp: {
          didLevelUp: levelProgress.didLevelUp,
          oldLevel: currentUser.level,
          newLevel: levelProgress.level,
          levelsGained: levelProgress.levelsGained,
        },
        attributeLevelUp: {
          didLevelUp: attrProgress.didLevelUp,
          attribute: quest.attributeType,
          oldLevel: currentAttrLevel,
          newLevel: attrProgress.level,
        },
        updatedHero: {
          level: updatedUser.level,
          currentXp: updatedUser.currentXp,
          nextLevelXp: updatedUser.nextLevelXp,
          totalXp: updatedUser.totalXp,
          gold: updatedUser.gold,
          streakCount: updatedUser.streakCount,
        },
      };
    });

    revalidatePath('/dashboard');
    revalidatePath('/quests');
    revalidatePath('/character');

    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Quest completion failed.';
    return { success: false, error: errorMessage };
  }
}
