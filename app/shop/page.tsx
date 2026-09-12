'use client';

import React, { useState } from 'react';
import { HeroHud } from '@/components/hero-hud';
import { ShopView, ShopItem } from '@/components/shop-view';

const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'item-1',
    name: 'Blade of Consistency',
    description: 'A legendary badge commemorating a 7-day uninterrupted streak.',
    cost: 250,
    type: 'PROFILE_BADGE',
    rarity: 'LEGENDARY',
    isOwned: false,
  },
  {
    id: 'item-2',
    name: 'Cyberpunk Neon Cyberdeck Theme',
    description: 'Custom UI color scheme drenched in radiant synthwave neon and deep blacks.',
    cost: 500,
    type: 'CUSTOM_THEME',
    rarity: 'EPIC',
    isOwned: false,
  },
  {
    id: 'item-3',
    name: 'Title: "Archmage of TypeScript"',
    description: 'A glowing prestige title displayed beside your hero handle.',
    cost: 150,
    type: 'TITLE',
    rarity: 'RARE',
    isOwned: true,
    isEquipped: true,
  },
  {
    id: 'item-4',
    name: 'Golden Crest Avatar Frame',
    description: 'A shimmering animated border for your hero portrait.',
    cost: 300,
    type: 'AVATAR_COSMETIC',
    rarity: 'RARE',
    isOwned: false,
  },
  {
    id: 'item-5',
    name: 'Title: "Dawn Sentry"',
    description: 'Awarded to heroes who consistently complete morning routines.',
    cost: 100,
    type: 'TITLE',
    rarity: 'COMMON',
    isOwned: false,
  },
];

export default function ShopPage() {
  const [hero] = useState({
    username: 'Alex the Coder',
    level: 4,
    currentXp: 340,
    nextLevelXp: 800,
    totalXp: 1240,
    gold: 420,
    streakCount: 5,
  });

  return (
    <div>
      <HeroHud hero={hero} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <ShopView items={INITIAL_SHOP_ITEMS} userGold={hero.gold} />
      </div>
    </div>
  );
}
