'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Flame, ChevronRight, X, Swords } from 'lucide-react';
import { QuestCompletionData } from '@/actions/quest-actions';
import { sound } from '@/lib/sound';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Animated Glow Backdrop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-cyan-400 bg-[#0e0a1e] p-6 text-slate-100 shadow-[0_0_50px_rgba(0,240,255,0.4)]"
        >
          {/* Cyber grid background */}
          <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close modal"
            className="absolute top-4 right-4 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="relative flex flex-col items-center text-center font-mono">
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
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.6)]"
            >
              <Swords className="h-10 w-10 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-black px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/50">
                SYNAPSE OVERCLOCK MATRIX
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                OPERATOR ASCENSION!
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Your neural matrix capacity has elevated to a higher tier.
              </p>
            </motion.div>

            {/* Level Transition Pill */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="my-5 flex items-center justify-center gap-4 rounded-2xl border border-indigo-900/60 bg-[#140f28]/90 px-6 py-3 shadow-inner"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400">Previous</span>
                <span className="text-2xl font-black text-slate-400">
                  LV.{data.levelUp.oldLevel}
                </span>
              </div>

              <ChevronRight className="h-6 w-6 text-cyan-400 animate-pulse" />

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-cyan-400">New Rank</span>
                <span className="text-3xl font-black text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">
                  LV.{data.levelUp.newLevel}
                </span>
              </div>
            </motion.div>

            {/* Reward Breakdown Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full space-y-2 rounded-2xl border border-indigo-950 bg-[#120c24]/80 p-4 text-left text-xs"
            >
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Synapse XP Gained
                </span>
                <span className="font-bold text-cyan-300 text-sm">
                  +{data.rewards.xp} XP
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <span>🪙</span> Bounty Received
                </span>
                <span className="font-bold text-amber-300 text-sm">
                  +{data.rewards.gold} Gold
                </span>
              </div>

              {data.attributeLevelUp.didLevelUp && (
                <div className="mt-2 pt-2 border-t border-indigo-950 flex justify-between items-center text-pink-400 font-bold">
                  <span>{data.attributeLevelUp.attribute} Tier Upgraded!</span>
                  <span>
                    Lv. {data.attributeLevelUp.oldLevel} → Lv. {data.attributeLevelUp.newLevel}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Claim Glory Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 py-3 font-mono font-black text-white shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all hover:brightness-110 focus:outline-none"
            >
              SYNCHRONIZE MATRIX
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
