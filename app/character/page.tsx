'use client';

import React, { useState } from 'react';
import { HeroHud } from '@/components/hero-hud';
import { CharacterSheet } from '@/components/character-sheet';
import { HeroProfile } from '@/types/game';

const SAMPLE_HERO_PROFILE: HeroProfile = {
  id: 'user-1',
  username: 'Alex the Coder',
  level: 4,
  currentXp: 340,
  nextLevelXp: 800,
  totalXp: 1240,
  gold: 420,
  streakCount: 5,
  longestStreak: 12,
  attributes: {
    strength: 3,
    strengthXp: 210,
    intellect: 5,
    intellectXp: 540,
    stamina: 4,
    staminaXp: 320,
    agility: 2,
    agilityXp: 170,
  },
};

export default function CharacterPage() {
  const [hero] = useState<HeroProfile>(SAMPLE_HERO_PROFILE);

  return (
    <div>
      <HeroHud hero={hero} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <CharacterSheet hero={hero} />
      </div>
    </div>
  );
}
