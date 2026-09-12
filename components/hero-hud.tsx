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
  LogIn,
  Heart,
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
  comboMultiplier?: number;
  currentUser?: {
    username: string;
    email?: string | null;
    isGuest: boolean;
  };
  onProfileClick?: () => void;
  onAuthClick?: () => void;
}

export const HeroHud: React.FC<HeroHudProps> = ({
  hero,
  comboMultiplier = 1.0,
  currentUser,
  onProfileClick,
  onAuthClick,
}) => {
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

  const hpVal = hero.hp ?? 800;
  const maxHpVal = hero.maxHp ?? 800;
  const hpPercent = Math.min(100, Math.max(0, Math.round((hpVal / maxHpVal) * 100)));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-indigo-950/80 bg-white/90 dark:bg-[#0c0c1e]/90 backdrop-blur-md shadow-sm dark:shadow-2xl transition-colors duration-200 font-mono">
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

          {/* Right: Combo multiplier, Gold, Streak, Auth, SFX */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Active Combo Multiplier Pill */}
            {comboMultiplier > 1.0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 rounded-full border border-purple-400 bg-purple-950/90 px-2 py-0.5 text-[11px] font-black text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.6)] animate-pulse"
              >
                <Zap className="w-3 h-3 text-yellow-300" />
                <span>x{comboMultiplier.toFixed(1)} COMBO</span>
              </motion.div>
            )}

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

            {/* Google / Account Auth Button */}
            <button
              onClick={() => {
                sound.playClick();
                onAuthClick?.();
              }}
              title={currentUser && !currentUser.isGuest ? 'Google Account Linked' : 'Sign in with Google'}
              className={`flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-all ${
                currentUser && !currentUser.isGuest
                  ? 'border border-emerald-500/80 bg-emerald-950/70 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'border border-cyan-500/80 bg-cyan-950/70 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/80'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {currentUser && !currentUser.isGuest ? 'Cloud Sync' : 'Google Auth'}
              </span>
            </button>

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

        {/* Dual Gauges: Health (HP) & Synapse XP */}
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5 border-t border-indigo-950/60">
          {/* Health Gauge */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                VITALITY MATRIX
              </span>
              <span className="text-rose-300 font-extrabold">
                {hpVal} / {maxHpVal} HP
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full border border-rose-950 bg-[#16050b]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.7)]"
              />
            </div>
          </div>

          {/* Synapse XP Gauge */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                SYNAPSE PROGRESSION
              </span>
              <span className="text-cyan-300 font-extrabold">
                {hero.currentXp.toLocaleString()} / {hero.nextLevelXp.toLocaleString()} XP ({xpPercent}%)
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full border border-indigo-900/60 bg-[#090918]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(236,72,153,0.75)]"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
