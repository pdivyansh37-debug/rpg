'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Search,
  SlidersHorizontal,
  Heart,
  Sparkles,
  Diamond,
} from 'lucide-react';
import { PixelAvatar } from './pixel-avatar';
import { HabiticaHero } from '@/types/game';
import { sound } from '@/lib/sound';

interface HabiticaHudProps {
  hero: HabiticaHero;
  onOpenMenu?: () => void;
  onOpenAvatarCustomizer?: () => void;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
}

export const HabiticaHud: React.FC<HabiticaHudProps> = ({
  hero,
  onOpenMenu,
  onOpenAvatarCustomizer,
  onSearchClick,
  onFilterClick,
}) => {
  const hpPercent = Math.min(100, Math.max(0, (hero.hp / hero.maxHp) * 100));
  const xpPercent = Math.min(100, Math.max(0, (hero.xp / hero.nextLevelXp) * 100));

  return (
    <header className="w-full bg-white text-slate-800 shadow-sm border-b border-slate-100 sticky top-0 z-30">
      {/* Top Bar (Menu, Name, Search, Filter) */}
      <div className="mx-auto max-w-lg px-4 pt-3 pb-2 flex items-center justify-between">
        {/* Left: Menu & Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onOpenMenu?.();
            }}
            aria-label="Open navigation menu"
            className="text-slate-700 hover:text-slate-950 transition-colors p-1"
          >
            <Menu className="w-6 h-6 stroke-[2.5]" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {hero.username}
          </h1>
        </div>

        {/* Right: Search & Filter Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onSearchClick?.();
            }}
            aria-label="Search tasks"
            className="text-slate-700 hover:text-slate-950 p-1.5 transition-colors"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onFilterClick?.();
            }}
            aria-label="Filter tasks"
            className="text-slate-700 hover:text-slate-950 p-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Character HUD Card */}
      <div className="mx-auto max-w-lg px-4 pb-3">
        <div className="flex items-start gap-4 pt-1">
          {/* Avatar Lilac Box (Left) */}
          <div className="flex flex-col items-center shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                onOpenAvatarCustomizer?.();
              }}
              className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-[#9E8EF0] shadow-sm transition-transform active:scale-95 hover:brightness-105"
              title="Click to customize character avatar"
            >
              <PixelAvatar config={hero.avatar} size={70} />
            </button>
            <span className="mt-1 font-bold text-slate-700 text-xs tracking-wide">
              Lvl. {hero.level}
            </span>
          </div>

          {/* Stat Bars & Currencies (Right) */}
          <div className="flex-1 space-y-2 pt-0.5">
            {/* Health Bar (Red) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center h-4 w-4 rounded-full bg-rose-100 text-rose-500">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  </div>
                  <span className="font-bold text-slate-700">
                    {hero.hp} / {hero.maxHp}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px]">Health</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${hpPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[#FF5C5C]"
                />
              </div>
            </div>

            {/* Experience Bar (Gold/Orange) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 text-sm leading-none font-black">✦</span>
                  <span className="font-bold text-slate-700">
                    {hero.xp} / {hero.nextLevelXp}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px]">Experience</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[#FFB74D]"
                />
              </div>
            </div>

            {/* Mana Bar (Locked until Lv 10 or unlocked) */}
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Diamond className="w-3.5 h-3.5 fill-sky-300 text-sky-400 shrink-0" />
                <span className="text-[11px] text-slate-400">
                  {hero.level >= 10
                    ? `${hero.mana} / ${hero.maxMana} Mana`
                    : 'Unlock by reaching level 10'}
                </span>
              </div>
            </div>

            {/* Currencies Row (Gold & Gems) */}
            <div className="flex items-center justify-end gap-3 pt-0.5 font-bold text-xs">
              {/* Gold Coin */}
              <div className="flex items-center gap-1 text-slate-800">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-[10px] font-black shadow-inner">
                  H
                </div>
                <span>{hero.gold}</span>
              </div>

              {/* Green Gem */}
              <div className="flex items-center gap-1 text-slate-800">
                <div className="h-3.5 w-3.5 rotate-45 rounded-sm bg-emerald-400 border border-emerald-500 shadow-sm" />
                <span>{hero.gems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
