'use client';

import React, { useState } from 'react';
import { HeroHud } from '@/components/hero-hud';
import { CharacterMatrixView } from '@/components/character-matrix-view';
import { CyberBottomNav } from '@/components/cyber-bottom-nav';
import { HeroState } from '@/types/game';
import { useRouter } from 'next/navigation';

const INITIAL_HERO: HeroState = {
  id: 'user-1',
  username: 'Nexus Operator',
  classTitle: 'CHRONO-KNIGHT',
  specialization: 'Cyber-Focus Kinetic Synthesis',
  level: 14,
  hp: 780,
  maxHp: 800,
  xp: 3850,
  nextLevelXp: 4000,
  totalXp: 18450,
  gold: 1420,
  cyberShards: 48,
  streakCount: 7,
  unspentSkillPoints: 2,
  radar: {
    str: 14,
    int: 18,
    sta: 14,
    agi: 11,
    syn: 16,
    void: 12,
  },
  vitalityBonus: 12.8,
  surgeBonus: 18.0,
  strikeLatency: 35,
  isOverclocked: false,
};

export default function CharacterPage() {
  const [hero, setHero] = useState<HeroState>(INITIAL_HERO);
  const router = useRouter();

  const handleSpendSkillPoint = () => {
    if (hero.unspentSkillPoints <= 0) return;
    setHero((h) => ({
      ...h,
      unspentSkillPoints: Math.max(0, h.unspentSkillPoints - 1),
      vitalityBonus: +(h.vitalityBonus + 0.8).toFixed(1),
      surgeBonus: +(h.surgeBonus + 1.2).toFixed(1),
      radar: { ...h.radar, int: h.radar.int + 1, syn: h.radar.syn + 1 },
    }));
  };

  return (
    <div className="min-h-screen bg-[#070712] text-slate-100 font-sans pb-24 selection:bg-cyan-400 selection:text-slate-950">
      <div className="border-b border-indigo-950/60 bg-[#06060f] px-4 py-1 text-center font-mono text-[11px] text-slate-400 tracking-wider">
        HeroQuest: Operator Neural Matrix
      </div>

      <HeroHud
        hero={{
          username: hero.username,
          level: hero.level,
          currentXp: hero.xp,
          nextLevelXp: hero.nextLevelXp,
          totalXp: hero.totalXp,
          gold: hero.gold,
          streakCount: hero.streakCount,
        }}
      />

      <main className="mx-auto max-w-xl px-3 sm:px-4 py-4">
        <CharacterMatrixView
          hero={hero}
          onSpendSkillPoint={handleSpendSkillPoint}
        />
      </main>

      <CyberBottomNav
        activeTab="ATTRIBUTES"
        onSelectTab={(tab) => {
          if (tab === 'QUESTS') router.push('/');
          if (tab === 'ARMORY') router.push('/shop');
          if (tab === 'BOSS') router.push('/');
        }}
      />
    </div>
  );
}
