'use client';

import React, { useState } from 'react';
import { HeroHud } from '@/components/hero-hud';
import { RewardsVaultView } from '@/components/rewards-vault-view';
import { CyberBottomNav } from '@/components/cyber-bottom-nav';
import { useRouter } from 'next/navigation';
import { DEFAULT_AVATAR } from '@/components/pixel-avatar';
import { ActiveBuffs, ExchangeRewardItem } from '@/types/game';

export default function ShopPage() {
  const [hero, setHero] = useState({
    username: 'Nexus Operator',
    level: 1,
    currentXp: 0,
    nextLevelXp: 100,
    totalXp: 0,
    gold: 0,
    cyberShards: 0,
    streakCount: 0,
    hp: 800,
    maxHp: 800,
    avatar: DEFAULT_AVATAR,
  });

  const [activeBuffs, setActiveBuffs] = useState<ActiveBuffs>({
    streakShields: 0,
    xpBoosterActive: false,
    xpBoosterExpiresAt: null,
    activeFlare: 'NONE',
  });

  const router = useRouter();

  const handlePurchaseReward = (reward: ExchangeRewardItem) => {
    setHero((h) => ({ ...h, gold: Math.max(0, h.gold - reward.cost) }));
    if (reward.id === 'pot-freeze') {
      setActiveBuffs((b) => ({ ...b, streakShields: b.streakShields + 1 }));
    }
    if (reward.id === 'pot-xp') {
      setActiveBuffs((b) => ({ ...b, xpBoosterActive: true, xpBoosterExpiresAt: Date.now() + 86400000 }));
    }
  };

  return (
    <div className="min-h-screen bg-[#070712] text-slate-100 font-sans pb-24 selection:bg-cyan-400 selection:text-slate-950">
      <div className="border-b border-indigo-950/60 bg-[#06060f] px-4 py-1 text-center font-mono text-[11px] text-slate-400 tracking-wider">
        HeroQuest: Rewards Vault & Exchange Terminal
      </div>

      <HeroHud hero={hero} activeBuffs={activeBuffs} />

      <main className="mx-auto max-w-xl px-3 sm:px-4 py-4">
        <RewardsVaultView
          userGold={hero.gold}
          userShards={hero.cyberShards}
          heroHp={hero.hp}
          heroMaxHp={hero.maxHp}
          activeBuffs={activeBuffs}
          onPurchaseReward={handlePurchaseReward}
        />
      </main>

      <CyberBottomNav
        activeTab="REWARDS"
        onSelectTab={(tab) => {
          if (tab === 'QUESTS') router.push('/');
          if (tab === 'ATTRIBUTES') router.push('/character');
          if (tab === 'SYNDICATE') router.push('/');
        }}
      />
    </div>
  );
}
