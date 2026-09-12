'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Coins, Shield, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '@/lib/sound';

export interface HeroHudProps {
  hero: {
    username: string;
    level: number;
    currentXp: number;
    nextLevelXp: number;
    totalXp: number;
    gold: number;
    streakCount: number;
    avatarUrl?: string | null;
  };
}

export const HeroHud: React.FC<HeroHudProps> = ({ hero }) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const xpPercent = Math.min(
    100,
    Math.max(0, Math.round((hero.currentXp / hero.nextLevelXp) * 100))
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Avatar & Hero Rank */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-amber-400/80 bg-gradient-to-b from-slate-800 to-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <Shield className="h-6 w-6 text-amber-400" />
            </div>
            {/* Level Tag */}
            <span className="absolute -bottom-1.5 -right-1.5 rounded-md border border-amber-500/80 bg-amber-950 px-1.5 py-0.2 font-mono text-[10px] font-black text-amber-300 shadow">
              LV.{hero.level}
            </span>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              {hero.username}
              <span className="rounded bg-indigo-950/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-400 border border-indigo-800/40">
                ADVENTURER
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Total EXP: {hero.totalXp.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Center: Interactive XP Gauge */}
        <div className="flex flex-1 max-w-xs sm:max-w-md mx-4 flex-col justify-center">
          <div className="flex justify-between items-center mb-1 text-[11px] font-mono">
            <span className="text-indigo-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> EXP
            </span>
            <span className="text-slate-400">
              {hero.currentXp} / {hero.nextLevelXp} ({xpPercent}%)
            </span>
          </div>

          {/* XP Progress Track */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-indigo-900/60 bg-slate-900">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
            />
          </div>
        </div>

        {/* Right: Gold, Streak, and SFX Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Gold Stash */}
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-900/50 bg-amber-950/40 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 shadow-sm">
            <Coins className="h-4 w-4 text-amber-400 animate-bounce [animation-duration:2.5s]" />
            <span>{hero.gold.toLocaleString()} G</span>
          </div>

          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/40 px-2.5 py-1 text-xs font-mono font-bold text-rose-400 shadow-sm">
            <Flame className="h-4 w-4 text-rose-500 animate-pulse" />
            <span>{hero.streakCount}D</span>
          </div>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute 8-bit sound effects' : 'Mute sound effects'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
