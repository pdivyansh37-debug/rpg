'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Tag, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { TodoItem } from '@/types/game';
import { sound } from '@/lib/sound';

interface TodosListViewProps {
  todos: TodoItem[];
  onToggleTodo: (todo: TodoItem, e: React.MouseEvent) => void;
  onEditTodo?: (todo: TodoItem) => void;
  onDeleteTodo?: (id: string) => void;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  TRIVIAL: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Trivial' },
  EASY: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Easy' },
  MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Medium' },
  HARD: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Hard' },
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
    <div className="space-y-3">
      {/* Sub-filter tabs */}
      <div className="flex gap-2 pb-1 text-xs font-bold">
        <button
          onClick={() => {
            sound.playClick();
            setFilter('ACTIVE');
          }}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'ACTIVE'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          Active ({todos.filter((t) => !t.completed).length})
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setFilter('DONE');
          }}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'DONE'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          Completed ({todos.filter((t) => t.completed).length})
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 text-sm">
          {filter === 'ACTIVE'
            ? 'No pending to-dos! Tap + below to add a new task.'
            : 'No completed tasks yet.'}
        </div>
      ) : (
        filteredTodos.map((todo) => {
          const diffConfig = DIFFICULTY_COLORS[todo.difficulty] || DIFFICULTY_COLORS.MEDIUM;

          return (
            <motion.div
              key={todo.id}
              layout
              className={`group overflow-hidden rounded-2xl bg-white shadow-sm border transition-all ${
                todo.completed
                  ? 'border-slate-100 opacity-60 bg-slate-50/70'
                  : 'border-slate-100 hover:border-purple-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Left Checkbox Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playTaskComplete();
                    onToggleTodo(todo, e);
                  }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 transition-all ${
                    todo.completed
                      ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                      : 'border-amber-400 bg-amber-50 text-transparent hover:border-amber-500'
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
                    className={`text-sm sm:text-base font-bold tracking-tight ${
                      todo.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-800 group-hover:text-purple-700 transition-colors'
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.notes && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{todo.notes}</p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold ${diffConfig.bg} ${diffConfig.text}`}
                    >
                      {diffConfig.label}
                    </span>

                    {todo.dueDate && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{todo.dueDate}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};
