'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Coins,
  Shield,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Radio,
  Zap,
} from 'lucide-react';
import { sound } from '@/lib/sound';
import { ThemeToggle } from './theme-toggle';

export interface HeroHudProps {
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
    avatarUrl?: string | null;
  };
  onProfileClick?: () => void;
}

export const HeroHud: React.FC<HeroHudProps> = ({ hero, onProfileClick }) => {
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-indigo-950/80 bg-white/90 dark:bg-[#0c0c1e]/90 backdrop-blur-md shadow-sm dark:shadow-2xl transition-colors duration-200">
      <div className="mx-auto max-w-5xl px-3 py-2.5 sm:px-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Paladin Shield Badge + Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              {/* Gold/Cyan Bordered Shield */}
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-2 border-amber-400 bg-gradient-to-b from-indigo-950 to-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.35)]">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300" />
              </div>
              {/* Overlapping Level Tag */}
              <span className="absolute -bottom-1 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-purple-400 bg-purple-900 font-mono text-[10px] font-black text-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                {hero.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] font-extrabold tracking-widest text-cyan-400">
                  PALADIN
                </span>
                <span className="rounded border border-pink-500/80 bg-pink-950/70 px-1 py-0.2 font-mono text-[9px] font-black text-pink-300">
                  MK-VII
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1">
                Quest Matrix
              </h1>
            </div>
          </div>

          {/* Right: Gold Stash, Streak Pill, Profile Avatar, SFX */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Gold Pill Badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/80 bg-gradient-to-r from-amber-950/80 to-slate-900/90 px-2.5 py-1 text-xs font-mono font-black text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] text-slate-950 font-black">
                🪙
              </span>
              <span>{hero.gold.toLocaleString()}</span>
            </div>

            {/* Streak Flame Pill Badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-rose-500/80 bg-gradient-to-r from-rose-950/80 to-purple-950/80 px-2.5 py-1 text-xs font-mono font-black text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]">
              <Flame className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
              <span>{hero.streakCount}D</span>
            </div>

            {/* Profile Ring Button */}
            <button
              onClick={() => {
                sound.playClick();
                onProfileClick?.();
              }}
              title="Hero Matrix Profile"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-purple-500/80 bg-purple-950/60 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-transform hover:scale-105"
            >
              <User className="h-4 w-4" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute SFX' : 'Mute SFX'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>
        </div>

        {/* Synapse Progression Bar */}
        <div className="mt-2.5 pt-1.5 border-t border-indigo-950/60">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono mb-1">
            <span className="text-purple-400 font-bold tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
              SYNAPSE PROGRESSION
            </span>
            <span className="text-cyan-300 font-extrabold tracking-wide">
              {hero.currentXp.toLocaleString()} / {hero.nextLevelXp.toLocaleString()} XP ({xpPercent}%)
            </span>
          </div>

          {/* Glowing Gradient Bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full border border-indigo-900/60 bg-[#090918]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(236,72,153,0.75)]"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
