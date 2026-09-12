'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Cpu,
  Star,
  Layers,
  Swords,
  Lock,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  TrendingUp,
} from 'lucide-react';
import { HeroProfile } from '@/types/game';
import { getAttributeXpRequiredForLevel } from '@/lib/progression';
import { sound } from '@/lib/sound';

interface CharacterSheetProps {
  hero: HeroProfile;
}

interface CyberGear {
  slot: string;
  name: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  bonus: string;
  icon: React.ElementType;
}

const SAMPLE_GEAR_LOADOUT: CyberGear[] = [
  {
    slot: 'WEAPON',
    name: 'Blade of Consistency',
    rarity: 'LEGENDARY',
    bonus: '+15% Streak Multiplier',
    icon: Swords,
  },
  {
    slot: 'NEURAL DECK',
    name: 'Cyberdeck Mk.IV',
    rarity: 'EPIC',
    bonus: '+20% Deep Work XP',
    icon: Cpu,
  },
  {
    slot: 'CHASSIS',
    name: 'Aegis of Flow State',
    rarity: 'RARE',
    bonus: '+100 Core Vitality / HP',
    icon: Shield,
  },
  {
    slot: 'RELIC',
    name: 'Hyper-Catalyst Core',
    rarity: 'LEGENDARY',
    bonus: '+10% Gold Boost',
    icon: Sparkles,
  },
];

const RARITY_THEMES: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  COMMON: {
    border: 'border-slate-800',
    bg: 'bg-slate-900/60',
    text: 'text-slate-300',
    glow: '',
  },
  RARE: {
    border: 'border-cyan-400/80',
    bg: 'bg-cyan-950/40',
    text: 'text-cyan-300',
    glow: 'shadow-[0_0_12px_rgba(0,240,255,0.25)]',
  },
  EPIC: {
    border: 'border-purple-500/80',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  },
  LEGENDARY: {
    border: 'border-amber-400',
    bg: 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-amber-950/40',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.35)]',
  },
};

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ hero }) => {
  const [activeTab, setActiveTab] = useState<'DISCIPLINES' | 'LOADOUT' | 'PERKS'>('DISCIPLINES');
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);

  const attributes = [
    {
      name: 'Strength',
      level: hero.attributes.strength,
      xp: hero.attributes.strengthXp,
      icon: Sword,
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/70',
      bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.25)]',
      perk: 'Iron Fortitude: Workouts yield +25% bonus vitality.',
      description: 'Physical fitness, heavy lifts, and workout consistency.',
    },
    {
      name: 'Intellect',
      level: hero.attributes.intellect,
      xp: hero.attributes.intellectXp,
      icon: BookOpen,
      color: 'from-pink-500 to-purple-600',
      textColor: 'text-pink-400',
      borderColor: 'border-pink-500/70',
      bgGlow: 'shadow-[0_0_15px_rgba(255,42,133,0.25)]',
      perk: 'Deep Flow State: 90m+ coding blocks trigger double Synapse XP.',
      description: 'Coding, algorithmic problem solving, deep reading, and study.',
    },
    {
      name: 'Stamina',
      level: hero.attributes.stamina,
      xp: hero.attributes.staminaXp,
      icon: HeartPulse,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/70',
      bgGlow: 'shadow-[0_0_15px_rgba(0,240,255,0.25)]',
      perk: 'Endurance Matrix: Daily routine adherence increases max HP pool.',
      description: 'Sleep hygiene, clean hydration, and habit execution.',
    },
    {
      name: 'Agility',
      level: hero.attributes.agility,
      xp: hero.attributes.agilityXp,
      icon: Zap,
      color: 'from-amber-400 to-yellow-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/70',
      bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      perk: 'Velocity Rush: Trivial & quick task clearance grants gold multipliers.',
      description: 'Rapid triage, zero inbox, chores, and promptness.',
    },
  ];

  return (
    <div className="space-y-5 font-mono">
      {/* Hero Overview Matrix Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/70 bg-gradient-to-b from-[#140c2a] via-[#0f0b22] to-[#080614] p-5 sm:p-6 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
          {/* Avatar Crest & Level Pill */}
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-3xl border-2 border-cyan-400 bg-gradient-to-br from-purple-950 via-slate-900 to-black shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <Swords className="h-12 w-12 sm:h-14 sm:w-14 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            <span className="absolute -bottom-2 -right-2 rounded-xl border border-cyan-400 bg-purple-950 px-2.5 py-0.5 font-mono text-xs font-black text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.6)]">
              LV.{hero.level}
            </span>
          </div>

          {/* Hero Bio & Badges */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {hero.username}
              </h2>
              <span className="rounded-lg border border-pink-500/70 bg-pink-950/80 px-2.5 py-0.5 text-[11px] font-black text-pink-300 shadow-[0_0_10px_rgba(255,42,133,0.3)]">
                RANK S-7 PALADIN
              </span>
              <span className="rounded-lg border border-cyan-400/70 bg-cyan-950/80 px-2.5 py-0.5 text-[11px] font-bold text-cyan-300">
                TITLE: "Archmage of TypeScript"
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans">
              Master of digital architecture and real-world discipline. Synapses fully synchronized with high-output routines.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-2 text-xs flex-wrap">
              <div className="flex items-center gap-1.5 rounded-xl border border-cyan-900/60 bg-[#120c24] px-3 py-1 text-cyan-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXP: {hero.totalXp.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-rose-900/60 bg-[#120c24] px-3 py-1 text-rose-300 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Streak: {hero.streakCount} Days (Peak: {hero.longestStreak})</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl border border-amber-900/60 bg-[#120c24] px-3 py-1 text-amber-300 shadow-sm">
                <span>🪙</span>
                <span>Stash: {hero.gold.toLocaleString()} G</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'DISCIPLINES', label: ':: Attributes & Disciplines', icon: Trophy },
          { key: 'LOADOUT', label: ':: Cyberdeck Gear Loadout', icon: Cpu },
          { key: 'PERKS', label: ':: Unlocked Neural Perks', icon: Star },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => {
                sound.playClick();
                setActiveTab(key as any);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-bold transition-all shrink-0 ${
                isActive
                  ? 'border border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  : 'border border-indigo-950 bg-[#110c26] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Attributes & Disciplines */}
      {activeTab === 'DISCIPLINES' && (
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
                onClick={() => {
                  sound.playClick();
                  setSelectedAttribute(selectedAttribute === attr.name ? null : attr.name);
                }}
                className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 ${attr.borderColor} bg-gradient-to-b from-[#130d29] to-[#0a0718] p-5 shadow-lg ${attr.bgGlow} transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-slate-900 border ${attr.borderColor}`}>
                      <Icon className={`w-5 h-5 ${attr.textColor}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{attr.name}</h4>
                      <span className="text-[11px] text-slate-400 font-sans">{attr.description}</span>
                    </div>
                  </div>

                  <span className={`text-base font-black ${attr.textColor}`}>
                    Rank {attr.level}
                  </span>
                </div>

                {/* Stat Meter */}
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Proficiency Progress</span>
                    <span className="text-white font-bold">{currentLevelXp} / {nextXp} XP ({percent}%)</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full border border-indigo-950 bg-[#0c081c]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${attr.color}`}
                    />
                  </div>
                </div>

                {/* Milestone Perk */}
                <div className="mt-3 pt-2.5 border-t border-indigo-950/80 flex items-start gap-2 text-[11px]">
                  <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-sans">{attr.perk}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Cyberdeck Gear Loadout */}
      {activeTab === 'LOADOUT' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_GEAR_LOADOUT.map((gear) => {
              const Icon = gear.icon;
              const theme = RARITY_THEMES[gear.rarity];
              return (
                <div
                  key={gear.slot}
                  className={`relative overflow-hidden rounded-2xl border-2 ${theme.border} ${theme.bg} ${theme.glow} p-4 backdrop-blur-md`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                    <span className="uppercase font-bold tracking-wider">[ {gear.slot} ]</span>
                    <span className={`font-black uppercase px-2 py-0.5 rounded border border-current ${theme.text}`}>
                      {gear.rarity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-950">
                      <Icon className={`h-6 w-6 ${theme.text}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{gear.name}</h4>
                      <p className="text-xs text-amber-300 font-bold mt-0.5 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> {gear.bonus}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Neural Perks */}
      {activeTab === 'PERKS' && (
        <div className="space-y-3">
          {[
            {
              title: 'Flow State Protocol',
              req: 'Rank 10 Intellect',
              status: 'ACTIVE',
              desc: 'Increases reward gain by +20% on back-to-back completed quests within 2 hours.',
            },
            {
              title: 'Hyper-Catalyst Engine',
              req: '7-Day Streak Active',
              status: 'ACTIVE',
              desc: 'Grants +10% bonus gold on every claimed quest dispatch.',
            },
            {
              title: 'Titan Metabolism',
              req: 'Rank 15 Strength',
              status: 'LOCKED',
              desc: 'Doubles endurance HP regeneration following heavy physical training sessions.',
            },
            {
              title: 'Quantum Reflex Arc',
              req: 'Rank 15 Agility',
              status: 'LOCKED',
              desc: 'Provides a chance to instantly double XP rewards on Trivial dispatch triage.',
            },
          ].map((perk) => (
            <div
              key={perk.title}
              className={`flex items-start justify-between rounded-2xl border-2 p-4 text-xs ${
                perk.status === 'ACTIVE'
                  ? 'border-cyan-400/80 bg-cyan-950/30 text-slate-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-500'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">{perk.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-current text-purple-400">
                    {perk.req}
                  </span>
                </div>
                <p className="text-slate-300 font-sans">{perk.desc}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black shrink-0 ${
                  perk.status === 'ACTIVE'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {perk.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
