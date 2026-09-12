'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Sword,
  HeartPulse,
  Zap,
  Sparkles,
  Coins,
  Skull,
  Clock,
  Flame,
  CalendarCheck,
  ListTodo,
  Repeat,
  Check,
} from 'lucide-react';
import { QuestDifficulty, AttributeType, HabitItem, DailyItem, TodoItem } from '@/types/game';
import { CyberQuest } from './quest-card';
import { sound } from '@/lib/sound';

export type TaskType = 'QUEST' | 'HABIT' | 'DAILY' | 'TODO';

export interface TaskCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  // If editing an existing item:
  initialTaskType?: TaskType;
  editingQuest?: CyberQuest | null;
  editingHabit?: HabitItem | null;
  editingDaily?: DailyItem | null;
  editingTodo?: TodoItem | null;
  // Handlers:
  onCreateQuest?: (quest: CyberQuest) => void;
  onUpdateQuest?: (quest: CyberQuest) => void;
  onDeleteQuest?: (id: string) => void;

  onCreateHabit?: (habit: HabitItem) => void;
  onUpdateHabit?: (habit: HabitItem) => void;
  onDeleteHabit?: (id: string) => void;

  onCreateDaily?: (daily: DailyItem) => void;
  onUpdateDaily?: (daily: DailyItem) => void;
  onDeleteDaily?: (id: string) => void;

  onCreateTodo?: (todo: TodoItem) => void;
  onUpdateTodo?: (todo: TodoItem) => void;
  onDeleteTodo?: (id: string) => void;
}

const ATTRIBUTES: { type: AttributeType; label: string; icon: React.ElementType; color: string; border: string }[] = [
  { type: 'INTELLECT', label: 'Intellect (Code / Focus)', icon: BookOpen, color: 'text-pink-300 bg-pink-950/40', border: 'border-pink-500/70' },
  { type: 'STRENGTH', label: 'Strength (Gym / Power)', icon: Sword, color: 'text-amber-300 bg-amber-950/40', border: 'border-amber-500/70' },
  { type: 'STAMINA', label: 'Stamina (Habits / Cardio)', icon: HeartPulse, color: 'text-cyan-300 bg-cyan-950/40', border: 'border-cyan-500/70' },
  { type: 'AGILITY', label: 'Agility (Speed / Reflex)', icon: Zap, color: 'text-emerald-300 bg-emerald-950/40', border: 'border-emerald-500/70' },
];

const DIFFICULTIES: { level: QuestDifficulty; label: string; xp: number; gold: number }[] = [
  { level: 'TRIVIAL', label: 'Trivial', xp: 20, gold: 12 },
  { level: 'EASY', label: 'Easy', xp: 35, gold: 18 },
  { level: 'MEDIUM', label: 'Medium', xp: 75, gold: 28 },
  { level: 'HARD', label: 'Hard / Boss', xp: 150, gold: 60 },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TaskCrudModal: React.FC<TaskCrudModalProps> = ({
  isOpen,
  onClose,
  initialTaskType = 'QUEST',
  editingQuest,
  editingHabit,
  editingDaily,
  editingTodo,
  onCreateQuest,
  onUpdateQuest,
  onDeleteQuest,
  onCreateHabit,
  onUpdateHabit,
  onDeleteHabit,
  onCreateDaily,
  onUpdateDaily,
  onDeleteDaily,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const isEditing = !!(editingQuest || editingHabit || editingDaily || editingTodo);

  const [taskType, setTaskType] = useState<TaskType>(initialTaskType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('MEDIUM');
  const [attributeType, setAttributeType] = useState<AttributeType>('INTELLECT');
  const [timeString, setTimeString] = useState('11:30 AM');
  const [isBossGate, setIsBossGate] = useState(false);

  // Habit specific
  const [isPositive, setIsPositive] = useState(true);
  const [isNegative, setIsNegative] = useState(false);

  // Daily specific
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  // Todo specific
  const [dueDate, setDueDate] = useState('Today');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize initial values when modal opens or edit item changes
  useEffect(() => {
    if (!isOpen) return;

    if (editingQuest) {
      setTaskType('QUEST');
      setTitle(editingQuest.title || '');
      setDescription(editingQuest.description || '');
      setDifficulty(editingQuest.difficulty || 'MEDIUM');
      setAttributeType(editingQuest.attributeType || 'INTELLECT');
      setTimeString(editingQuest.timeString || '11:30 AM');
      setIsBossGate(!!editingQuest.isBoss);
    } else if (editingHabit) {
      setTaskType('HABIT');
      setTitle(editingHabit.title || '');
      setDescription(editingHabit.notes || '');
      setDifficulty(editingHabit.difficulty || 'MEDIUM');
      setAttributeType(editingHabit.attributeType || 'INTELLECT');
      setIsPositive(editingHabit.isPositive);
      setIsNegative(editingHabit.isNegative);
    } else if (editingDaily) {
      setTaskType('DAILY');
      setTitle(editingDaily.title || '');
      setDescription(editingDaily.notes || '');
      setDifficulty(editingDaily.difficulty || 'MEDIUM');
      setAttributeType(editingDaily.attributeType || 'INTELLECT');
      setDaysOfWeek(editingDaily.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]);
    } else if (editingTodo) {
      setTaskType('TODO');
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.notes || '');
      setDifficulty(editingTodo.difficulty || 'MEDIUM');
      setAttributeType(editingTodo.attributeType || 'INTELLECT');
      setDueDate(editingTodo.dueDate || 'Today');
    } else {
      // Default reset for new item
      setTaskType(initialTaskType);
      setTitle('');
      setDescription('');
      setDifficulty('MEDIUM');
      setAttributeType('INTELLECT');
      setTimeString('11:30 AM');
      setIsBossGate(false);
      setIsPositive(true);
      setIsNegative(false);
      setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
      setDueDate('Today');
    }
    setErrorMsg(null);
  }, [isOpen, editingQuest, editingHabit, editingDaily, editingTodo, initialTaskType]);

  if (!isOpen) return null;

  const currentDiffConfig = DIFFICULTIES.find((d) => d.level === difficulty) || DIFFICULTIES[2];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Title is required.');
      return;
    }

    setErrorMsg(null);
    sound.playClick();

    if (taskType === 'QUEST') {
      const questData: CyberQuest = {
        id: editingQuest ? editingQuest.id : 'quest-' + Date.now(),
        title: title.trim(),
        description: description.trim() || undefined,
        difficulty,
        attributeType,
        xpReward: isBossGate ? currentDiffConfig.xp + 50 : currentDiffConfig.xp,
        goldReward: isBossGate ? currentDiffConfig.gold + 20 : currentDiffConfig.gold,
        streakBonus: Math.round((currentDiffConfig.gold + (isBossGate ? 20 : 0)) * 0.1),
        completed: editingQuest ? editingQuest.completed : false,
        timeString: timeString.trim() || undefined,
        protocolType: isBossGate
          ? `[ BOSS GATE // ${attributeType} ]`
          : `[ RITUAL // ${attributeType} ]`,
        metaBadge: isBossGate ? 'BOSS GATE' : difficulty === 'MEDIUM' ? 'Ready to Claim' : 'Daily Cycle',
        isBoss: isBossGate || difficulty === 'HARD',
      };

      if (editingQuest) {
        onUpdateQuest?.(questData);
      } else {
        onCreateQuest?.(questData);
      }
    } else if (taskType === 'HABIT') {
      if (!isPositive && !isNegative) {
        setErrorMsg('Please select at least Positive (+) or Negative (-).');
        return;
      }
      const habitData: HabitItem = {
        id: editingHabit ? editingHabit.id : 'habit-' + Date.now(),
        title: title.trim(),
        notes: description.trim() || undefined,
        isPositive,
        isNegative,
        positiveCount: editingHabit ? editingHabit.positiveCount : 0,
        negativeCount: editingHabit ? editingHabit.negativeCount : 0,
        difficulty,
        attributeType,
      };

      if (editingHabit) {
        onUpdateHabit?.(habitData);
      } else {
        onCreateHabit?.(habitData);
      }
    } else if (taskType === 'DAILY') {
      const dailyData: DailyItem = {
        id: editingDaily ? editingDaily.id : 'daily-' + Date.now(),
        title: title.trim(),
        notes: description.trim() || undefined,
        completed: editingDaily ? editingDaily.completed : false,
        streak: editingDaily ? editingDaily.streak : 0,
        daysOfWeek: daysOfWeek.length > 0 ? daysOfWeek : [0, 1, 2, 3, 4, 5, 6],
        difficulty,
        attributeType,
      };

      if (editingDaily) {
        onUpdateDaily?.(dailyData);
      } else {
        onCreateDaily?.(dailyData);
      }
    } else if (taskType === 'TODO') {
      const todoData: TodoItem = {
        id: editingTodo ? editingTodo.id : 'todo-' + Date.now(),
        title: title.trim(),
        notes: description.trim() || undefined,
        completed: editingTodo ? editingTodo.completed : false,
        dueDate: dueDate.trim() || 'Today',
        difficulty,
        attributeType,
      };

      if (editingTodo) {
        onUpdateTodo?.(todoData);
      } else {
        onCreateTodo?.(todoData);
      }
    }

    onClose();
  };

  const handleDelete = () => {
    sound.playClick();
    if (editingQuest) onDeleteQuest?.(editingQuest.id);
    else if (editingHabit) onDeleteHabit?.(editingHabit.id);
    else if (editingDaily) onDeleteDaily?.(editingDaily.id);
    else if (editingTodo) onDeleteTodo?.(editingTodo.id);
    onClose();
  };

  const toggleDay = (dayIdx: number) => {
    sound.playClick();
    if (daysOfWeek.includes(dayIdx)) {
      if (daysOfWeek.length > 1) {
        setDaysOfWeek(daysOfWeek.filter((d) => d !== dayIdx));
      }
    } else {
      setDaysOfWeek([...daysOfWeek, dayIdx].sort());
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-purple-500/80 bg-[#0e0a1e] p-5 sm:p-6 shadow-[0_0_35px_rgba(168,85,247,0.35)] text-slate-100"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between pb-3 border-b border-indigo-950">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {isEditing ? 'MODIFY PROTOCOL DIRECTIVE' : 'DISPATCH PROTOCOL FORGE'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {isEditing ? 'Edit Existing Directive' : 'Inscribe New Directive'}
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

          {/* Type Switcher (only shown when creating new) */}
          {!isEditing && (
            <div className="grid grid-cols-4 gap-1 mt-4 rounded-2xl border border-indigo-950 bg-[#120c24] p-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTaskType('QUEST');
                }}
                className={`flex items-center justify-center gap-1 rounded-xl py-1.5 font-bold transition-all ${
                  taskType === 'QUEST'
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Quest</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTaskType('HABIT');
                }}
                className={`flex items-center justify-center gap-1 rounded-xl py-1.5 font-bold transition-all ${
                  taskType === 'HABIT'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Repeat className="w-3 h-3" />
                <span>Habit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTaskType('DAILY');
                }}
                className={`flex items-center justify-center gap-1 rounded-xl py-1.5 font-bold transition-all ${
                  taskType === 'DAILY'
                    ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CalendarCheck className="w-3 h-3" />
                <span>Daily</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTaskType('TODO');
                }}
                className={`flex items-center justify-center gap-1 rounded-xl py-1.5 font-bold transition-all ${
                  taskType === 'TODO'
                    ? 'bg-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListTodo className="w-3 h-3" />
                <span>To-Do</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="relative mt-3 rounded-xl border border-rose-600 bg-rose-950/80 p-2.5 text-xs text-rose-300 font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative mt-4 space-y-3.5 font-mono">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {taskType === 'QUEST' ? 'Protocol Objective' : taskType === 'HABIT' ? 'Habit Title' : taskType === 'DAILY' ? 'Daily Ritual Title' : 'Bounty Title'} <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  taskType === 'QUEST'
                    ? 'e.g. Morning Deep Work: 90m Code Session'
                    : taskType === 'HABIT'
                    ? 'e.g. Drink 500ml Water Upon Waking'
                    : taskType === 'DAILY'
                    ? 'e.g. 15m Evening Matrix Sync'
                    : 'e.g. Submit Production Pull Request'
                }
                className="w-full rounded-xl border border-indigo-950 bg-[#140f28] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* Notes / Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Directives & Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tactical context, subroutines, or bonus conditions..."
                className="w-full rounded-xl border border-indigo-950 bg-[#140f28] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs transition-all ${
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

            {/* Difficulty Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Difficulty Tier
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.level}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setDifficulty(d.level);
                      if (d.level === 'HARD' && taskType === 'QUEST') setIsBossGate(true);
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

            {/* Habit Triggers (Positive / Negative) */}
            {taskType === 'HABIT' && (
              <div className="rounded-xl border border-indigo-950 bg-[#130d29] p-3 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Habit Type Triggers</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsPositive(!isPositive);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isPositive
                        ? 'border-amber-400 bg-amber-950/70 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                        : 'border-indigo-950 bg-[#100a20] text-slate-500'
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Positive (+) Forge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsNegative(!isNegative);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isNegative
                        ? 'border-rose-500 bg-rose-950/70 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : 'border-indigo-950 bg-[#100a20] text-slate-500'
                    }`}
                  >
                    <span>-</span>
                    <span>Negative (-) Vice</span>
                  </button>
                </div>
              </div>
            )}

            {/* Daily Days Selector */}
            {taskType === 'DAILY' && (
              <div className="rounded-xl border border-indigo-950 bg-[#130d29] p-3">
                <span className="text-xs font-bold text-slate-200 block mb-2">Repeats On</span>
                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map((day, idx) => {
                    const active = daysOfWeek.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`py-1.5 rounded-lg border text-center text-[10px] font-bold transition-all ${
                          active
                            ? 'border-purple-500 bg-purple-950 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                            : 'border-indigo-950 bg-[#100a20] text-slate-600'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* To-Do Due Date */}
            {taskType === 'TODO' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Deadline
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="e.g. Today, Tomorrow, Friday"
                    className="w-full rounded-xl border border-indigo-950 bg-[#140f28] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <Clock className="w-4 h-4 text-emerald-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Quest Specific: Time String & Boss Gate */}
            {taskType === 'QUEST' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Scheduled Time
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

                  {/* Boss Gate Toggle */}
                  <div className="flex items-center justify-between rounded-xl border border-indigo-950 bg-[#130d29] p-2.5">
                    <div className="flex items-center gap-1.5">
                      <Skull className={`w-4 h-4 ${isBossGate ? 'text-pink-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-white">Boss Gate</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setIsBossGate(!isBossGate);
                      }}
                      className={`flex h-5 w-10 items-center rounded-full transition-colors p-0.5 ${
                        isBossGate ? 'bg-pink-500 justify-end shadow-[0_0_10px_rgba(255,42,133,0.7)]' : 'bg-slate-800 justify-start'
                      }`}
                    >
                      <motion.div
                        layout
                        className="h-4 w-4 rounded-full bg-white shadow-md"
                      />
                    </button>
                  </div>
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
              </>
            )}

            {/* Action Buttons: Save / Create & Delete */}
            <div className="flex items-center gap-2 pt-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  title="Permanently remove this directive"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-600/80 bg-rose-950/50 px-4 py-3 font-mono text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}

              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 py-3 font-mono font-black text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:brightness-110 active:scale-[0.99]"
              >
                {isEditing ? (
                  <>
                    <Pencil className="w-4 h-4" />
                    SAVE DIRECTIVE CHANGES
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    INSCRIBE DISPATCH PROTOCOL
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
