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
    <div className="w-full font-mono">
      {/* Banner Card with Cyberpunk Neon Border */}
      <div
        onClick={() => {
          sound.playClick();
          setIsExpanded(!isExpanded);
        }}
        className="relative cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-[2px] shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all active:scale-[0.99] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
      >
        <div className="relative rounded-[14px] bg-[#0d0922] p-3 sm:p-3.5">
          {/* Subtle decorative grid overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Top Line: Icon, Title, Reward */}
          <div className="relative flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl text-cyan-400 leading-none drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">✦</span>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                Starting Objectives
              </h2>
            </div>

            {/* Gold Reward Pill */}
            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border border-amber-500/80 px-2.5 py-0.5 text-xs font-black text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-[10px] font-black">
                🪙
              </div>
              <span>100</span>
            </div>
          </div>

          {/* Bottom Line: Glowing Progress Bar & Count */}
          <div className="relative mt-2.5 flex items-center justify-between gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full border border-indigo-900/60 bg-[#070414]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]"
              />
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-cyan-300 shrink-0">
              <span>{completedCount} / {totalCount}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
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
            className="overflow-hidden mt-2 rounded-2xl border border-indigo-900/80 bg-[#0f0b28] p-3 text-xs text-slate-200 space-y-2 shadow-inner"
          >
            <div className="font-extrabold text-cyan-300 flex justify-between items-center mb-1">
              <span>// STARTER QUEST PROTOCOLS</span>
              <span className="text-[11px] text-amber-400 font-bold">+100 Gold on completion!</span>
            </div>

            {objectives.map((obj) => (
              <div
                key={obj.id}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  onCompleteObjective?.(obj.id);
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  obj.completed
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#150f36] border-indigo-950 hover:border-cyan-500/50 hover:bg-[#1a1344]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {obj.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  ) : (
                    <Circle className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                  <span className={`text-xs ${obj.completed ? 'line-through text-slate-500 font-medium' : 'font-bold text-white truncate'}`}>
                    {obj.title}
                  </span>
                </div>
                <span className="font-black text-[11px] text-amber-400 shrink-0 ml-2">
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
