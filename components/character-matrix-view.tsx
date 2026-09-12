'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Sword,
  BookOpen,
  HeartPulse,
  Zap,
  Shield,
  Sparkles,
  Flame,
  Activity,
  Award,
  Star,
  Layers,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { StatsRadar } from './stats-radar';
import { NeuralSkillTree } from './neural-skill-tree';
import { HeroState, AuditLog } from '@/types/game';
import { sound } from '@/lib/sound';

interface CharacterMatrixViewProps {
  hero: HeroState;
  onSpendSkillPoint: () => void;
}

const SAMPLE_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'Pushup Gauntlet 5x Sets',
    attribute: 'Strength',
    xpGain: 40,
    multiplier: '+1.2x 6-Flame',
    timestamp: 'Today, 08:30',
  },
  {
    id: 'log-2',
    action: 'PR Code Review Blast',
    attribute: 'Intellect',
    xpGain: 120,
    multiplier: '+2.0x 9-Flame',
    timestamp: 'Today, 11:45',
  },
  {
    id: 'log-3',
    action: '2.5L Clean Hydration Routine',
    attribute: 'Stamina',
    xpGain: 35,
    multiplier: '+1.1x 7-Flame',
    timestamp: 'Today, 15:20',
  },
];

export const CharacterMatrixView: React.FC<CharacterMatrixViewProps> = ({
  hero,
  onSpendSkillPoint,
}) => {
  const [activeSkillModal, setActiveSkillModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);

  const disciplines = [
    {
      id: 'str',
      name: 'Strength',
      rank: 'RANK S-4',
      bonus: '+12% Physical Output',
      xp: 740,
      nextXp: 1000,
      percent: 74,
      icon: Sword,
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/80',
      bgGradient: 'from-rose-950/40 to-slate-950/80',
      barGradient: 'from-rose-600 to-red-500',
      perks: ['Cold Shower Fortitude', 'Kinetic Restructure'],
    },
    {
      id: 'int',
      name: 'Intellect',
      rank: 'RANK S-6',
      bonus: '+18% Cognition Matrix',
      xp: 1450,
      nextXp: 2000,
      percent: 73,
      icon: BookOpen,
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-400/80',
      bgGradient: 'from-cyan-950/40 to-slate-950/80',
      barGradient: 'from-cyan-500 to-blue-500',
      perks: ['Hyperfocus Flow', 'Algorithmic Memory', 'Pomodoro Overdrive'],
    },
    {
      id: 'sta',
      name: 'Stamina',
      rank: 'RANK A-3',
      bonus: '+14% Bio-Regen',
      xp: 620,
      nextXp: 750,
      percent: 83,
      icon: HeartPulse,
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/80',
      bgGradient: 'from-emerald-950/40 to-slate-950/80',
      barGradient: 'from-emerald-500 to-teal-400',
      perks: ['Dopamine Shield', 'REM Recovery Matrix'],
    },
    {
      id: 'agi',
      name: 'Agility',
      rank: 'RANK A-1',
      bonus: '+11% Execution Speed',
      xp: 400,
      nextXp: 500,
      percent: 80,
      icon: Zap,
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/80',
      bgGradient: 'from-amber-950/40 to-slate-950/80',
      barGradient: 'from-amber-500 to-yellow-400',
      perks: ['Instant-Inbox Deflector', 'Frictionless Sprint'],
    },
  ];

  return (
    <div className="space-y-4 font-mono text-slate-100">
      {/* Breadcrumb Top Nodes */}
      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold px-1">
        <span>[ OPERATOR NEURAL GRAPH ]</span>
        <span className="text-purple-300">[ SYNCHRONIZED: 18:25 ]</span>
      </div>

      {/* Main Radar Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/60 bg-gradient-to-b from-[#160E30] via-[#0E0C26] to-[#070614] p-5 shadow-[0_0_35px_rgba(0,240,255,0.25)]">
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

        {/* Hero Title & Class */}
        <div className="relative text-center space-y-1 mb-2">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 text-[10px] font-black text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            <Swords className="w-3 h-3 text-cyan-300" />
            <span>LVL {hero.level} CHRONO-KNIGHT</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            {hero.username}
          </h2>
          <p className="text-[11px] text-purple-300 font-sans">
            {hero.specialization}
          </p>
        </div>

        {/* Hexagonal Stats Radar */}
        <div className="relative flex justify-center my-1">
          <StatsRadar stats={hero.radar} size={250} />
        </div>

        {/* Triple Stat Readout Pills */}
        <div className="relative grid grid-cols-3 gap-2 pt-2 border-t border-[#262058] text-center text-[10px]">
          <div className="rounded-xl border border-pink-500/60 bg-pink-950/40 p-2">
            <span className="text-slate-400 block text-[9px]">Focus Vitality</span>
            <span className="font-black text-pink-300">+{hero.vitalityBonus}%</span>
          </div>
          <div className="rounded-xl border border-cyan-400/60 bg-cyan-950/40 p-2">
            <span className="text-slate-400 block text-[9px]">Synaptic Surge</span>
            <span className="font-black text-cyan-300">+{hero.surgeBonus}%</span>
          </div>
          <div className="rounded-xl border border-amber-400/60 bg-amber-950/40 p-2">
            <span className="text-slate-400 block text-[9px]">Strike Latency</span>
            <span className="font-black text-amber-300">-{hero.strikeLatency}ms</span>
          </div>
        </div>
      </div>

      {/* Unspent Skill Points Banner */}
      <div className="relative flex items-center justify-between rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 p-3.5 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-base shadow-sm">
            ✦
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-bold block">NEURAL FLOW READY</span>
            <span className="text-xs font-black text-white">
              {hero.unspentSkillPoints} Unspent Skill Points
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playSkillUnlock();
            onSpendSkillPoint();
          }}
          className="flex items-center gap-1 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-950 shadow-md hover:bg-amber-300 active:scale-95 transition-transform"
        >
          <span>DISTRIBUTE</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* 4 Core Disciplines Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs">
          <h3 className="font-black text-white flex items-center gap-1.5 uppercase">
            <Activity className="w-4 h-4 text-cyan-400" /> Core Neural Disciplines
          </h3>
          <span className="text-[10px] text-slate-400">Tap cards to inspect perks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {disciplines.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedAttribute === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                onClick={() => {
                  sound.playClick();
                  setSelectedAttribute(isSelected ? null : item.id);
                }}
                className={`cursor-pointer overflow-hidden rounded-2xl border-2 ${item.borderColor} bg-gradient-to-b ${item.bgGradient} p-4 shadow-lg transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <Icon className={`w-4 h-4 ${item.textColor}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{item.name}</h4>
                      <span className={`text-[10px] font-bold ${item.textColor}`}>
                        {item.bonus}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-black text-slate-300">
                    {item.rank}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Proficiency Track</span>
                    <span className="text-white font-bold">
                      {item.xp} / {item.nextXp} XP ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full border border-indigo-950 bg-[#0A0718]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${item.barGradient}`}
                    />
                  </div>
                </div>

                {/* Sub-Perks Tags */}
                <div className="mt-2.5 pt-2 border-t border-indigo-950/80 flex items-center gap-1.5 flex-wrap text-[10px]">
                  {item.perks.map((p, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-indigo-900/60 bg-[#120B28] px-2 py-0.5 text-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Neural Circuit Skill Tree Section */}
      <NeuralSkillTree
        unspentPoints={hero.unspentSkillPoints}
        onUpgradeNode={() => {}}
      />

      {/* Synaptic Audit Trail (Live Log) */}
      <div className="rounded-3xl border-2 border-[#201D48] bg-[#0E0B20] p-4 space-y-2.5 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#241F50] text-xs">
          <span className="font-black text-white flex items-center gap-1.5 uppercase">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" /> Synaptic Audit Trail
          </span>
          <span className="text-[10px] text-cyan-400">NODE: #0182-DX</span>
        </div>

        <div className="space-y-2 text-[11px]">
          {SAMPLE_AUDIT_LOGS.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl border border-indigo-950 bg-[#140F2C] p-2.5"
            >
              <div>
                <span className="font-bold text-white block">{log.action}</span>
                <span className="text-[10px] text-slate-400">{log.timestamp}</span>
              </div>

              <div className="text-right">
                <span className="font-black text-cyan-300 block">+{log.xpGain} XP</span>
                <span className="text-[10px] text-amber-400 font-bold">{log.multiplier}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
