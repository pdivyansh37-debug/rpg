'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Edit2, Sparkles, AlertCircle } from 'lucide-react';
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
  const [selectedHabit, setSelectedHabit] = useState<HabitItem | null>(null);

  return (
    <div className="space-y-3">
      {habits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 text-sm">
          No habits found. Tap the purple + button below to forge a new habit!
        </div>
      ) : (
        habits.map((habit) => (
          <motion.div
            key={habit.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex items-stretch overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100/90 transition-shadow hover:shadow-md"
          >
            {/* Left Button Column: Positive (+) */}
            <div className="flex shrink-0 items-center justify-center p-2.5 sm:p-3">
              {habit.isPositive ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playHabitPlus();
                    onTriggerPlus(habit, e);
                  }}
                  title="Record positive habit (+XP, +Gold)"
                  className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#FFA726] text-white shadow-sm transition-transform active:scale-90 hover:brightness-105"
                >
                  <Plus className="h-6 w-6 stroke-[3.5]" />
                </button>
              ) : (
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border-2 border-slate-200 text-slate-300">
                  <Plus className="h-5 w-5 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Center Content: Title & Notes (Click to edit) */}
            <div
              onClick={() => onEditHabit?.(habit)}
              className="flex flex-1 cursor-pointer flex-col justify-center px-2 py-3 text-left"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight leading-snug group-hover:text-purple-700 transition-colors">
                {habit.title}
              </h3>
              {habit.notes && (
                <p className="text-xs text-slate-400 mt-0.5 font-normal leading-relaxed line-clamp-2">
                  {habit.notes}
                </p>
              )}
            </div>

            {/* Right Button Column: Negative (-) */}
            <div className="flex shrink-0 items-center justify-center p-2.5 sm:p-3">
              {habit.isNegative ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playHabitMinus();
                    onTriggerMinus(habit, e);
                  }}
                  title="Record bad habit (Damages HP)"
                  className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#FFA726] text-white shadow-sm transition-transform active:scale-90 hover:brightness-105"
                >
                  <Minus className="h-6 w-6 stroke-[3.5]" />
                </button>
              ) : (
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border-2 border-slate-200 text-slate-300">
                  <Minus className="h-5 w-5 stroke-[2.5]" />
                </div>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};
