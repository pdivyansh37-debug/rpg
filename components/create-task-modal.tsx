'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Calendar, Check, Coins, Sparkles } from 'lucide-react';
import { HabitItem, DailyItem, TodoItem, RewardItem, QuestDifficulty } from '@/types/game';
import { sound } from '@/lib/sound';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'HABIT' | 'DAILY' | 'TODO' | 'REWARD';
  onCreateHabit?: (habit: HabitItem) => void;
  onCreateDaily?: (daily: DailyItem) => void;
  onCreateTodo?: (todo: TodoItem) => void;
  onCreateReward?: (reward: RewardItem) => void;
}

const DIFFICULTIES: { level: QuestDifficulty; label: string }[] = [
  { level: 'TRIVIAL', label: 'Trivial' },
  { level: 'EASY', label: 'Easy' },
  { level: 'MEDIUM', label: 'Medium' },
  { level: 'HARD', label: 'Hard' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'HABIT',
  onCreateHabit,
  onCreateDaily,
  onCreateTodo,
  onCreateReward,
}) => {
  const [taskType, setTaskType] = useState<'HABIT' | 'DAILY' | 'TODO' | 'REWARD'>(defaultTab);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('MEDIUM');

  // Habit specific
  const [isPositive, setIsPositive] = useState(true);
  const [isNegative, setIsNegative] = useState(false);

  // Daily specific
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  // Todo specific
  const [dueDate, setDueDate] = useState('');

  // Reward specific
  const [cost, setCost] = useState(15);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playTaskComplete();

    if (taskType === 'HABIT') {
      const newHabit: HabitItem = {
        id: 'habit-' + Date.now(),
        title: title.trim(),
        notes: notes.trim() || undefined,
        isPositive,
        isNegative,
        positiveCount: 0,
        negativeCount: 0,
        difficulty,
      };
      onCreateHabit?.(newHabit);
    } else if (taskType === 'DAILY') {
      const newDaily: DailyItem = {
        id: 'daily-' + Date.now(),
        title: title.trim(),
        notes: notes.trim() || undefined,
        completed: false,
        streak: 0,
        daysOfWeek: selectedDays,
        difficulty,
      };
      onCreateDaily?.(newDaily);
    } else if (taskType === 'TODO') {
      const newTodo: TodoItem = {
        id: 'todo-' + Date.now(),
        title: title.trim(),
        notes: notes.trim() || undefined,
        completed: false,
        dueDate: dueDate.trim() || undefined,
        difficulty,
      };
      onCreateTodo?.(newTodo);
    } else if (taskType === 'REWARD') {
      const newReward: RewardItem = {
        id: 'reward-' + Date.now(),
        title: title.trim(),
        notes: notes.trim() || undefined,
        cost: Math.max(1, cost),
        type: 'CUSTOM',
      };
      onCreateReward?.(newReward);
    }

    // Reset fields & close
    setTitle('');
    setNotes('');
    onClose();
  };

  const toggleDay = (dayIdx: number) => {
    sound.playClick();
    setSelectedDays((prev) =>
      prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx]
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl p-5 text-slate-800"
        >
          {/* Header & Close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Create New Task</h2>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Type Segmented Tabs */}
          <div className="flex mt-3 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
            {(['HABIT', 'DAILY', 'TODO', 'REWARD'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTaskType(t);
                }}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  taskType === t ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t === 'HABIT'
                  ? 'Habit'
                  : t === 'DAILY'
                  ? 'Daily'
                  : t === 'TODO'
                  ? 'To-Do'
                  : 'Reward'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
            {/* Title */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  taskType === 'HABIT'
                    ? 'e.g. 10 min cardio / Study'
                    : taskType === 'DAILY'
                    ? 'e.g. Morning Meditation'
                    : taskType === 'TODO'
                    ? 'e.g. Finish Project Assignment'
                    : 'e.g. 1 Hour Video Games'
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Notes (optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional instructions or motivation..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            {/* Habit Controls: Positive & Negative Toggles */}
            {taskType === 'HABIT' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Action Controls</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsPositive(!isPositive);
                    }}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                      isPositive
                        ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <Plus className="w-4 h-4 text-amber-500 stroke-[3]" />
                    <span>Positive (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsNegative(!isNegative);
                    }}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                      isNegative
                        ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <Minus className="w-4 h-4 text-amber-500 stroke-[3]" />
                    <span>Negative (-)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Daily Controls: Days of week */}
            {taskType === 'DAILY' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Repeats On</label>
                <div className="flex justify-between gap-1">
                  {DAYS.map((day, idx) => {
                    const isSelected = selectedDays.includes(idx);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {day[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* To-Do Controls: Due date */}
            {taskType === 'TODO' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                />
              </div>
            )}

            {/* Reward Controls: Gold Cost */}
            {taskType === 'REWARD' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cost in Gold</label>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-amber-950 font-black text-xs">
                    H
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-28 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-sm font-bold text-slate-900 focus:border-purple-600 focus:outline-none"
                  />
                  <span className="text-slate-500 font-medium">Gold Coins</span>
                </div>
              </div>
            )}

            {/* Difficulty Picker for Habit, Daily, Todo */}
            {taskType !== 'REWARD' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Difficulty</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.level}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDifficulty(d.level);
                      }}
                      className={`py-1.5 rounded-xl text-center font-bold transition-all ${
                        difficulty === d.level
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#7C4DFF] py-3 text-sm font-bold text-white shadow-md hover:bg-[#6D3DF0] active:scale-[0.99] transition-transform"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Create Task</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
