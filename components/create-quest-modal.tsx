'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Sword,
  BookOpen,
  HeartPulse,
  Zap,
  Sparkles,
  Coins,
  Loader2,
} from 'lucide-react';
import { createQuest } from '@/actions/quest-actions';
import { DIFFICULTY_REWARDS, QuestDifficulty, AttributeType } from '@/lib/progression';
import { sound } from '@/lib/sound';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestCreated?: () => void;
}

const ATTRIBUTES: { type: AttributeType; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'STRENGTH', label: 'Strength (Fitness / Gym)', icon: Sword, color: 'border-rose-700 hover:bg-rose-950/40 text-rose-300' },
  { type: 'INTELLECT', label: 'Intellect (Coding / Reading)', icon: BookOpen, color: 'border-sky-700 hover:bg-sky-950/40 text-sky-300' },
  { type: 'STAMINA', label: 'Stamina (Habits / Chores)', icon: HeartPulse, color: 'border-emerald-700 hover:bg-emerald-950/40 text-emerald-300' },
  { type: 'AGILITY', label: 'Agility (Quick Wins / Inbox)', icon: Zap, color: 'border-amber-700 hover:bg-amber-950/40 text-amber-300' },
];

const DIFFICULTIES: { level: QuestDifficulty; label: string }[] = [
  { level: 'TRIVIAL', label: 'Trivial' },
  { level: 'EASY', label: 'Easy' },
  { level: 'MEDIUM', label: 'Medium' },
  { level: 'HARD', label: 'Hard (Boss)' },
];

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  isOpen,
  onClose,
  onQuestCreated,
}) => {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('EASY');
  const [attributeType, setAttributeType] = useState<AttributeType>('INTELLECT');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const rewardPreview = DIFFICULTY_REWARDS[difficulty];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Quest title is required.');
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await createQuest({
        title,
        description: description.trim() || undefined,
        difficulty,
        attributeType,
        isRecurring: false,
      });

      if (res.success) {
        sound.playClick();
        setTitle('');
        setDescription('');
        onClose();
        onQuestCreated?.();
      } else {
        setErrorMsg(res.error);
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg rounded-2xl border-2 border-slate-700 bg-slate-950 p-6 shadow-2xl text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                Quest Forge
              </span>
              <h2 className="text-xl font-black text-white">Inscribe New Quest</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-3 rounded-lg border border-rose-800/80 bg-rose-950/60 p-2.5 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Quest Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Slay the Algorithms: Complete 2 LeetCode Problems"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description / Lore (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Objective notes or milestones..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Attribute Target */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Attribute
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ATTRIBUTES.map((attr) => {
                  const Icon = attr.icon;
                  const isSelected = attributeType === attr.type;
                  return (
                    <button
                      key={attr.type}
                      type="button"
                      onClick={() => setAttributeType(attr.type)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/40 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.15)] font-bold'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{attr.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Quest Difficulty
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.level}
                    type="button"
                    onClick={() => setDifficulty(d.level)}
                    className={`rounded-xl border py-2 text-center text-xs font-mono transition-all ${
                      difficulty === d.level
                        ? 'border-amber-400 bg-amber-950/60 font-bold text-amber-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Reward Preview Banner */}
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs">
              <span className="text-slate-400 font-medium">Bounty Calculation:</span>
              <div className="flex items-center gap-3 font-mono font-bold">
                <span className="flex items-center gap-1 text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  +{rewardPreview.xp} EXP
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  +{rewardPreview.gold} Gold
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-mono font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  FORGE QUEST
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
