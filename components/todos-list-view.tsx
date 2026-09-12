'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Sparkles, Pencil, Trash2 } from 'lucide-react';
import { TodoItem } from '@/types/game';
import { sound } from '@/lib/sound';

interface TodosListViewProps {
  todos: TodoItem[];
  onToggleTodo: (todo: TodoItem, e: React.MouseEvent) => void;
  onEditTodo?: (todo: TodoItem) => void;
  onDeleteTodo?: (id: string) => void;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  TRIVIAL: { bg: 'bg-slate-900 border-slate-700', text: 'text-slate-400', label: 'Trivial' },
  EASY: { bg: 'bg-emerald-950 border-emerald-700', text: 'text-emerald-300', label: 'Easy' },
  MEDIUM: { bg: 'bg-amber-950 border-amber-600', text: 'text-amber-300', label: 'Medium' },
  HARD: { bg: 'bg-rose-950 border-rose-600', text: 'text-rose-300', label: 'Hard' },
};

export const TodosListView: React.FC<TodosListViewProps> = ({
  todos,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
}) => {
  const [filter, setFilter] = useState<'ACTIVE' | 'DONE'>('ACTIVE');

  const filteredTodos = todos.filter((t) => (filter === 'ACTIVE' ? !t.completed : t.completed));

  return (
    <div className="space-y-3 font-mono">
      {/* Sub-filter tabs */}
      <div className="flex gap-2 pb-1 text-xs font-black">
        <button
          onClick={() => {
            sound.playClick();
            setFilter('ACTIVE');
          }}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            filter === 'ACTIVE'
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:text-white'
          }`}
        >
          Active ({todos.filter((t) => !t.completed).length})
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setFilter('DONE');
          }}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            filter === 'DONE'
              ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
              : 'border border-indigo-950 bg-[#100b24] text-slate-400 hover:text-white'
          }`}
        >
          Completed ({todos.filter((t) => t.completed).length})
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-indigo-950/80 bg-[#0e0a1e]/40 p-8 text-center text-slate-400 text-xs">
          {filter === 'ACTIVE'
            ? 'All to-dos dispatched! Tap + below to enlist new bounties.'
            : 'No completed bounties yet.'}
        </div>
      ) : (
        filteredTodos.map((todo) => {
          const diffConfig = DIFFICULTY_COLORS[todo.difficulty] || DIFFICULTY_COLORS.MEDIUM;

          return (
            <motion.div
              key={todo.id}
              layout
              className={`group overflow-hidden rounded-2xl border transition-all ${
                todo.completed
                  ? 'border-indigo-950/60 bg-[#0b081c]/60 opacity-60'
                  : 'border-indigo-950/90 bg-[#0f0b26] hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              }`}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Left Checkbox Button */}
                <button
                  onClick={(e) => {
                    sound.playTaskComplete();
                    onToggleTodo(todo, e);
                  }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 transition-all ${
                    todo.completed
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                      : 'border-emerald-400/80 bg-emerald-950/40 text-transparent hover:border-emerald-300 hover:bg-emerald-900/60'
                  }`}
                >
                  <Check className="h-6 w-6 stroke-[3.5]" />
                </button>

                {/* Center Content */}
                <div
                  onClick={() => onEditTodo?.(todo)}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <h3
                    className={`text-sm sm:text-base font-black tracking-tight ${
                      todo.completed
                        ? 'line-through text-slate-500'
                        : 'text-white group-hover:text-emerald-300 transition-colors truncate'
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.notes && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 font-normal">
                      {todo.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold border ${diffConfig.bg} ${diffConfig.text}`}
                    >
                      {diffConfig.label}
                    </span>

                    {todo.dueDate && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{todo.dueDate}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {onEditTodo && (
                    <button
                      type="button"
                      onClick={() => onEditTodo(todo)}
                      title="Edit To-Do"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onDeleteTodo && (
                    <button
                      type="button"
                      onClick={() => onDeleteTodo(todo.id)}
                      title="Delete To-Do"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-rose-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};
