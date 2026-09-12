'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Gem,
  Swords,
  Cpu,
  Shield,
  Sparkles,
  ShoppingBag,
  Check,
  Zap,
  TrendingUp,
  Flame,
  Clock,
  MessageSquare,
  Award,
  Crown,
} from 'lucide-react';
import { GearItem } from '@/types/game';
import { sound } from '@/lib/sound';

interface ArmoryBazaarViewProps {
  userGold: number;
  userShards: number;
  onPurchaseItem?: (cost: number) => void;
}

const SAMPLE_LOADOUT: GearItem[] = [
  {
    id: 'gear-1',
    slot: 'WEAPON',
    name: 'Sonic Katana',
    rarity: 'LEGENDARY',
    cost: 500,
    description: 'Forged from high-frequency sound waves.',
    bonuses: ['+15% Strike Damage', '+10% XP Multiplier'],
    isEquipped: true,
  },
  {
    id: 'gear-2',
    slot: 'NEURAL_DECK',
    name: 'Omni-Link IV',
    rarity: 'EPIC',
    cost: 450,
    description: 'Neural bridge allowing seamless multi-tasking.',
    bonuses: ['+25% Focus Endurance'],
    isEquipped: true,
  },
  {
    id: 'gear-3',
    slot: 'CHASSIS',
    name: 'Gale Guard',
    rarity: 'RARE',
    cost: 300,
    description: 'Aerodynamic carbon kinetic plate.',
    bonuses: ['+80 Max Vitality / HP'],
    isEquipped: true,
  },
  {
    id: 'gear-4',
    slot: 'RELIC',
    name: 'Spatial Core',
    rarity: 'LEGENDARY',
    cost: 650,
    description: 'Bends localized procrastination fields.',
    bonuses: ['+15% Boss Raid Damage'],
    isEquipped: true,
  },
];

const VAULT_ITEMS: GearItem[] = [
  {
    id: 'vault-1',
    slot: 'CHASSIS',
    name: 'Neon Runic Visor',
    rarity: 'LEGENDARY',
    cost: 400,
    description: 'HUD matrix with adaptive real-time habit telemetry.',
    bonuses: ['+10% Gold Boost'],
    isEquipped: true,
    isOwned: true,
  },
  {
    id: 'vault-2',
    slot: 'WEAPON',
    name: 'Midnight Parabath',
    rarity: 'EPIC',
    cost: 480,
    description: 'Deep purple energy blade with obsidian hilt.',
    bonuses: ['+12% Deep Work XP'],
    isEquipped: false,
    isOwned: false,
  },
  {
    id: 'vault-3',
    slot: 'RELIC',
    name: 'Grandmaster Seal',
    rarity: 'RARE',
    cost: 750,
    description: 'Commemorates 100 unbroken habit completions.',
    bonuses: ['+20% Streak Shield'],
    isEquipped: false,
    isOwned: false,
  },
  {
    id: 'vault-4',
    slot: 'CHASSIS',
    name: 'Chrono-Cloak',
    rarity: 'MYTHIC',
    cost: 1200,
    description: 'Mythic cloak spun from temporal matrix fibers.',
    bonuses: ['+30% All Rewards', '+200 Max HP'],
    isEquipped: false,
    isOwned: false,
  },
];

const RARITY_STYLES: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  RARE: {
    border: 'border-cyan-400/80',
    bg: 'bg-cyan-950/40',
    text: 'text-cyan-300',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.25)]',
  },
  EPIC: {
    border: 'border-purple-500/80',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    glow: 'shadow-[0_0_18px_rgba(168,85,247,0.3)]',
  },
  LEGENDARY: {
    border: 'border-amber-400',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.35)]',
  },
  MYTHIC: {
    border: 'border-pink-500',
    bg: 'bg-pink-950/40',
    text: 'text-pink-300',
    glow: 'shadow-[0_0_25px_rgba(255,42,133,0.4)]',
  },
};

export const ArmoryBazaarView: React.FC<ArmoryBazaarViewProps> = ({
  userGold,
  userShards,
  onPurchaseItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<'GEAR' | 'COSMETICS' | 'BADGES'>('GEAR');
  const [gold, setGold] = useState(userGold);
  const [loadout, setLoadout] = useState<GearItem[]>(SAMPLE_LOADOUT);
  const [vaultGoods, setVaultGoods] = useState<GearItem[]>(VAULT_ITEMS);
  const [featuredPurchased, setFeaturedPurchased] = useState(false);

  const handleBuyFeatured = () => {
    if (gold < 550 || featuredPurchased) return;
    sound.playBuy();
    setGold((g) => g - 550);
    setFeaturedPurchased(true);
    onPurchaseItem?.(550);
  };

  const handleBuyVaultItem = (item: GearItem) => {
    if (gold < item.cost || item.isOwned) return;
    sound.playBuy();
    setGold((g) => g - item.cost);
    setVaultGoods((prev) =>
      prev.map((g) => (g.id === item.id ? { ...g, isOwned: true } : g))
    );
    onPurchaseItem?.(item.cost);
  };

  return (
    <div className="space-y-4 font-mono text-slate-100">
      {/* Top Breadcrumb & Refresh Clock */}
      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold px-1">
        <span>[ VENDOR ID: VAULT_018 ]</span>
        <span className="flex items-center gap-1 text-purple-300">
          <Clock className="w-3 h-3 text-purple-400" />
          <span>SHOP REFRESH: IN 04:18:22</span>
        </span>
      </div>

      {/* Currency Balances Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-950/80 to-slate-900 p-3 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-sm">
              🪙
            </div>
            <div>
              <span className="text-[9px] text-amber-400/80 font-bold block">CREDITS // GOLD</span>
              <span className="text-sm font-black text-amber-300">{gold.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border-2 border-cyan-400/80 bg-gradient-to-r from-cyan-950/80 to-slate-900 p-3 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-black text-xs shadow-sm">
              💎
            </div>
            <div>
              <span className="text-[9px] text-cyan-400/80 font-bold block">CYBER SHARDS</span>
              <span className="text-sm font-black text-cyan-300">{userShards}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Battle Loadout (4 Slots) */}
      <div className="rounded-3xl border-2 border-[#201D48] bg-[#0E0A22] p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-white flex items-center gap-1.5 uppercase">
            <Swords className="w-4 h-4 text-cyan-400" /> Active Battle Loadout
          </span>
          <span className="text-[10px] text-cyan-300 font-bold">4/4 SLOTS EQUIPPED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {loadout.map((gear) => {
            const style = RARITY_STYLES[gear.rarity];
            return (
              <div
                key={gear.slot}
                className={`rounded-2xl border-2 ${style.border} ${style.bg} p-2.5 text-left transition-transform hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                  <span className="font-bold">{gear.slot}</span>
                  <span className={`font-black ${style.text}`}>{gear.rarity[0]}</span>
                </div>
                <h4 className="text-xs font-black text-white truncate">{gear.name}</h4>
                <p className="text-[10px] text-amber-300 font-bold mt-0.5 truncate">
                  {gear.bonuses[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 text-xs">
        {[
          { key: 'GEAR', label: ':: All Gear' },
          { key: 'COSMETICS', label: ':: Cosmetics' },
          { key: 'BADGES', label: ':: Badges & Titles' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              sound.playClick();
              setActiveCategory(key as any);
            }}
            className={`flex-1 py-2 rounded-xl border font-bold transition-all text-center ${
              activeCategory === key
                ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                : 'border-[#201D48] bg-[#0E0A22] text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Featured Epic Relic Showcase (Large Card from Screen 2) */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/90 bg-gradient-to-b from-[#1E0C32] via-[#140824] to-[#0A0514] p-5 shadow-[0_0_30px_rgba(168,85,247,0.35)]">
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

        <div className="relative flex items-center justify-between text-[10px] mb-3">
          <span className="text-purple-300 font-black tracking-wider">
            EPIC RELIC // ID: ARTIFACT_#019
          </span>
          <span className="rounded-md bg-purple-950 border border-purple-400/80 px-2 py-0.5 font-bold text-purple-300">
            1 PIECE AVAILABLE
          </span>
        </div>

        {/* Glowing Katana Artwork / Icon Center */}
        <div className="relative flex flex-col items-center justify-center py-4 my-2 rounded-2xl border border-purple-500/40 bg-gradient-to-b from-[#2B0E44]/60 to-[#10061C] shadow-inner">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-purple-400 bg-purple-950/90 shadow-[0_0_30px_rgba(168,85,247,0.6)]">
            <Swords className="h-10 w-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.9)] animate-pulse" />
          </div>
          <div className="mt-3 flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> +15% XP on Coding Quests
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> +20% Streak Shield
            </span>
          </div>
        </div>

        {/* Title & Flavor Text */}
        <div className="relative mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white tracking-tight">
              Cyber-Katana of Flow
            </h3>
            <div className="flex items-center gap-1 text-sm font-black text-amber-300">
              <span>🪙</span>
              <span>550 G</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
            Forged from extracted synaptic pulses. Calibrates neural focus state, turning multi-hour deep work sessions into critical strike combos.
          </p>

          <button
            onClick={handleBuyFeatured}
            disabled={gold < 550 || featuredPurchased}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black shadow-lg transition-all ${
              featuredPurchased
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                : gold >= 550
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:brightness-110 active:scale-[0.99]'
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {featuredPurchased ? (
              <>
                <Check className="w-4 h-4" /> ARTIFACT ACQUIRED & EQUIPPED
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                ACQUIRE ARTIFACT // 550 G
              </>
            )}
          </button>
        </div>
      </div>

      {/* Encrypted Vault Goods (2x2 Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs">
          <h3 className="font-black text-white flex items-center gap-1.5 uppercase">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Encrypted Vault Goods
          </h3>
          <span className="text-[10px] text-cyan-300 font-bold">4 AVAILABLE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vaultGoods.map((item) => {
            const style = RARITY_STYLES[item.rarity];
            const canAfford = gold >= item.cost;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 ${style.border} ${style.bg} ${style.glow} p-4 backdrop-blur-md`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className={`font-black uppercase px-2 py-0.5 rounded border border-current ${style.text}`}>
                      {item.rarity}
                    </span>
                    <span className="text-slate-400 uppercase text-[9px]">{item.slot}</span>
                  </div>

                  <h4 className="text-sm font-black text-white">{item.name}</h4>
                  <p className="text-xs text-slate-300 font-sans mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-amber-300 font-bold mt-1">{item.bonuses[0]}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-indigo-950 flex items-center justify-between">
                  <div className="flex items-center gap-1 font-black text-amber-300 text-xs">
                    <span>🪙</span>
                    <span>{item.cost} G</span>
                  </div>

                  {item.isOwned ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/60 px-2.5 py-1 rounded-xl">
                      <Check className="w-3.5 h-3.5" /> EQUIPPED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuyVaultItem(item)}
                      disabled={!canAfford}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                        canAfford
                          ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-95 shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      ACQUIRE
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Merchant Voice Note Footer */}
      <div className="rounded-2xl border border-purple-500/40 bg-[#120A24] p-3 text-xs flex items-start gap-2.5">
        <MessageSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-[10px] text-purple-300 font-bold block uppercase">
            Merchant Boiler // Vault Keeper
          </span>
          <p className="text-slate-300 font-sans text-[11px] mt-0.5">
            "Every line of code and completed habit crystallizes extra gold into your neural ledger. Spend wisely, Paladin."
          </p>
        </div>
      </div>
    </div>
  );
};
