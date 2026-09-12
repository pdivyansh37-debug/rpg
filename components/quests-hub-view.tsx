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
  CheckCheck,
} from 'lucide-react';
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
    <div className="space-y-3 sm:space-y-4">
      {/* Starting Objectives Banner */}
      {startingObjectives && startingObjectives.length > 0 && (
        <StartingObjectivesBanner
          objectives={startingObjectives}
          onCompleteObjective={onCompleteObjective}
        />
      )}

      {/* Cyber Quick Action & Overclock Control Bar */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-indigo-950/80 bg-[#0d0922]/90 p-2 sm:p-2.5 font-mono shadow-md backdrop-blur-sm">
        {/* Overclock Toggle Pill */}
        <button
          type="button"
          onClick={() => {
            sound.playOverclock();
            onToggleOverclock();
          }}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-black transition-all border ${
            hero.isOverclocked
              ? 'border-yellow-400 bg-gradient-to-r from-yellow-500/30 to-amber-600/30 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse'
              : 'border-indigo-900 bg-[#140f35] text-slate-400 hover:border-yellow-500/50 hover:text-yellow-300'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${hero.isOverclocked ? 'text-yellow-300 fill-yellow-300' : 'text-slate-400'}`} />
          <span className="text-[11px]">
            {hero.isOverclocked ? '⚡ OVERCLOCK (2x)' : 'OVERCLOCK'}
          </span>
        </button>

        {/* Action Buttons: Create Quest & Claim All */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClaimAll();
            }}
            title="Claim all pending completed quests"
            className="flex items-center gap-1 rounded-xl border border-emerald-500/60 bg-emerald-950/40 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:border-emerald-400 hover:bg-emerald-900/50 transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Claim All</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenCreateQuest();
            }}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1.5 text-[11px] font-black text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Tab Switcher: Protocols / Habits / Dailies / To-Dos */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl border border-indigo-950/80 bg-[#0b081e] p-1 font-mono text-xs shadow-inner">
        <button
          onClick={() => {
            sound.playClick();
            setSubTab('PROTOCOLS');
          }}
          className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl py-2 font-black transition-all ${
            subTab === 'PROTOCOLS'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Protocols</span>
          <span className="sm:hidden text-[11px]">Quests</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setSubTab('HABITS');
          }}
          className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl py-2 font-black transition-all ${
            subTab === 'HABITS'
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Repeat className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-[11px] sm:text-xs">Habits</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setSubTab('DAILIES');
          }}
          className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl py-2 font-black transition-all ${
            subTab === 'DAILIES'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-[11px] sm:text-xs">Dailies</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setSubTab('TODOS');
          }}
          className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl py-2 font-black transition-all ${
            subTab === 'TODOS'
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListTodo className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-[11px] sm:text-xs">To-Dos</span>
        </button>
      </div>

      {/* Sub-Tab Content Rendering */}
      {subTab === 'PROTOCOLS' && (
        <div className="space-y-3">
          {/* Filter Pills Navigation Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            <button
              onClick={() => {
                sound.playClick();
                setQuestFilter('ALL');
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-black transition-all shrink-0 ${
                questFilter === 'ALL'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                  : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>:: All</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[10px] font-black ${
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
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-black transition-all shrink-0 ${
                questFilter === 'RITUALS'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.6)]'
                  : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>⚔️ Rituals</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[10px] font-black ${
                  questFilter === 'RITUALS'
                    ? 'bg-cyan-950 text-cyan-300'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {ritualsCount}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setQuestFilter('BOSS');
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-black transition-all shrink-0 ${
                questFilter === 'BOSS'
                  ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]'
                  : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>💀 Boss Gates</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[10px] font-black ${
                  questFilter === 'BOSS'
                    ? 'bg-purple-950 text-purple-200'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {bossCount}
              </span>
            </button>
          </div>

          {/* Quests Card List */}
          <div className="space-y-2.5">
            {filteredQuests.map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onToggleStatus={onToggleStatus}
              />
            ))}

            {filteredQuests.length === 0 && (
              <div className="rounded-2xl border border-dashed border-indigo-950 bg-[#0d0922]/50 p-6 text-center text-xs font-mono text-slate-500">
                <p>// NO ACTIVE PROTOCOLS IN THIS FILTER</p>
                <button
                  type="button"
                  onClick={onOpenCreateQuest}
                  className="mt-2 text-cyan-400 hover:underline font-bold"
                >
                  + Add a new quest protocol
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'HABITS' && (
        <HabitListView
          habits={habits}
          onTriggerPlus={onTriggerHabitPlus}
          onTriggerMinus={onTriggerHabitMinus}
        />
      )}

      {subTab === 'DAILIES' && (
        <DailiesListView
          dailies={dailies}
          onToggleDaily={onToggleDaily}
        />
      )}

      {subTab === 'TODOS' && (
        <TodosListView
          todos={todos}
          onToggleTodo={onToggleTodo}
        />
      )}
    </div>
  );
};
