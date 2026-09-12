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
  Skull,
  Clock,
  Flame,
} from 'lucide-react';
import { createQuest } from '@/actions/quest-actions';
import { DIFFICULTY_REWARDS, QuestDifficulty, AttributeType } from '@/lib/progression';
import { CyberQuest } from './quest-card';
import { sound } from '@/lib/sound';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestCreated?: (newQuest: CyberQuest) => void;
}

const ATTRIBUTES: { type: AttributeType; label: string; icon: React.ElementType; color: string; border: string }[] = [
  { type: 'INTELLECT', label: 'Intellect (Code / Deep Work)', icon: BookOpen, color: 'text-pink-300 bg-pink-950/40', border: 'border-pink-500/70' },
  { type: 'STRENGTH', label: 'Strength (Gym / Workout)', icon: Sword, color: 'text-amber-300 bg-amber-950/40', border: 'border-amber-500/70' },
  { type: 'STAMINA', label: 'Stamina (Habits / Cardio)', icon: HeartPulse, color: 'text-cyan-300 bg-cyan-950/40', border: 'border-cyan-500/70' },
  { type: 'AGILITY', label: 'Agility (Speed / Inbox)', icon: Zap, color: 'text-emerald-300 bg-emerald-950/40', border: 'border-emerald-500/70' },
];

const DIFFICULTIES: { level: QuestDifficulty; label: string; xp: number; gold: number }[] = [
  { level: 'TRIVIAL', label: 'Trivial', xp: 20, gold: 12 },
  { level: 'EASY', label: 'Easy', xp: 35, gold: 18 },
  { level: 'MEDIUM', label: 'Medium', xp: 75, gold: 28 },
  { level: 'HARD', label: 'Hard / Boss', xp: 150, gold: 60 },
];

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  isOpen,
  onClose,
  onQuestCreated,
}) => {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('HARD');
  const [attributeType, setAttributeType] = useState<AttributeType>('INTELLECT');
  const [timeString, setTimeString] = useState('11:30 AM');
  const [isBossGate, setIsBossGate] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDiffConfig = DIFFICULTIES.find((d) => d.level === difficulty) || DIFFICULTIES[2];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Protocol title is required.');
      return;
    }

    setErrorMsg(null);
    sound.playClick();

    const newQuest: CyberQuest = {
      id: 'quest-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      difficulty,
      attributeType,
      xpReward: isBossGate ? currentDiffConfig.xp + 50 : currentDiffConfig.xp,
      goldReward: isBossGate ? currentDiffConfig.gold + 20 : currentDiffConfig.gold,
      streakBonus: Math.round((currentDiffConfig.gold + (isBossGate ? 20 : 0)) * 0.1),
      completed: false,
      timeString: timeString.trim() || undefined,
      protocolType: isBossGate
        ? `[ BOSS GATE // ${attributeType} ]`
        : `[ RITUAL // ${attributeType} ]`,
      metaBadge: isBossGate ? 'BOSS GATE' : difficulty === 'MEDIUM' ? 'Ready to Claim' : 'Daily Cycle',
      isBoss: isBossGate || difficulty === 'HARD',
    };

    onQuestCreated?.(newQuest);

    startTransition(async () => {
      try {
        await createQuest({
          title: title.trim(),
          description: description.trim() || undefined,
          difficulty,
          attributeType,
          dueDate: null,
          isRecurring: false,
        });
      } catch {
        // Mock fallback
      }
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-purple-500/80 bg-[#0e0a1e] p-6 shadow-[0_0_35px_rgba(168,85,247,0.35)] text-slate-100"
        >
          {/* Background Grid Accent */}
          <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

          {/* Header */}
          <div className="relative flex items-center justify-between pb-4 border-b border-indigo-950">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                DISPATCH PROTOCOL FORGE
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                Inscribe New Cyber Quest
              </h2>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="relative mt-3 rounded-xl border border-rose-600 bg-rose-950/80 p-2.5 text-xs text-rose-300 font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative mt-4 space-y-4 font-mono">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Protocol Objective <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning Deep Work: 90m Code Session"
                className="w-full rounded-xl border border-indigo-950 bg-[#140f28] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Target Discipline */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Target Discipline
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ATTRIBUTES.map((attr) => {
                  const Icon = attr.icon;
                  const isSelected = attributeType === attr.type;
                  return (
                    <button
                      key={attr.type}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAttributeType(attr.type);
                      }}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all ${
                        isSelected
                          ? `${attr.border} ${attr.color} font-black shadow-[0_0_12px_rgba(0,240,255,0.2)]`
                          : 'border-indigo-950/80 bg-[#120c24] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate text-[11px]">{attr.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Difficulty
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.level}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDifficulty(d.level);
                        if (d.level === 'HARD') setIsBossGate(true);
                      }}
                      className={`rounded-xl border py-1.5 text-center text-[11px] transition-all ${
                        difficulty === d.level
                          ? 'border-amber-400 bg-amber-950/80 font-black text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                          : 'border-indigo-950 bg-[#120c24] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Scheduled Time / Cycle
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={timeString}
                    onChange={(e) => setTimeString(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full rounded-xl border border-indigo-950 bg-[#140f28] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <Clock className="w-4 h-4 text-purple-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Boss Gate Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-indigo-950 bg-[#130d29] p-3">
              <div className="flex items-center gap-2">
                <Skull className={`w-4 h-4 ${isBossGate ? 'text-pink-400' : 'text-slate-500'}`} />
                <div>
                  <span className="text-xs font-bold text-white block">Boss Gate Protocol</span>
                  <span className="text-[10px] text-slate-400">Yields extra rare bounty and celebratory fanfare</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsBossGate(!isBossGate);
                }}
                className={`flex h-6 w-11 items-center rounded-full transition-colors p-0.5 ${
                  isBossGate ? 'bg-pink-500 justify-end shadow-[0_0_10px_rgba(255,42,133,0.7)]' : 'bg-slate-800 justify-start'
                }`}
              >
                <motion.div
                  layout
                  className="h-5 w-5 rounded-full bg-white shadow-md"
                />
              </button>
            </div>

            {/* Bounty Preview Card */}
            <div className="flex items-center justify-between rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 to-purple-950/60 p-3 text-xs">
              <span className="text-slate-300 font-bold">Estimated Bounty:</span>
              <div className="flex items-center gap-3 font-mono font-black">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  +{isBossGate ? currentDiffConfig.xp + 50 : currentDiffConfig.xp} EXP
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  +{isBossGate ? currentDiffConfig.gold + 20 : currentDiffConfig.gold} Gold
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 py-3 font-mono font-black text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  INSCRIBE DISPATCH PROTOCOL
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

