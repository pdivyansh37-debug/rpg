'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Skull,
  Flame,
  Swords,
  Zap,
  Users,
  Trophy,
  Check,
  Clock,
  Target,
  Shield,
  Sparkles,
  Award,
} from 'lucide-react';
import { WorldBossState, FireteamMember, RaidDirective } from '@/types/game';
import { sound } from '@/lib/sound';

interface WorldBossViewProps {
  onBossDamageDealt?: (damage: number) => void;
}

const INITIAL_BOSS: WorldBossState = {
  name: 'The Procrastination Behemoth',
  title: 'LVL 50 ANCIENT VOID CALAMITY',
  currentHp: 42350,
  maxHp: 100000,
  timeLeft: '2d 14h 22m',
  userStoredDamage: 3740,
  globalParticipants: 1428,
};

const INITIAL_FIRETEAM: FireteamMember[] = [
  { id: 'm-1', name: 'You (Paladin)', role: 'Grandmaster Operator', damage: 12400, isUser: true, avatarColor: 'bg-cyan-500' },
  { id: 'm-2', name: 'Vex_Cipher', role: 'Fullstack Chrono', damage: 10140, isUser: false, avatarColor: 'bg-purple-500' },
  { id: 'm-3', name: 'ZeroSage', role: 'Algorithmic Monk', damage: 8200, isUser: false, avatarColor: 'bg-emerald-500' },
  { id: 'm-4', name: 'Torque_99', role: 'DevOps Warlord', damage: 6850, isUser: false, avatarColor: 'bg-amber-500' },
];

const INITIAL_DIRECTIVES: RaidDirective[] = [
  {
    id: 'rd-1',
    title: 'Crush 3 Hard Quests before Friday',
    description: 'Conquer major architectural tasks & heavy deep work sessions.',
    progress: 2,
    maxProgress: 3,
    rewardDamage: 4500,
    completed: false,
    isClaimed: false,
  },
  {
    id: 'rd-2',
    title: 'Maintain 7-Day Unbroken Habit Streak',
    description: 'All daily discipline checkpoints validated across schedule.',
    progress: 7,
    maxProgress: 7,
    rewardDamage: 3000,
    completed: true,
    isClaimed: false,
  },
  {
    id: 'rd-3',
    title: 'Morning Sprint Protocol: 5 consecutive days',
    description: 'Complete high priority habit task before 08:00 AM.',
    progress: 4,
    maxProgress: 5,
    rewardDamage: 5000,
    completed: false,
    isClaimed: false,
  },
];

export const WorldBossView: React.FC<WorldBossViewProps> = ({
  onBossDamageDealt,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'LOG' | 'RAID' | 'GUILD'>('RAID');
  const [boss, setBoss] = useState<WorldBossState>(INITIAL_BOSS);
  const [fireteam, setFireteam] = useState<FireteamMember[]>(INITIAL_FIRETEAM);
  const [directives, setDirectives] = useState<RaidDirective[]>(INITIAL_DIRECTIVES);

  // Attack animations & floating combat numbers
  const [isStriking, setIsStriking] = useState(false);
  const [damagePopup, setDamagePopup] = useState<string | null>(null);

  const bossHpPercent = Math.min(100, Math.max(0, Math.round((boss.currentHp / boss.maxHp) * 100)));

  const handleDeployStrike = () => {
    if (boss.userStoredDamage <= 0 || isStriking) return;

    sound.playBossAttack();
    setIsStriking(true);

    const dmg = boss.userStoredDamage;
    setDamagePopup(`-${dmg.toLocaleString()} CRIT DMG!`);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.4 },
    });

    setTimeout(() => {
      sound.playCritHit();
      setBoss((prev) => ({
        ...prev,
        currentHp: Math.max(0, prev.currentHp - dmg),
        userStoredDamage: 0,
      }));

      setFireteam((prev) =>
        prev.map((m) => (m.isUser ? { ...m, damage: m.damage + dmg } : m))
      );

      onBossDamageDealt?.(dmg);
      setIsStriking(false);
    }, 450);

    setTimeout(() => {
      setDamagePopup(null);
    }, 2000);
  };

  const handleClaimDirective = (directiveId: string) => {
    sound.playCoin();
    setDirectives((prev) =>
      prev.map((d) => {
        if (d.id === directiveId) {
          setBoss((b) => ({
            ...b,
            userStoredDamage: b.userStoredDamage + d.rewardDamage,
          }));
          return { ...d, isClaimed: true };
        }
        return d;
      })
    );
  };

  return (
    <div className="space-y-4 font-mono text-slate-100">
      {/* Top Sub-Navigation Tabs */}
      <div className="flex gap-2 text-xs">
        {[
          { key: 'LOG', label: ':: Daily Log' },
          { key: 'RAID', label: ':: World Raid' },
          { key: 'GUILD', label: ':: Guild Trials' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              sound.playClick();
              setActiveSubTab(key as any);
            }}
            className={`flex-1 py-2 rounded-xl border font-bold transition-all text-center ${
              activeSubTab === key
                ? 'border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                : 'border-[#201D48] bg-[#0E0A22] text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* World Boss Encounter Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-rose-500/80 bg-gradient-to-b from-[#240A18] via-[#160814] to-[#0A040A] p-5 shadow-[0_0_40px_rgba(244,63,94,0.35)]">
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

        {/* Live Encounter Header */}
        <div className="relative flex items-center justify-between text-[10px] mb-3">
          <span className="flex items-center gap-1.5 rounded-md border border-rose-500/80 bg-rose-950/80 px-2 py-0.5 font-black text-rose-300 shadow-sm animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
            [ LIVE // WORLD RAID ]
          </span>

          <span className="flex items-center gap-1 text-slate-300 font-bold">
            <Clock className="w-3 h-3 text-rose-400" />
            TIME LEFT: {boss.timeLeft}
          </span>
        </div>

        {/* Boss Creature Artwork & Name */}
        <div className="relative text-center py-2">
          {/* Animated Boss Icon / Skull */}
          <div className="relative inline-flex items-center justify-center my-2">
            <motion.div
              animate={isStriking ? { scale: [1, 1.2, 0.9, 1], rotate: [0, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-rose-500 bg-rose-950/90 shadow-[0_0_35px_rgba(244,63,94,0.7)]"
            >
              <Skull className="h-14 w-14 text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.9)] animate-pulse" />
            </motion.div>

            {/* Floating Damage Popup */}
            <AnimatePresence>
              {damagePopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1.3, y: -40 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-20 font-black text-amber-300 text-lg sm:text-xl drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] whitespace-nowrap"
                >
                  {damagePopup}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-widest block">
            {boss.title}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
            {boss.name}
          </h2>
        </div>

        {/* Boss HP Bar */}
        <div className="relative mt-2 space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-rose-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              CALAMITY INTEGRITY
            </span>
            <span className="text-white font-black">
              {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP ({bossHpPercent}%)
            </span>
          </div>

          <div className="h-3.5 w-full overflow-hidden rounded-full border-2 border-rose-900 bg-[#12050C]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${bossHpPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)]"
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
            <span>+ Global Co-op Sync Active</span>
            <span>{boss.globalParticipants.toLocaleString()} Paladins Engaged</span>
          </div>
        </div>
      </div>

      {/* Ready Tactical Strike Action Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/90 bg-gradient-to-b from-[#201505] via-[#140E04] to-[#0A0702] p-5 shadow-[0_0_30px_rgba(251,191,36,0.3)] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            STORED TACTICAL STRIKE
          </span>
          <span className="rounded-md bg-amber-950 border border-amber-500/80 px-2 py-0.5 font-black text-amber-300 text-[10px]">
            {boss.userStoredDamage > 0 ? 'MAX READY' : 'RECHARGING'}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {boss.userStoredDamage.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-amber-300">STRIKE DMG ACCUMULATED</span>
        </div>

        {/* Deploy Strike Giant Gold Button */}
        <button
          onClick={handleDeployStrike}
          disabled={boss.userStoredDamage <= 0 || isStriking}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black shadow-lg transition-all ${
            boss.userStoredDamage > 0
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:brightness-110 active:scale-[0.98]'
              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Swords className="w-5 h-5 stroke-[2.5]" />
          <span>[ DEPLOY STRIKE // ATTACK BOSS ]</span>
        </button>

        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          Damage is generated collectively by completing <span className="text-pink-400 font-bold">HARD (+450 DMG)</span> and <span className="text-amber-400 font-bold">MEDIUM (+200 DMG)</span> dispatch quests during the active weekly cycle.
        </p>
      </div>

      {/* Vanguard Fireteam (4/4 Party Co-op) */}
      <div className="rounded-3xl border-2 border-[#201D48] bg-[#0E0A22] p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-white flex items-center gap-1.5 uppercase">
            <Users className="w-4 h-4 text-cyan-400" /> Vanguard Fireteam Leaderboard
          </span>
          <span className="text-[10px] text-cyan-300 font-bold">4/4 CO-OP PARTY</span>
        </div>

        <div className="space-y-2">
          {fireteam.map((member, idx) => (
            <div
              key={member.id}
              className={`flex items-center justify-between rounded-2xl border p-3 transition-all ${
                member.isUser
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'border-[#201D48] bg-[#120B28]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-xs font-black text-amber-400">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    {member.name}
                    {member.isUser && (
                      <span className="rounded bg-cyan-900/80 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300">
                        MVP
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-sans">{member.role}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs sm:text-sm font-black text-amber-300 block">
                  {member.damage.toLocaleString()} DMG
                </span>
                <span className="text-[9px] text-cyan-400">Synchronized</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Raid Directives (Solo & Co-op Quests) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs">
          <h3 className="font-black text-white flex items-center gap-1.5 uppercase">
            <Target className="w-4 h-4 text-rose-400" /> Target Raid Directives
          </h3>
          <span className="text-[10px] text-slate-400">3 DIRECTIVES ACTIVE</span>
        </div>

        <div className="space-y-2.5">
          {directives.map((dir) => (
            <div
              key={dir.id}
              className="rounded-2xl border-2 border-[#201D48] bg-gradient-to-b from-[#140E2A] to-[#0A0718] p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white">{dir.title}</h4>
                  <p className="text-[11px] text-slate-300 font-sans mt-0.5">{dir.description}</p>
                </div>

                <span className="rounded-md border border-amber-500/60 bg-amber-950/80 px-2 py-0.5 font-mono text-[10px] font-black text-amber-300 shrink-0">
                  +{dir.rewardDamage.toLocaleString()} DMG
                </span>
              </div>

              {/* Progress & Claim Button */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Progress: {dir.progress} / {dir.maxProgress}
                </span>

                {dir.completed ? (
                  dir.isClaimed ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/60 px-2.5 py-1 rounded-xl">
                      <Check className="w-3 h-3" /> CLAIMED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimDirective(dir.id)}
                      className="rounded-xl bg-purple-600 px-3 py-1 text-[11px] font-black text-white shadow-[0_0_12px_rgba(168,85,247,0.5)] hover:bg-purple-500 active:scale-95 transition-transform"
                    >
                      CLAIM STRIKE (+{dir.rewardDamage} DMG)
                    </button>
                  )
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold">IN PROGRESS</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
