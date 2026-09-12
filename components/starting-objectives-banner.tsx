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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = objectives.filter((o) => o.completed).length;
  const totalCount = objectives.length;
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  if (isAllCompleted) {
    return null; // Don't take up any space on mobile once all starting objectives are done!
  }

  return (
    <div className="w-full font-mono">
      {/* Sleek Banner Card with Cyberpunk Neon Border */}
      <div
        onClick={() => {
          sound.playClick();
          setIsExpanded(!isExpanded);
        }}
        className="relative cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-[1.5px] shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all active:scale-[0.99] hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]"
      >
        <div className="relative rounded-[14px] bg-[#0d0922] px-3 py-2 sm:px-3.5 sm:py-2.5">
          {/* Subtle decorative grid overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Single Compact Header Line on Mobile */}
          <div className="relative flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-base text-cyan-400 leading-none drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]">✦</span>
              <h2 className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
                Starter Quests
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Gold Reward Pill */}
              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border border-amber-500/80 px-2 py-0.5 text-[10px] font-black text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                <span>🪙</span>
                <span>+100G</span>
              </div>

              {/* Count & Toggle Indicator */}
              <div className="flex items-center gap-1 text-[11px] font-black text-cyan-300">
                <span>{completedCount}/{totalCount}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-cyan-400" />
                )}
              </div>
            </div>
          </div>

          {/* Slim Progress Bar */}
          <div className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full border border-indigo-900/60 bg-[#070414]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            />
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
            className="overflow-hidden mt-1.5 rounded-2xl border border-indigo-900/80 bg-[#0f0b28] p-2.5 text-xs text-slate-200 space-y-1.5 shadow-inner"
          >
            <div className="font-extrabold text-cyan-300 flex justify-between items-center text-[10px] mb-0.5">
              <span>// PROTOCOL CHECKLIST</span>
              <span className="text-amber-400 font-bold">+100 Gold Reward</span>
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
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#150f36] border-indigo-950 hover:border-cyan-500/50 hover:bg-[#1a1344]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {obj.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}
                  <span className={`text-[11px] ${obj.completed ? 'line-through text-slate-500 font-medium' : 'font-bold text-white truncate'}`}>
                    {obj.title}
                  </span>
                </div>
                <span className="font-black text-[10px] text-amber-400 shrink-0 ml-2">
                  +{obj.rewardGold}G
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
