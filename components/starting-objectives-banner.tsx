'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import { StartingObjective } from '@/types/game';
import { sound } from '@/lib/sound';

interface StartingObjectivesBannerProps {
  objectives: StartingObjective[];
  onCompleteObjective?: (id: string) => void;
  onClaimAll?: () => void;
}

export const StartingObjectivesBanner: React.FC<StartingObjectivesBannerProps> = ({
  objectives,
  onCompleteObjective,
  onClaimAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = objectives.filter((o) => o.completed).length;
  const totalCount = objectives.length;
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <div className="w-full">
      {/* Banner Card */}
      <div
        onClick={() => {
          sound.playClick();
          setIsExpanded(!isExpanded);
        }}
        className="relative cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-pink-300 p-[2px] shadow-sm transition-transform active:scale-[0.99] hover:shadow-md"
      >
        <div className="relative rounded-[14px] bg-white p-3 sm:p-3.5">
          {/* Subtle decorative confetti background overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Top Line: Icon, Title, Reward */}
          <div className="relative flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl text-purple-600 leading-none">✦</span>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                Starting Objectives
              </h2>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-bold text-slate-800 shadow-sm">
              <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-[9px] font-black">
                H
              </div>
              <span>100</span>
            </div>
          </div>

          {/* Bottom Line: Purple Progress Bar & Count */}
          <div className="relative mt-2.5 flex items-center justify-between gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-[#8A5BEF]"
              />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-purple-700 shrink-0">
              <span>{completedCount} / {totalCount}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Checklist Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-2 rounded-2xl border border-purple-100 bg-purple-50/60 p-3 text-xs text-slate-700 space-y-2 shadow-inner"
          >
            <div className="font-bold text-purple-900 flex justify-between items-center mb-1">
              <span>Starter Quest Checklist</span>
              <span className="text-[11px] text-purple-600">Earn +100 Gold on finish!</span>
            </div>

            {objectives.map((obj) => (
              <div
                key={obj.id}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onCompleteObjective?.(obj.id);
                }}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                  obj.completed
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                    : 'bg-white border-slate-200/80 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {obj.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={obj.completed ? 'line-through text-slate-500' : 'font-medium'}>
                    {obj.title}
                  </span>
                </div>
                <span className="font-bold text-[11px] text-amber-600 shrink-0">
                  +{obj.rewardGold} Gold
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
