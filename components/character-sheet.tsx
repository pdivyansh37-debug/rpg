'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sword,
  BookOpen,
  HeartPulse,
  Zap,
  Shield,
  Trophy,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import { HeroProfile } from '@/types/game';
import { getAttributeXpRequiredForLevel } from '@/lib/progression';

interface CharacterSheetProps {
  hero: HeroProfile;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ hero }) => {
  const attributes = [
    {
      name: 'Strength',
      level: hero.attributes.strength,
      xp: hero.attributes.strengthXp,
      icon: Sword,
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-900/60',
      description: 'Physical fitness, workouts, and energy.',
    },
    {
      name: 'Intellect',
      level: hero.attributes.intellect,
      xp: hero.attributes.intellectXp,
      icon: BookOpen,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-900/60',
      description: 'Coding, studying, reading, and deep work.',
    },
    {
      name: 'Stamina',
      level: hero.attributes.stamina,
      xp: hero.attributes.staminaXp,
      icon: HeartPulse,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-900/60',
      description: 'Habit discipline, sleep, and routine execution.',
    },
    {
      name: 'Agility',
      level: hero.attributes.agility,
      xp: hero.attributes.agilityXp,
      icon: Zap,
      color: 'from-amber-500 to-yellow-600',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-900/60',
      description: 'Speed, inbox clearance, chores, and promptness.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Overview Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Hero Avatar / Crest */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-amber-400/80 bg-slate-950 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
            <Shield className="h-16 w-16 text-amber-400" />
            <span className="absolute -bottom-2 -right-2 rounded-lg border-2 border-amber-400 bg-amber-950 px-2 py-0.5 font-mono text-xs font-black text-amber-300 shadow">
              LV.{hero.level}
            </span>
          </div>

          {/* Hero Bio & Badges */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <h2 className="text-2xl font-black text-white">{hero.username}</h2>
              <span className="rounded-md border border-indigo-800/80 bg-indigo-950/60 px-2 py-0.5 font-mono text-xs font-bold text-indigo-300">
                GRAND ADVENTURER
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Forged through daily grit, consistent habits, and real-world milestones.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4 pt-2 font-mono text-xs text-slate-300 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-xl">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>EXP: {hero.totalXp.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-xl">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Streak: {hero.streakCount} Days (Max: {hero.longestStreak})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Attributes Grid */}
      <div>
        <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Hero Attributes & Disciplines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attributes.map((attr) => {
            const Icon = attr.icon;
            const nextXp = getAttributeXpRequiredForLevel(attr.level);
            const currentLevelXp = attr.xp % nextXp;
            const percent = Math.min(
              100,
              Math.max(0, Math.round((currentLevelXp / nextXp) * 100))
            );

            return (
              <motion.div
                key={attr.name}
                whileHover={{ scale: 1.01 }}
                className={`rounded-2xl border-2 ${attr.borderColor} bg-slate-950/80 p-5 shadow-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl bg-slate-900 border ${attr.borderColor}`}>
                      <Icon className={`w-5 h-5 ${attr.textColor}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{attr.name}</h4>
                      <span className="text-[11px] text-slate-400">{attr.description}</span>
                    </div>
                  </div>

                  <span className={`font-mono text-lg font-black ${attr.textColor}`}>
                    Rank {attr.level}
                  </span>
                </div>

                {/* Stat Meter */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-400">
                    <span>Proficiency</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${attr.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
