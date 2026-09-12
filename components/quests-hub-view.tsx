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
  Repeat,
  Zap,
  ListTodo,
  CalendarCheck,
} from 'lucide-react';
import { ChronoKnightCard } from '@/components/chrono-knight-card';
import { QuestCard, CyberQuest } from '@/components/quest-card';
import { HabitListView } from '@/components/habit-list-view';
import { DailiesListView } from '@/components/dailies-list-view';
import { TodosListView } from '@/components/todos-list-view';
import { StartingObjectivesBanner } from '@/components/starting-objectives-banner';
import { HeroState, HabitItem, DailyItem, TodoItem, StartingObjective } from '@/types/game';
import { sound } from '@/lib/sound';

export type ForgeSubTab = 'PROTOCOLS' | 'HABITS' | 'DAILIES' | 'TODOS';

interface QuestsHubViewProps {
  hero: HeroState;
  quests: CyberQuest[];
  habits: HabitItem[];
  dailies: DailyItem[];
  todos: TodoItem[];
  startingObjectives: StartingObjective[];
  onToggleStatus: (id: string, completed: boolean) => void;
  onOpenCreateQuest: () => void;
  onToggleOverclock: () => void;
  onClaimAll: () => void;
  onTriggerHabitPlus: (habit: HabitItem, e: React.MouseEvent) => void;
  onTriggerHabitMinus: (habit: HabitItem, e: React.MouseEvent) => void;
  onToggleDaily: (daily: DailyItem, e: React.MouseEvent) => void;
  onToggleTodo: (todo: TodoItem, e: React.MouseEvent) => void;
  onCompleteObjective?: (id: string) => void;
}

export const QuestsHubView: React.FC<QuestsHubViewProps> = ({
  hero,
  quests,
  habits,
  dailies,
  todos,
  startingObjectives,
  onToggleStatus,
  onOpenCreateQuest,
  onToggleOverclock,
  onClaimAll,
  onTriggerHabitPlus,
  onTriggerHabitMinus,
  onToggleDaily,
  onToggleTodo,
  onCompleteObjective,
}) => {
  const [subTab, setSubTab] = useState<ForgeSubTab>('PROTOCOLS');
  const [questFilter, setQuestFilter] = useState<'ALL' | 'RITUALS' | 'BOSS' | 'COMPLETED'>('ALL');

  const totalQuestsCount = quests.length;
  const ritualsCount = quests.filter((q) => !q.isBoss).length;
  const bossCount = quests.filter((q) => q.isBoss).length;

  const filteredQuests = quests.filter((q) => {
    if (questFilter === 'ALL') return true;
    if (questFilter === 'RITUALS') return !q.isBoss;
    if (questFilter === 'BOSS') return q.isBoss;
    if (questFilter === 'COMPLETED') return q.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Starting Objectives Banner */}
      {startingObjectives && startingObjectives.length > 0 && (
        <StartingObjectivesBanner
          objectives={startingObjectives}
          onCompleteObjective={onCompleteObjective}
        />
      )}

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

      {/* Primary Sub-Tab Switcher: Protocols / Habits / Dailies / To-Dos */}
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-indigo-950/80 bg-[#0d0922] p-1.5 font-mono text-xs shadow-inner">
        <button
          onClick={() => {
            sound.playClick();
            setSubTab('PROTOCOLS');
          }}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 font-black transition-all ${
            subTab === 'PROTOCOLS'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Protocols</span>
          <span className="sm:hidden">Quests</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setSubTab('HABITS');
          }}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 font-black transition-all ${
            subTab === 'HABITS'
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Habits</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setSubTab('DAILIES');
          }}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 font-black transition-all ${
            subTab === 'DAILIES'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Dailies</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setSubTab('TODOS');
          }}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 font-black transition-all ${
            subTab === 'TODOS'
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>To-Dos</span>
        </button>
      </div>

      {/* Sub-Tab Content Rendering */}
      {subTab === 'PROTOCOLS' && (
        <div className="space-y-4">
          {/* Filter Pills Navigation Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            <button
              onClick={() => {
                sound.playClick();
                setQuestFilter('ALL');
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-black transition-all shrink-0 ${
                questFilter === 'ALL'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                  : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>:: All Quests</span>
              <span
                className={`rounded-md px-1.5 py-0.2 text-[10px] font-black ${
                  questFilter === 'ALL'
                    ? 'bg-amber-950 text-amber-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {totalQuestsCount}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setQuestFilter('RITUALS');
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-black transition-all shrink-0 ${
                questFilter === 'RITUALS'
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
                setQuestFilter('BOSS');
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-black transition-all shrink-0 ${
                questFilter === 'BOSS'
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
                setQuestFilter('COMPLETED');
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-black transition-all shrink-0 ${
                questFilter === 'COMPLETED'
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
                <span>Claim Ready</span>
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
                <QuestCard key={quest.id} quest={quest} onToggleStatus={onToggleStatus} />
              ))
            )}
          </div>
        </div>
      )}

      {subTab === 'HABITS' && (
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
                HABIT MATRIX // POSITIVE & NEGATIVE
              </h3>
              <p className="text-[11px] text-slate-400">
                Tap (+) for XP & Combo boosts. Tap (-) deals direct HP damage!
              </p>
            </div>
          </div>

          <HabitListView
            habits={habits}
            onTriggerPlus={onTriggerHabitPlus}
            onTriggerMinus={onTriggerHabitMinus}
          />
        </div>
      )}

      {subTab === 'DAILIES' && (
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-wider">
                DAILY RITUALS // STREAK FORGE
              </h3>
              <p className="text-[11px] text-slate-400">
                Complete daily to build consecutive streak flame multipliers.
              </p>
            </div>
          </div>

          <DailiesListView dailies={dailies} onToggleDaily={onToggleDaily} />
        </div>
      )}

      {subTab === 'TODOS' && (
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider">
                BOUNTIES & TO-DOS // TASK PROTOCOLS
              </h3>
              <p className="text-[11px] text-slate-400">
                One-off objectives that grant massive XP and charge World Boss damage.
              </p>
            </div>
          </div>

          <TodosListView todos={todos} onToggleTodo={onToggleTodo} />
        </div>
      )}
    </div>
  );
};
