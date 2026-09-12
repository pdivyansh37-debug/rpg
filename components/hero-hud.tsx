'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Coins,
  Shield,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Zap,
  LogIn,
  Heart,
  Settings,
  X,
  Palette,
} from 'lucide-react';
import { sound } from '@/lib/sound';
import { ThemeToggle } from './theme-toggle';
import { AvatarConfig, ActiveBuffs } from '@/types/game';
import { PixelAvatar, DEFAULT_AVATAR } from './pixel-avatar';

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
    avatar?: AvatarConfig;
  };
  comboMultiplier?: number;
  activeBuffs?: ActiveBuffs;
  currentUser?: {
    username: string;
    email?: string | null;
    isGuest: boolean;
  };
  onProfileClick?: () => void;
  onAuthClick?: () => void;
  onOpenAvatarCustomizer?: () => void;
}

export const HeroHud: React.FC<HeroHudProps> = ({
  hero,
  comboMultiplier = 1.0,
  activeBuffs,
  currentUser,
  onProfileClick,
  onAuthClick,
  onOpenAvatarCustomizer,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-indigo-950/80 bg-[#09061a]/95 backdrop-blur-md shadow-2xl transition-colors duration-200 font-mono">
      <div className="mx-auto max-w-lg sm:max-w-xl px-3 py-2 sm:px-4">
        {/* Main Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Avatar Crest + Username / Customizer Trigger */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAvatarCustomizer?.();
              }}
              title="Customize Avatar"
              className="relative shrink-0 group transition-transform active:scale-95"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border-2 border-cyan-400 bg-gradient-to-b from-indigo-950 to-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)] overflow-hidden group-hover:border-amber-400 transition-colors">
                <PixelAvatar config={hero.avatar || DEFAULT_AVATAR} size={34} />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-full border border-purple-400 bg-purple-900 font-mono text-[9px] font-black text-purple-200 shadow-[0_0_6px_rgba(168,85,247,0.8)]">
                {hero.level}
              </span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onProfileClick}
                  className="text-xs sm:text-sm font-black text-white hover:text-cyan-300 truncate max-w-[110px] sm:max-w-[160px] text-left leading-tight"
                >
                  {hero.username}
                </button>
                <button
                  type="button"
                  onClick={onOpenAvatarCustomizer}
                  title="Customize Avatar"
                  className="rounded border border-pink-500/60 bg-pink-950/50 px-1 py-0.2 text-[9px] font-bold text-pink-300 hover:border-pink-400 shrink-0"
                >
                  🎨 MK-VII
                </button>
              </div>

              {/* Status Buff Indicator */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 leading-none mt-0.5">
                {activeBuffs?.xpBoosterActive ? (
                  <span className="text-purple-300 font-black animate-pulse flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-yellow-300" />
                    2x XP ACTIVE
                  </span>
                ) : (
                  <span className="text-cyan-400/80 font-bold">CHRONO-KNIGHT</span>
                )}
                {activeBuffs && activeBuffs.streakShields > 0 && (
                  <span className="text-cyan-300 font-bold">
                    ❄️ x{activeBuffs.streakShields}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Currency Badges + Quick Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Combo Badge (if > 1.0) */}
            {comboMultiplier > 1.0 && (
              <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-purple-400 bg-purple-950/90 px-1.5 py-0.5 text-[10px] font-black text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                <Zap className="w-2.5 h-2.5 text-yellow-300" />
                <span>x{comboMultiplier.toFixed(1)}</span>
              </div>
            )}

            {/* Gold Badge */}
            <div className="flex items-center gap-1 rounded-full border border-amber-500/80 bg-gradient-to-r from-amber-950/80 to-slate-900/90 px-2 py-0.5 text-[11px] font-black text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              <span>🪙</span>
              <span>{hero.gold.toLocaleString()}</span>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-1 rounded-full border border-rose-500/80 bg-gradient-to-r from-rose-950/80 to-purple-950/80 px-2 py-0.5 text-[11px] font-black text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
              <Flame className="h-3 w-3 text-orange-400 animate-pulse" />
              <span>{hero.streakCount}D</span>
            </div>

            {/* Quick Menu / Settings Trigger Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsQuickMenuOpen(!isQuickMenuOpen);
              }}
              title="Quick Operator Controls"
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border border-indigo-900 bg-[#140e34] text-slate-300 hover:border-cyan-400 hover:text-white transition-all ml-0.5"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sleek Dual Progress Gauges: HP (Left) & XP (Right) */}
        <div className="mt-2 grid grid-cols-2 gap-2 pt-1.5 border-t border-indigo-950/60">
          {/* Health Gauge */}
          <div>
            <div className="flex items-center justify-between text-[9px] mb-0.5">
              <span className="text-rose-400 font-bold flex items-center gap-0.5">
                <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                HP
              </span>
              <span className="text-rose-300 font-black">
                {hpVal}/{maxHpVal}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#180812] border border-rose-950/80">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hpPercent}%` }}
                className="h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]"
              />
            </div>
          </div>

          {/* Synapse XP Gauge */}
          <div>
            <div className="flex items-center justify-between text-[9px] mb-0.5">
              <span className="text-purple-400 font-bold flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 text-purple-400" />
                EXP
              </span>
              <span className="text-cyan-300 font-black">
                {hero.currentXp}/{hero.nextLevelXp} ({xpPercent}%)
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0d0a20] border border-indigo-950">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Menu Overlay Drawer */}
      <AnimatePresence>
        {isQuickMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-indigo-900/80 bg-[#0d0922]/95 px-3 py-2 sm:px-4 flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2">
              {/* Account Status / Auth */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsQuickMenuOpen(false);
                  onAuthClick?.();
                }}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-bold border transition-all ${
                  currentUser && !currentUser.isGuest
                    ? 'border-emerald-500/80 bg-emerald-950/70 text-emerald-300'
                    : 'border-cyan-500/80 bg-cyan-950/70 text-cyan-300'
                }`}
              >
                <LogIn className="w-3 h-3" />
                <span>
                  {currentUser && !currentUser.isGuest
                    ? `Synced: ${currentUser.username}`
                    : 'Sign In / Up'}
                </span>
              </button>

              {/* Profile Matrix Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsQuickMenuOpen(false);
                  onProfileClick?.();
                }}
                className="flex items-center gap-1 rounded-xl border border-purple-500/60 bg-purple-950/50 px-2.5 py-1 text-[11px] font-bold text-purple-300 hover:text-white"
              >
                <User className="w-3 h-3" />
                <span>Attributes</span>
              </button>

              {/* Avatar Studio */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsQuickMenuOpen(false);
                  onOpenAvatarCustomizer?.();
                }}
                className="flex items-center gap-1 rounded-xl border border-pink-500/60 bg-pink-950/50 px-2.5 py-1 text-[11px] font-bold text-pink-300 hover:text-white"
              >
                <Palette className="w-3 h-3" />
                <span>Avatar</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-950 bg-[#150f36] text-slate-300 hover:text-white"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
