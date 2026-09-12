'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, ChevronDown, ChevronUp, Calendar, CheckSquare, Square } from 'lucide-react';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const currentDayIndex = new Date().getDay();

  return (
    <div className="space-y-3">
      {dailies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 text-sm">
          No daily rituals found. Tap the purple + button below to create your daily routine!
        </div>
      ) : (
        dailies.map((daily) => {
          const isExpanded = expandedId === daily.id;

          return (
            <motion.div
              key={daily.id}
              layout
              className={`group overflow-hidden rounded-2xl bg-white shadow-sm border transition-all ${
                daily.completed
                  ? 'border-slate-100 opacity-60 bg-slate-50/70'
                  : 'border-slate-100 hover:border-purple-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Left Checkbox Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playTaskComplete();
                    onToggleDaily(daily, e);
                  }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 transition-all ${
                    daily.completed
                      ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                      : 'border-amber-400 bg-amber-50 text-transparent hover:border-amber-500'
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
                    className={`text-sm sm:text-base font-bold tracking-tight ${
                      daily.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-800 group-hover:text-purple-700 transition-colors'
                    }`}
                  >
                    {daily.title}
                  </h3>
                  {daily.notes && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{daily.notes}</p>
                  )}

                  {/* Day Pills */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {DAYS.map((day, idx) => {
                      const isActiveDay = daily.daysOfWeek.includes(idx);
                      const isToday = idx === currentDayIndex;

                      return (
                        <span
                          key={idx}
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                            isToday && isActiveDay
                              ? 'bg-purple-600 text-white'
                              : isActiveDay
                              ? 'bg-slate-100 text-slate-700'
                              : 'text-slate-300'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Right Streak Badge */}
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-xl shrink-0">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{daily.streak}</span>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};
