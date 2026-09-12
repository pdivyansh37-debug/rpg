'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Pencil, Trash2 } from 'lucide-react';
import { DailyItem } from '@/types/game';
import { sound } from '@/lib/sound';

interface DailiesListViewProps {
  dailies: DailyItem[];
  onToggleDaily: (daily: DailyItem, e: React.MouseEvent) => void;
  onEditDaily?: (daily: DailyItem) => void;
  onDeleteDaily?: (id: string) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const DailiesListView: React.FC<DailiesListViewProps> = ({
  dailies,
  onToggleDaily,
  onEditDaily,
  onDeleteDaily,
}) => {
  const currentDayIndex = new Date().getDay();

  return (
    <div className="space-y-3 font-mono">
      {dailies.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-indigo-950/80 bg-[#0e0a1e]/40 p-8 text-center text-slate-400 text-xs">
          No daily rituals scheduled. Tap the + button to configure recurring routines!
        </div>
      ) : (
        dailies.map((daily) => {
          return (
            <motion.div
              key={daily.id}
              layout
              className={`group overflow-hidden rounded-2xl border transition-all ${
                daily.completed
                  ? 'border-indigo-950/60 bg-[#0b081c]/60 opacity-60'
                  : 'border-indigo-950/90 bg-[#0f0b26] hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
              }`}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Left Checkbox Button */}
                <button
                  onClick={(e) => {
                    sound.playTaskComplete();
                    onToggleDaily(daily, e);
                  }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 transition-all ${
                    daily.completed
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-400 text-white shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                      : 'border-purple-400/80 bg-purple-950/40 text-transparent hover:border-purple-300 hover:bg-purple-900/60'
                  }`}
                >
                  <Check className="h-6 w-6 stroke-[3.5]" />
                </button>

                {/* Center Content */}
                <div
                  onClick={() => onEditDaily?.(daily)}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <h3
                    className={`text-sm sm:text-base font-black tracking-tight ${
                      daily.completed
                        ? 'line-through text-slate-500'
                        : 'text-white group-hover:text-purple-300 transition-colors truncate'
                    }`}
                  >
                    {daily.title}
                  </h3>
                  {daily.notes && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 font-normal">
                      {daily.notes}
                    </p>
                  )}

                  {/* Day Pills */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {DAYS.map((day, idx) => {
                      const isActiveDay = daily.daysOfWeek.includes(idx);
                      const isToday = idx === currentDayIndex;

                      return (
                        <span
                          key={idx}
                          className={`flex h-4 w-4 items-center justify-center rounded-md text-[9px] font-bold ${
                            isToday && isActiveDay
                              ? 'bg-purple-600 text-white shadow-[0_0_6px_rgba(168,85,247,0.8)]'
                              : isActiveDay
                              ? 'bg-indigo-950 border border-indigo-800 text-slate-300'
                              : 'text-slate-600'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Right Actions: Streak Badge + Edit/Delete Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 text-xs font-black text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2.5 py-1 rounded-xl shadow-[0_0_8px_rgba(251,191,36,0.2)]">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                    <span>{daily.streak}D</span>
                  </div>

                  {onEditDaily && (
                    <button
                      type="button"
                      onClick={() => onEditDaily(daily)}
                      title="Edit Daily"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onDeleteDaily && (
                    <button
                      type="button"
                      onClick={() => onDeleteDaily(daily.id)}
                      title="Delete Daily"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-rose-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};
