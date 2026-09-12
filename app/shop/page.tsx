'use client';

import React, { useState } from 'react';
import { HeroHud } from '@/components/hero-hud';
import { ArmoryBazaarView } from '@/components/armory-bazaar-view';
import { CyberBottomNav } from '@/components/cyber-bottom-nav';
import { useRouter } from 'next/navigation';

export default function ShopPage() {
  const [hero, setHero] = useState({
    username: 'Nexus Operator',
    level: 14,
    currentXp: 3850,
    nextLevelXp: 4000,
    totalXp: 18450,
    gold: 1420,
    cyberShards: 48,
    streakCount: 7,
  });

  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#070712] text-slate-100 font-sans pb-24 selection:bg-cyan-400 selection:text-slate-950">
      <div className="border-b border-indigo-950/60 bg-[#06060f] px-4 py-1 text-center font-mono text-[11px] text-slate-400 tracking-wider">
        HeroQuest: Cybernetic Bazaar & Arsenal
      </div>

      <HeroHud hero={hero} />

      <main className="mx-auto max-w-xl px-3 sm:px-4 py-4">
        <ArmoryBazaarView
          userGold={hero.gold}
          userShards={hero.cyberShards}
          onPurchaseItem={(cost) => {
            setHero((h) => ({ ...h, gold: Math.max(0, h.gold - cost) }));
          }}
        />
      </main>

      <CyberBottomNav
        activeTab="ARMORY"
        onSelectTab={(tab) => {
          if (tab === 'QUESTS') router.push('/');
          if (tab === 'ATTRIBUTES') router.push('/character');
          if (tab === 'BOSS') router.push('/');
        }}
      />
    </div>
  );
}
