'use client';

import React, { useState, useTransition, useOptimistic } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sword,
  BookOpen,
  HeartPulse,
  Zap,
  Check,
  Clock,
  Sparkles,
  Skull,
  Coins,
  Loader2,
  Flame,
  Shield,
  Dumbbell,
  Droplet,
  Layers,
  Pencil,
  Trash2,
} from 'lucide-react';
import { completeQuest, QuestCompletionData } from '@/actions/quest-actions';
import { LevelUpModal } from './level-up-modal';
import { sound } from '@/lib/sound';

export interface CyberQuest {
  id: string;
  title: string;
  description?: string | null;
  difficulty: 'TRIVIAL' | 'EASY' | 'MEDIUM' | 'HARD';
  attributeType: 'STRENGTH' | 'INTELLECT' | 'STAMINA' | 'AGILITY';
  xpReward: number;
  goldReward: number;
  streakBonus?: number;
  completed: boolean;
  dueDate?: string | null;
  timeString?: string;
  protocolType?: string; // e.g. "BOSS GATE // INTELLECT", "RITUAL // STRENGTH"
  metaBadge?: string; // e.g. "BOSS GATE", "3 Sets", "Ready to Claim", "Daily Cycle"
  isBoss?: boolean;
}

export interface QuestCardProps {
  quest: CyberQuest;
  onQuestCompleted?: (data: QuestCompletionData) => void;
  onToggleStatus?: (id: string, completed: boolean) => void;
  onEdit?: (quest: CyberQuest) => void;
  onDelete?: (id: string) => void;
}

// Visual Themes per Attribute / Card Category
const THEME_CONFIG = {
  INTELLECT: {
    border: 'border-pink-500/80 hover:border-pink-400',
    borderCompleted: 'border-pink-900/40',
    bg: 'bg-gradient-to-r from-[#1e0a24]/90 via-[#180820]/90 to-[#0f0717]/90',
    glow: 'shadow-[0_0_20px_rgba(255,42,133,0.22)]',
    checkboxBorder: 'border-pink-500 group-hover:border-pink-400',
    checkboxBg: 'bg-pink-500/20 text-pink-300',
    bracketColor: 'text-pink-400/90',
    attrColor: 'bg-pink-950/70 border-pink-500/60 text-pink-300',
    icon: BookOpen,
    badgeText: 'INTELLECT',
  },
  STRENGTH: {
    border: 'border-amber-500/80 hover:border-amber-400',
    borderCompleted: 'border-amber-900/40',
    bg: 'bg-gradient-to-r from-[#211406]/90 via-[#1a0f05]/90 to-[#0e0a05]/90',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.22)]',
    checkboxBorder: 'border-amber-500 group-hover:border-amber-400',
    checkboxBg: 'bg-amber-500/20 text-amber-300',
    bracketColor: 'text-amber-400/90',
    attrColor: 'bg-amber-950/70 border-amber-500/60 text-amber-300',
    icon: Sword,
    badgeText: 'STRENGTH',
  },
  STAMINA: {
    border: 'border-cyan-500/80 hover:border-cyan-400',
    borderCompleted: 'border-cyan-900/40',
    bg: 'bg-gradient-to-r from-[#061c24]/90 via-[#05141c]/90 to-[#040c14]/90',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.22)]',
    checkboxBorder: 'border-cyan-500 group-hover:border-cyan-400',
    checkboxBg: 'bg-cyan-500/20 text-cyan-300',
    bracketColor: 'text-cyan-400/90',
    attrColor: 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300',
    icon: HeartPulse,
    badgeText: 'STAMINA',
  },
  AGILITY: {
    border: 'border-emerald-500/80 hover:border-emerald-400',
    borderCompleted: 'border-emerald-900/40',
    bg: 'bg-gradient-to-r from-[#072018]/90 via-[#051812]/90 to-[#040e0b]/90',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.22)]',
    checkboxBorder: 'border-emerald-500 group-hover:border-emerald-400',
    checkboxBg: 'bg-emerald-500/20 text-emerald-300',
    bracketColor: 'text-emerald-400/90',
    attrColor: 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300',
    icon: Zap,
    badgeText: 'AGILITY',
  },
};

const DIFFICULTY_CONFIG = {
  TRIVIAL: 'bg-slate-900/90 border-slate-700 text-slate-300',
  EASY: 'bg-cyan-950/90 border-cyan-500/70 text-cyan-300',
  MEDIUM: 'bg-amber-950/90 border-amber-500/80 text-amber-300 font-bold',
  HARD: 'bg-rose-950/90 border-rose-500 text-rose-300 font-black shadow-[0_0_10px_rgba(244,63,94,0.4)]',
};

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onQuestCompleted,
  onToggleStatus,
  onEdit,
  onDelete,
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

  const theme = THEME_CONFIG[quest.attributeType] || THEME_CONFIG.STRENGTH;
  const AttrIcon = theme.icon;

  const protocolTag =
    quest.protocolType ||
    (quest.isBoss
      ? `[ BOSS GATE // ${quest.attributeType} ]`
      : `[ RITUAL // ${quest.attributeType} ]`);

  const streakBonus = quest.streakBonus ?? Math.round(quest.goldReward * 0.1);

  const triggerConfetti = (isBoss: boolean) => {
    confetti({
      particleCount: isBoss ? 100 : 50,
      spread: 75,
      origin: { y: 0.75 },
      colors: isBoss
        ? ['#ff2a85', '#9d4edd', '#00f0ff', '#ffd166']
        : ['#fb8500', '#ffb703', '#00f0ff', '#06d6a0'],
      ticks: 220,
      gravity: 1.1,
      scalar: 1.1,
    });
  };

  const handleToggle = () => {
    if (isPending) return;

    if (quest.completed) {
      // Toggle back to incomplete
      sound.playClick();
      onToggleStatus?.(quest.id, false);
      return;
    }

    startTransition(async () => {
      // 1. Play audio
      if (quest.isBoss) {
        sound.playBossGate();
      } else {
        sound.playQuestComplete();
      }

      // 2. Trigger floating rewards
      setFloatingRewards({
        show: true,
        xp: quest.xpReward,
        gold: quest.goldReward + streakBonus,
      });

      // 3. Trigger Particle Confetti
      triggerConfetti(!!quest.isBoss);

      // 4. Update parent state
      onToggleStatus?.(quest.id, true);

      // 5. Try server action
      try {
        const result = await completeQuest(quest.id);
        if (result.success) {
          onQuestCompleted?.(result.data);
          if (
            result.data.levelUp.didLevelUp ||
            result.data.attributeLevelUp.didLevelUp
          ) {
            setLevelUpData(result.data);
            setIsLevelUpOpen(true);
          }
        }
      } catch {
        // standalone mock mode supported
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
        whileHover={{ scale: quest.completed ? 1 : 1.01 }}
        transition={{ duration: 0.2 }}
        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
          quest.completed
            ? `${theme.borderCompleted} bg-[#0b0814]/70 opacity-60`
            : `${theme.border} ${theme.bg} ${theme.glow}`
        }`}
      >
        {/* Floating XP & Gold Indicator */}
        <AnimatePresence>
          {floatingRewards.show && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -45, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
              onAnimationComplete={() =>
                setFloatingRewards({ show: false, xp: 0, gold: 0 })
              }
              className="pointer-events-none absolute right-6 top-3 z-30 flex items-center gap-3 font-mono font-black"
            >
              <span className="flex items-center text-sm text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]">
                +{floatingRewards.xp} XP
              </span>
              <span className="flex items-center text-sm text-amber-300 drop-shadow-[0_0_8px_rgba(255,183,3,0.9)]">
                +{floatingRewards.gold} 🪙
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start gap-3.5 p-4 sm:p-4.5">
          {/* Large Tactile Neon Checkbox Button */}
          <button
            type="button"
            role="checkbox"
            aria-checked={quest.completed}
            aria-label={`Complete protocol: ${quest.title}`}
            disabled={isPending}
            onClick={handleToggle}
            className={`group relative mt-1 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              quest.completed
                ? `${theme.checkboxBg} border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]`
                : `border-2 ${theme.checkboxBorder} bg-[#0e0a1a] shadow-[0_0_10px_rgba(0,0,0,0.5)]`
            }`}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            ) : quest.completed ? (
              <Check className="h-5 w-5 stroke-[3] text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            ) : (
              <span className="h-2 w-2 rounded-sm bg-transparent group-hover:bg-white/40 transition-colors" />
            )}
          </button>

          {/* Quest Info Body */}
          <div className="flex-1 min-w-0">
            {/* Top Row: Difficulty + Attribute + Time + Protocol Bracket */}
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Difficulty Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono uppercase tracking-wider ${
                    DIFFICULTY_CONFIG[quest.difficulty]
                  }`}
                >
                  {quest.difficulty === 'HARD' ? '🔴 HARD' : quest.difficulty === 'MEDIUM' ? '⚡ MEDIUM' : quest.difficulty === 'EASY' ? '🔵 EASY' : '⚡ TRIVIAL'}
                </span>

                {/* Attribute & XP Gain */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold tracking-wider ${theme.attrColor}`}
                >
                  <AttrIcon className="w-3 h-3" />
                  <span>{theme.badgeText} +{quest.xpReward} XP</span>
                </span>

                {/* Optional Time Indicator */}
                {quest.timeString && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-purple-800/80 bg-purple-950/70 text-[10px] font-mono text-purple-300">
                    <Clock className="w-3 h-3" />
                    <span>{quest.timeString}</span>
                  </span>
                )}
              </div>

              {/* Protocol Bracket Tag on Right */}
              <div className="flex items-center gap-1.5">
                <span className={`font-mono text-[10px] sm:text-[11px] font-bold ${theme.bracketColor}`}>
                  {protocolTag}
                </span>

                {quest.metaBadge === 'Ready to Claim' && !quest.completed && (
                  <span className="rounded-md border border-cyan-400 bg-cyan-950/80 px-2 py-0.5 font-mono text-[10px] font-black text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.4)] animate-pulse">
                    Ready to Claim
                  </span>
                )}
              </div>
            </div>

            {/* Quest Title */}
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight text-white transition-colors ${
                quest.completed ? 'line-through text-slate-500' : 'hover:text-cyan-300'
              }`}
            >
              {quest.title}
            </h3>

            {quest.description && (
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                {quest.description}
              </p>
            )}

            {/* Bottom Reward Bar */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
              {/* Left: Gold Pill + Streak Bonus */}
              <div className="flex items-center gap-2 font-mono">
                <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/70 bg-gradient-to-r from-amber-950/80 to-slate-900 px-2.5 py-1 text-xs font-black text-amber-300 shadow-sm">
                  <span className="text-xs">🪙</span>
                  <span>+{quest.goldReward} Gold</span>
                </div>

                {streakBonus > 0 && (
                  <span className="text-[11px] text-amber-400/90 font-bold">
                    (Streak +{streakBonus}g)
                  </span>
                )}
              </div>

              {/* Right: Meta Tag Badge + Action Buttons (Edit / Delete) */}
              <div className="flex items-center gap-1.5">
                {quest.metaBadge && (
                  <div>
                    {quest.metaBadge === 'BOSS GATE' ? (
                      <span className="flex items-center gap-1 rounded-lg border border-cyan-400/80 bg-gradient-to-r from-blue-950 to-cyan-950 px-2 py-1 font-mono text-[10px] font-black text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.35)]">
                        <Skull className="w-3 h-3 text-cyan-400" />
                        <span>BOSS GATE</span>
                      </span>
                    ) : quest.metaBadge === '3 Sets' ? (
                      <span className="flex items-center gap-1 rounded-lg border border-purple-500/80 bg-purple-950/80 px-2 py-1 font-mono text-[10px] font-bold text-purple-300 shadow-sm">
                        <Dumbbell className="w-3 h-3 text-purple-400" />
                        <span>3 Sets</span>
                      </span>
                    ) : quest.metaBadge === 'Daily Cycle' ? (
                      <span className="flex items-center gap-1 rounded-lg border border-cyan-500/80 bg-cyan-950/80 px-2 py-1 font-mono text-[10px] font-bold text-cyan-300 shadow-sm">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>Daily Cycle</span>
                      </span>
                    ) : (
                      <span className="rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 font-mono text-[10px] font-bold text-slate-300">
                        {quest.metaBadge}
                      </span>
                    )}
                  </div>
                )}

                {/* Edit Button */}
                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      onEdit(quest);
                    }}
                    title="Edit Protocol"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      onDelete(quest.id);
                    }}
                    title="Delete Protocol"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-rose-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
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

