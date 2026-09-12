'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Flame, ChevronRight, X } from 'lucide-react';
import { QuestCompletionData } from '@/actions/quest-actions';

interface LevelUpModalProps {
  data: QuestCompletionData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  if (!data || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Animated Glow Backdrop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border-4 border-amber-400 bg-slate-950 p-6 text-slate-100 shadow-[0_0_50px_rgba(251,191,36,0.35)]"
        >
          {/* Retro Pixel Header Banner */}
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-violet-600/20 blur-2xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="flex flex-col items-center text-center">
            {/* Animated Icon Badge */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: 'spring',
                damping: 12,
                stiffness: 200,
                delay: 0.1,
              }}
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50"
            >
              <Trophy className="h-10 w-10 text-slate-950 stroke-[2.5]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30">
                Hero Ascension
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white drop-shadow">
                LEVEL UP!
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Your deeds have echoed through the realm.
              </p>
            </motion.div>

            {/* Level Transition Pill */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="my-5 flex items-center justify-center gap-4 rounded-xl border border-slate-800 bg-slate-900/90 px-6 py-3 shadow-inner"
            >
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Previous</span>
                <span className="text-2xl font-black text-slate-400 font-mono">
                  LV.{data.levelUp.oldLevel}
                </span>
              </div>

              <ChevronRight className="h-6 w-6 text-amber-400 animate-pulse" />

              <div className="flex flex-col items-center">
                <span className="text-xs font-semibold text-amber-400">New Rank</span>
                <span className="text-3xl font-black text-amber-300 font-mono drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  LV.{data.levelUp.newLevel}
                </span>
              </div>
            </motion.div>

            {/* Reward Breakdown Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left text-xs"
            >
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> XP Earned
                </span>
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  +{data.rewards.xp} XP
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <span className="text-amber-400 font-bold">🪙</span> Gold Reward
                </span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  +{data.rewards.gold} Gold
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                  <Flame className="w-4 h-4 text-rose-400" /> {data.rewards.attributeType} XP
                </span>
                <span className="font-mono font-bold text-rose-300 text-sm">
                  +{data.rewards.attributeXp} XP
                </span>
              </div>

              {data.attributeLevelUp.didLevelUp && (
                <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center text-emerald-400 font-semibold">
                  <span>{data.attributeLevelUp.attribute} Upgraded!</span>
                  <span className="font-mono">
                    Lv. {data.attributeLevelUp.oldLevel} → Lv. {data.attributeLevelUp.newLevel}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Claim / Continue Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-mono font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              CLAIM GLORY
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
