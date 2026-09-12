'use client';

import React, { useState, useTransition, useOptimistic } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sword,
  BookOpen,
  HeartPulse,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Coins,
  Loader2,
} from 'lucide-react';
import { completeQuest, QuestCompletionData } from '@/actions/quest-actions';
import { LevelUpModal } from './level-up-modal';

export interface QuestCardProps {
  quest: {
    id: string;
    title: string;
    description?: string | null;
    difficulty: 'TRIVIAL' | 'EASY' | 'MEDIUM' | 'HARD';
    attributeType: 'STRENGTH' | 'INTELLECT' | 'STAMINA' | 'AGILITY';
    xpReward: number;
    goldReward: number;
    completed: boolean;
    dueDate?: string | null;
  };
  onQuestCompleted?: (data: QuestCompletionData) => void;
}

// Attribute Icon & Color Mapping
const ATTRIBUTE_CONFIG = {
  STRENGTH: {
    icon: Sword,
    color: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
    badge: 'STR',
  },
  INTELLECT: {
    icon: BookOpen,
    color: 'text-sky-400 bg-sky-950/40 border-sky-800/60',
    badge: 'INT',
  },
  STAMINA: {
    icon: HeartPulse,
    color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
    badge: 'STM',
  },
  AGILITY: {
    icon: Zap,
    color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
    badge: 'AGI',
  },
};

const DIFFICULTY_CONFIG = {
  TRIVIAL: 'border-slate-700 text-slate-400',
  EASY: 'border-emerald-700 text-emerald-400',
  MEDIUM: 'border-amber-700 text-amber-400',
  HARD: 'border-rose-600 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
};

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onQuestCompleted,
}) => {
  const [isPending, startTransition] = useTransition();
  const [floatingRewards, setFloatingRewards] = useState<{
    show: boolean;
    xp: number;
    gold: number;
  }>({ show: false, xp: 0, gold: 0 });
  const [levelUpData, setLevelUpData] = useState<QuestCompletionData | null>(
    null
  );
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);

  // Optimistic UI state
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    quest.completed,
    (_, newState: boolean) => newState
  );

  const attr = ATTRIBUTE_CONFIG[quest.attributeType] || ATTRIBUTE_CONFIG.STRENGTH;
  const AttrIcon = attr.icon;

  const triggerConfetti = () => {
    // Custom Gold & Arcane Confetti Burst
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#F59E0B', '#FBBF24', '#818CF8', '#34D399', '#EC4899'],
      ticks: 200,
      gravity: 1.2,
      shapes: ['square', 'circle'],
      scalar: 1.1,
    });
  };

  const handleComplete = () => {
    if (optimisticCompleted || isPending) return;

    startTransition(async () => {
      // 1. Trigger instant Optimistic UI update
      setOptimisticCompleted(true);

      // 2. Play particle rewards pop-up
      setFloatingRewards({
        show: true,
        xp: quest.xpReward,
        gold: quest.goldReward,
      });

      // 3. Trigger tactile confetti burst
      triggerConfetti();

      // 4. Execute Server Action with Anti-Cheat validation
      const result = await completeQuest(quest.id);

      if (result.success) {
        onQuestCompleted?.(result.data);

        // Check if hero or attribute leveled up
        if (result.data.levelUp.didLevelUp || result.data.attributeLevelUp.didLevelUp) {
          setLevelUpData(result.data);
          setIsLevelUpOpen(true);
        }
      } else {
        // Revert optimistic state on network or validation error
        setOptimisticCompleted(false);
        setFloatingRewards({ show: false, xp: 0, gold: 0 });
        console.error('Quest completion failed:', result.error);
      }
    });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: optimisticCompleted ? 1 : 1.01 }}
        transition={{ duration: 0.2 }}
        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
          optimisticCompleted
            ? 'border-slate-800/80 bg-slate-950/50 opacity-60'
            : 'border-slate-800 bg-slate-900/90 shadow-lg hover:border-slate-700 hover:shadow-indigo-500/10'
        }`}
      >
        {/* Floating XP & Gold Indicator */}
        <AnimatePresence>
          {floatingRewards.show && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -45, scale: 1.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              onAnimationComplete={() =>
                setFloatingRewards({ show: false, xp: 0, gold: 0 })
              }
              className="pointer-events-none absolute right-6 top-3 z-30 flex items-center gap-3 font-mono font-black"
            >
              <span className="flex items-center text-sm text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">
                +{floatingRewards.xp} XP
              </span>
              <span className="flex items-center text-sm text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                +{floatingRewards.gold} 🪙
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-4 p-4">
          {/* Tactile Checkbox Button */}
          <button
            type="button"
            role="checkbox"
            aria-checked={optimisticCompleted}
            aria-label={`Complete quest: ${quest.title}`}
            disabled={optimisticCompleted || isPending}
            onClick={handleComplete}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleComplete();
              }
            }}
            className={`group relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
              optimisticCompleted
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                : 'border-slate-700 bg-slate-950 text-transparent hover:border-amber-400 hover:text-amber-400/50'
            }`}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            ) : (
              <CheckCircle2
                className={`h-4 w-4 transition-transform duration-200 ${
                  optimisticCompleted
                    ? 'scale-100 text-emerald-400'
                    : 'scale-75 group-hover:scale-100'
                }`}
              />
            )}
          </button>

          {/* Quest Info Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Attribute Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold tracking-wider ${attr.color}`}
              >
                <AttrIcon className="w-3 h-3" />
                {attr.badge}
              </span>

              {/* Difficulty Badge */}
              <span
                className={`px-2 py-0.5 rounded-md border text-[10px] font-mono uppercase font-semibold ${
                  DIFFICULTY_CONFIG[quest.difficulty]
                }`}
              >
                {quest.difficulty}
              </span>

              {/* Due Date Indicator */}
              {quest.dueDate && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  {new Date(quest.dueDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            <h3
              className={`text-base font-semibold text-slate-100 transition-colors ${
                optimisticCompleted
                  ? 'line-through text-slate-500'
                  : 'hover:text-amber-300'
              }`}
            >
              {quest.title}
            </h3>

            {quest.description && (
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                {quest.description}
              </p>
            )}
          </div>

          {/* Reward Badges */}
          <div className="flex flex-col items-end gap-1 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-1 text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>+{quest.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-md">
              <Coins className="w-3 h-3 text-amber-400" />
              <span>+{quest.goldReward} G</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Level-up Celebratory Fanfare Modal */}
      <LevelUpModal
        isOpen={isLevelUpOpen}
        data={levelUpData}
        onClose={() => setIsLevelUpOpen(false)}
      />
    </>
  );
};
