'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Flame,
  CheckCircle2,
  Sparkles,
  Clock,
  Skull,
  Search,
  Layers,
} from 'lucide-react';
import { ChronoKnightCard } from '@/components/chrono-knight-card';
import { QuestCard, CyberQuest } from '@/components/quest-card';
import { HeroState } from '@/types/game';
import { sound } from '@/lib/sound';

interface QuestsHubViewProps {
  hero: HeroState;
  quests: CyberQuest[];
  onToggleStatus: (id: string, completed: boolean) => void;
  onOpenCreateQuest: () => void;
  onToggleOverclock: () => void;
  onClaimAll: () => void;
}

export const QuestsHubView: React.FC<QuestsHubViewProps> = ({
  hero,
  quests,
  onToggleStatus,
  onOpenCreateQuest,
  onToggleOverclock,
  onClaimAll,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'RITUALS' | 'BOSS' | 'COMPLETED'>('ALL');

  const totalCount = quests.length;
  const ritualsCount = quests.filter((q) => !q.isBoss).length;
  const bossCount = quests.filter((q) => q.isBoss).length;

  const filteredQuests = quests.filter((q) => {
    if (filter === 'ALL') return true;
    if (filter === 'RITUALS') return !q.isBoss;
    if (filter === 'BOSS') return q.isBoss;
    if (filter === 'COMPLETED') return q.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Central Chrono-Knight HUD Card */}
      <ChronoKnightCard
        hero={{
          username: hero.username,
          level: hero.level,
          currentXp: hero.xp,
          nextLevelXp: hero.nextLevelXp,
          totalXp: hero.totalXp,
          gold: hero.gold,
          streakCount: hero.streakCount,
          hp: hero.hp,
          maxHp: hero.maxHp,
        }}
        isOverclocked={hero.isOverclocked}
        onToggleOverclock={onToggleOverclock}
      />

      {/* Filter Pills Navigation Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
        <button
          onClick={() => {
            sound.playClick();
            setFilter('ALL');
          }}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-black transition-all shrink-0 ${
            filter === 'ALL'
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
              : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <span>:: All Quests</span>
          <span
            className={`rounded-md px-1.5 py-0.2 text-[10px] font-black ${
              filter === 'ALL' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setFilter('RITUALS');
          }}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-black transition-all shrink-0 ${
            filter === 'RITUALS'
              ? 'border border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:border-cyan-800 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Daily Rituals</span>
          <span className="rounded-md bg-cyan-950 border border-cyan-800/80 px-1.5 py-0.2 text-[10px] text-cyan-300">
            {ritualsCount}
          </span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setFilter('BOSS');
          }}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-black transition-all shrink-0 ${
            filter === 'BOSS'
              ? 'border border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:border-rose-900 hover:text-white'
          }`}
        >
          <Skull className="w-3.5 h-3.5 text-rose-400" />
          <span>Boss Gates</span>
          <span className="rounded-md bg-rose-950 border border-rose-800/80 px-1.5 py-0.2 text-[10px] text-rose-300">
            {bossCount}
          </span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setFilter('COMPLETED');
          }}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-black transition-all shrink-0 ${
            filter === 'COMPLETED'
              ? 'border border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Done</span>
        </button>
      </div>

      {/* Section Header: Dispatch Protocols // Active */}
      <div className="flex items-center justify-between gap-2 pt-1 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs sm:text-sm font-extrabold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]">
            DISPATCH PROTOCOLS // ACTIVE
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClaimAll}
            title="Claim all ready rewards"
            className="flex items-center gap-1 rounded-xl border border-amber-400/80 bg-gradient-to-r from-amber-950/90 to-yellow-950/90 px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)] transition-all hover:scale-105 active:scale-95"
          >
            <Search className="w-3 h-3 text-amber-400" />
            <span>Tap trigger to claim</span>
          </button>

          <button
            onClick={onOpenCreateQuest}
            title="Inscribe New Quest"
            className="flex items-center gap-1 rounded-xl border border-cyan-400/80 bg-cyan-950/80 px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.25)] transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Quest Cards Feed */}
      <div className="space-y-3">
        {filteredQuests.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-indigo-950/80 bg-[#0e0a1e]/40 p-10 text-center text-slate-500 font-mono text-xs">
            <Layers className="mx-auto h-8 w-8 text-indigo-400 mb-2 opacity-60" />
            <span>No protocols found in this matrix filter.</span>
          </div>
        ) : (
          filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};
