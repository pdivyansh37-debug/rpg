'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Flame, Sparkles } from 'lucide-react';
import { HabitItem } from '@/types/game';
import { sound } from '@/lib/sound';

interface HabitListViewProps {
  habits: HabitItem[];
  onTriggerPlus: (habit: HabitItem, e: React.MouseEvent) => void;
  onTriggerMinus: (habit: HabitItem, e: React.MouseEvent) => void;
  onEditHabit?: (habit: HabitItem) => void;
  onDeleteHabit?: (id: string) => void;
}

export const HabitListView: React.FC<HabitListViewProps> = ({
  habits,
  onTriggerPlus,
  onTriggerMinus,
  onEditHabit,
  onDeleteHabit,
}) => {
  return (
    <div className="space-y-3 font-mono">
      {habits.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-indigo-950/80 bg-[#0e0a1e]/40 p-8 text-center text-slate-400 text-xs">
          No habits forged yet. Tap the + button to build positive rituals and track vices!
        </div>
      ) : (
        habits.map((habit) => (
          <motion.div
            key={habit.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex items-stretch overflow-hidden rounded-2xl border border-indigo-950/80 bg-[#0f0b24] shadow-md transition-all hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]"
          >
            {/* Left Column: Positive (+) Habit Trigger */}
            <div className="flex shrink-0 items-center justify-center p-2.5">
              {habit.isPositive ? (
                <button
                  onClick={(e) => {
                    sound.playHabitPlus();
                    onTriggerPlus(habit, e);
                  }}
                  title="Forge positive habit (+XP, +Gold, Combo boost)"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-90"
                >
                  <Plus className="h-6 w-6 stroke-[3.5]" />
                </button>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-950 bg-indigo-950/30 text-slate-700">
                  <Plus className="h-5 w-5 stroke-[2]" />
                </div>
              )}
            </div>

            {/* Center Content: Title, Notes, Counters */}
            <div
              onClick={() => onEditHabit?.(habit)}
              className="flex flex-1 cursor-pointer flex-col justify-center px-2 py-3 text-left min-w-0"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors truncate">
                  {habit.title}
                </h3>
                {habit.attributeType && (
                  <span className="rounded-md bg-indigo-950/80 border border-indigo-800 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300 shrink-0">
                    {habit.attributeType}
                  </span>
                )}
              </div>

              {habit.notes && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 font-normal">
                  {habit.notes}
                </p>
              )}

              {/* Counters */}
              <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-bold">
                <span className="text-emerald-400">+{habit.positiveCount || 0} Wins</span>
                <span className="text-rose-400">-{habit.negativeCount || 0} Slips</span>
              </div>
            </div>

            {/* Right Column: Negative (-) Habit Trigger (HP Damage) */}
            <div className="flex shrink-0 items-center justify-center p-2.5">
              {habit.isNegative ? (
                <button
                  onClick={(e) => {
                    sound.playDamage();
                    onTriggerMinus(habit, e);
                  }}
                  title="Record vice / slip-up (-15 HP Damage!)"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)] transition-all hover:scale-105 active:scale-90"
                >
                  <Minus className="h-6 w-6 stroke-[3.5]" />
                </button>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-950 bg-indigo-950/30 text-slate-700">
                  <Minus className="h-5 w-5 stroke-[2]" />
                </div>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};
