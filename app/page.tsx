'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Filter,
  Flame,
  CheckCircle,
  Scroll,
  Sparkles,
} from 'lucide-react';
import { HeroHud } from '@/components/hero-hud';
import { QuestCard, QuestCardProps } from '@/components/quest-card';
import { CreateQuestModal } from '@/components/create-quest-modal';
import { QuestCompletionData } from '@/actions/quest-actions';
import { sound } from '@/lib/sound';

// Initial sample hero profile for interactive demo
const INITIAL_HERO = {
  username: 'Alex the Coder',
  level: 4,
  currentXp: 340,
  nextLevelXp: 800,
  totalXp: 1240,
  gold: 420,
  streakCount: 5,
};

// Initial sample quests for interactive demo
const INITIAL_QUESTS: QuestCardProps['quest'][] = [
  {
    id: '1',
    title: 'Defeat the Morning Sloth: Complete 30min HIIT & Stretch',
    description: 'Boost your physical stamina and kickstart adrenaline.',
    difficulty: 'MEDIUM',
    attributeType: 'STRENGTH',
    xpReward: 85,
    goldReward: 40,
    completed: false,
    dueDate: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Arcane Mastery: Build & Ship Life RPG Next.js App',
    description: 'Master Prisma, Server Actions, Framer Motion, and Zod.',
    difficulty: 'HARD',
    attributeType: 'INTELLECT',
    xpReward: 200,
    goldReward: 100,
    completed: false,
    dueDate: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Daily Hydration Ritual: Drink 2.5L Water',
    description: 'Keep stamina topped up throughout the day.',
    difficulty: 'TRIVIAL',
    attributeType: 'STAMINA',
    xpReward: 15,
    goldReward: 5,
    completed: false,
  },
  {
    id: '4',
    title: 'Cleanse the Citadel: Organize Desktop & Empty Trash',
    description: 'Clear visual clutter for 100% focus agility.',
    difficulty: 'EASY',
    attributeType: 'AGILITY',
    xpReward: 35,
    goldReward: 15,
    completed: false,
  },
];

export default function DashboardPage() {
  const [hero, setHero] = useState(INITIAL_HERO);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [filter, setFilter] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleQuestCompleted = (data: QuestCompletionData) => {
    // Play celebratory sound
    if (data.levelUp.didLevelUp) {
      sound.playLevelUp();
    } else {
      sound.playQuestComplete();
    }

    // Update hero stats reactively
    setHero((prev) => ({
      ...prev,
      level: data.updatedHero.level,
      currentXp: data.updatedHero.currentXp,
      nextLevelXp: data.updatedHero.nextLevelXp,
      totalXp: data.updatedHero.totalXp,
      gold: data.updatedHero.gold,
      streakCount: data.updatedHero.streakCount,
    }));
  };

  const filteredQuests = quests.filter((q) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return !q.completed;
    if (filter === 'COMPLETED') return q.completed;
    return q.attributeType === filter;
  });

  return (
    <div>
      {/* Top RPG HUD */}
      <HeroHud hero={hero} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
        {/* Banner / Streak Motivation Card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/40 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                Daily Quest Board
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Conquer Today's Trials
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every task completed builds permanent real-world hero attributes.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsCreateOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              NEW QUEST
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'STRENGTH', 'INTELLECT', 'STAMINA', 'AGILITY'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  sound.playClick();
                  setFilter(f);
                }}
                className={`rounded-xl border px-3 py-1.5 transition-all ${
                  filter === f
                    ? 'border-amber-400 bg-amber-950/60 font-bold text-amber-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <span className="text-slate-500 text-[11px] shrink-0 font-mono">
            {filteredQuests.length} Quests Active
          </span>
        </div>

        {/* Quest Cards Feed */}
        <div className="space-y-3">
          {filteredQuests.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 font-mono text-xs">
              <Scroll className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              No quests in this category. Inscribe a new quest to begin!
            </div>
          ) : (
            filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onQuestCompleted={handleQuestCompleted}
              />
            ))
          )}
        </div>
      </div>

      {/* Quest Creator Modal */}
      <CreateQuestModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onQuestCreated={() => {
          // Re-trigger refresh
        }}
      />
    </div>
  );
}
