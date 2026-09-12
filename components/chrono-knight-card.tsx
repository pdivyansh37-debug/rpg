'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Flame,
  Coins,
  TrendingUp,
  Heart,
  Zap,
  Sparkles,
  ShieldCheck,
  Star,
  Activity,
  Cpu,
} from 'lucide-react';
import { sound } from '@/lib/sound';

export interface ChronoKnightCardProps {
  hero: {
    username: string;
    level: number;
    currentXp: number;
    nextLevelXp: number;
    totalXp: number;
    gold: number;
    streakCount: number;
    hp?: number;
    maxHp?: number;
  };
  isOverclocked?: boolean;
  onToggleOverclock?: () => void;
}

export const ChronoKnightCard: React.FC<ChronoKnightCardProps> = ({
  hero,
  isOverclocked = false,
  onToggleOverclock,
}) => {
  const [showBoostTooltip, setShowBoostTooltip] = useState(false);

  const hp = hero.hp ?? 780;
  const maxHp = hero.maxHp ?? 800;
  const hpPercent = Math.min(100, Math.max(0, Math.round((hp / maxHp) * 100)));

  const manaXp = hero.currentXp;
  const maxManaXp = hero.nextLevelXp;
  const manaPercent = Math.min(
    100,
    Math.max(0, Math.round((manaXp / maxManaXp) * 100))
  );

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
        isOverclocked
          ? 'border-cyan-400 bg-gradient-to-b from-[#140b2e] via-[#0e0c26] to-[#070b1e] shadow-[0_0_35px_rgba(0,240,255,0.4)] overclock-active'
          : 'border-purple-600/70 bg-gradient-to-b from-[#160e2e] via-[#100d28] to-[#0a081a] shadow-[0_0_25px_rgba(147,51,234,0.25)]'
      } p-4 sm:p-5`}
    >
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Top Header Row Brackets */}
      <div className="relative flex items-center justify-between text-[11px] font-mono mb-3">
        <span className="text-cyan-400 font-bold tracking-wider">[ +SYS ]</span>

        <div className="flex items-center gap-1.5 text-cyan-300 font-black tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
          <Swords className="w-3.5 h-3.5 text-cyan-400" />
          <span>CHRONO-KNIGHT</span>
        </div>

        <button
          onClick={() => {
            sound.playOverclock();
            onToggleOverclock?.();
          }}
          className={`group flex items-center gap-1 rounded-md px-2 py-0.5 font-mono font-bold tracking-wider transition-all ${
            isOverclocked
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-pulse'
              : 'border border-amber-500/60 bg-amber-950/40 text-amber-400 hover:bg-amber-900/50'
          }`}
        >
          <Cpu className="w-3 h-3 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span>[ {isOverclocked ? 'OVERCLOCK ACTIVE' : 'OVERCLOCK'} ]</span>
        </button>
      </div>

      {/* Hero Identity Section */}
      <div className="relative flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar Crest with crossed swords */}
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 border-purple-500/90 bg-gradient-to-br from-purple-950 via-slate-900 to-black shadow-[0_0_18px_rgba(168,85,247,0.5)]">
              <Swords className="h-7 w-7 sm:h-8 sm:w-8 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
            {/* Level Pill */}
            <span className="absolute -bottom-2 -left-1 flex items-center gap-0.5 rounded-md border border-cyan-400 bg-purple-950 px-1.5 py-0.2 font-mono text-[10px] font-black text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.6)]">
              LV {hero.level}
            </span>
          </div>

          {/* Name & Cyber Badges */}
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight truncate flex items-center gap-1.5">
              Nexus Operator
            </h2>

            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <span className="rounded-md border border-purple-500/60 bg-purple-950/80 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-300 shadow-sm">
                ARCADE V-PRO
              </span>
              <span className="flex items-center gap-0.5 text-[11px] font-mono font-bold text-cyan-400">
                <Sparkles className="w-3 h-3 text-cyan-300 animate-spin [animation-duration:4s]" />
                Synchronized
              </span>
              <span className="rounded-md border border-pink-500/60 bg-gradient-to-r from-pink-950/80 to-purple-950/80 px-2 py-0.5 font-mono text-[10px] font-black text-pink-300 flex items-center gap-1 shadow-sm">
                RANK S-7 <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
              </span>
            </div>
          </div>
        </div>

        {/* Right Gold Wallet Readout */}
        <div className="hidden sm:flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1.5 rounded-xl border-2 border-amber-400/90 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/90 px-3 py-1.5 font-mono text-sm font-black text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <span className="text-base">🪙</span>
            <span>{hero.gold.toLocaleString()}g</span>
          </div>
        </div>
      </div>

      {/* 7-Day Radiant Streak Sub-Card */}
      <div className="relative overflow-hidden rounded-2xl border border-pink-600/50 bg-gradient-to-r from-[#200e2b] via-[#241130] to-[#1d0e2c] p-3 sm:p-3.5 mb-4 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Flame Icon + Streak Details */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-500/80 bg-rose-950/70 shadow-[0_0_12px_rgba(244,63,94,0.4)]">
              <Flame className="h-5 w-5 text-orange-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                {hero.streakCount}-Day Radiant Streak
              </h4>
              <p className="text-[10px] sm:text-[11px] font-mono text-pink-300/80">
                Hyper-Catalyst Active
              </p>
            </div>
          </div>

          {/* Right: +10% Gold Boost Pill Button */}
          <button
            onClick={() => {
              sound.playCoin();
              setShowBoostTooltip(!showBoostTooltip);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-amber-400/80 bg-gradient-to-r from-amber-950/90 to-yellow-950/90 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] font-mono font-black text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-transform hover:scale-105"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>+10% GOLD BOOST</span>
          </button>
        </div>
      </div>

      {/* Stat Gauges Section */}
      <div className="space-y-2.5 mb-3 font-mono">
        {/* Core Vitality / HP */}
        <div>
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] mb-1 font-bold">
            <span className="text-pink-400 flex items-center gap-1">
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500 animate-pulse" />
              CORE VITALITY / HP
            </span>
            <span className="text-white font-extrabold tracking-wider">
              {hp} / <span className="text-slate-400">{maxHp}</span>
            </span>
          </div>

          {/* Pink Health Track */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-pink-900/60 bg-[#120818]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${hpPercent}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className="h-full rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-pink-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
            />
          </div>
        </div>

        {/* Synapse Mana EXP */}
        <div>
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] mb-1 font-bold">
            <span className="text-cyan-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
              SYNAPSE MANA EXP
            </span>
            <span className="text-cyan-200 font-extrabold tracking-wider">
              {manaXp.toLocaleString()} /{' '}
              <span className="text-slate-400">{maxManaXp.toLocaleString()}</span>{' '}
              <span className="text-cyan-400">({manaPercent}%)</span>
            </span>
          </div>

          {/* Cyan Mana Track */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-cyan-900/60 bg-[#08121a]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${manaPercent}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.8)]"
            />
          </div>
        </div>
      </div>

      {/* Card Footer Brackets */}
      <div className="relative flex items-center justify-between pt-1 border-t border-indigo-950/70 text-[10px] font-mono">
        <span className="text-purple-400/80 font-bold">[ NODE:014 ]</span>
        <span className="text-cyan-400 font-bold tracking-wider">[ READY ]</span>
      </div>
    </motion.div>
  );
};
