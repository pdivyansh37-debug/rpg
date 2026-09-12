'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Trophy,
  Crown,
  Flame,
  Swords,
  Gift,
  Send,
  Sparkles,
  Zap,
  Shield,
  MessageSquare,
  Radio,
  CheckCircle2,
  HeartHandshake,
  Award,
} from 'lucide-react';
import { LeaderboardOperator, PartyQuestScroll, LeaderboardFlare } from '@/types/game';
import { PixelAvatar, DEFAULT_AVATAR } from './pixel-avatar';
import { sound } from '@/lib/sound';

interface SyndicateGuildViewProps {
  currentUsername: string;
  currentUserLevel: number;
  currentUserStreak: number;
  currentUserXp: number;
  currentUserGold: number;
  activeFlare?: LeaderboardFlare;
  onSendTip?: (targetName: string, amount: number) => void;
  onAttackPartyBoss?: (damage: number) => void;
}

const INITIAL_LEADERBOARD: LeaderboardOperator[] = [
  {
    id: 'lb-1',
    rank: 1,
    username: 'Vex_Cipher',
    title: 'Grandmaster Chrono',
    level: 42,
    streak: 68,
    totalXp: 184500,
    gold: 3840,
    flare: 'GLITCH_FLAME',
    avatar: {
      skinColor: '#4D301E',
      hairColor: '#F43F5E',
      hairStyle: 'spiky',
      shirtColor: '#7C4DFF',
      bgGradient: 'bg-purple-900',
    },
  },
  {
    id: 'lb-2',
    rank: 2,
    username: 'ZeroSage',
    title: 'Algorithmic Monk',
    level: 38,
    streak: 52,
    totalXp: 142000,
    gold: 2450,
    flare: 'SOLAR_GOLD',
    avatar: {
      skinColor: '#E5B887',
      hairColor: '#F7D070',
      hairStyle: 'afro',
      shirtColor: '#F59E0B',
      bgGradient: 'bg-amber-900',
    },
  },
  {
    id: 'lb-3',
    rank: 3,
    username: 'Nova_Prime',
    title: 'Void Sentinel',
    level: 35,
    streak: 45,
    totalXp: 121000,
    gold: 1890,
    flare: 'CHRONO_PURPLE',
    avatar: {
      skinColor: '#FCD8B8',
      hairColor: '#00F0FF',
      hairStyle: 'long',
      shirtColor: '#00D8F6',
      bgGradient: 'bg-cyan-900',
    },
  },
  {
    id: 'lb-4',
    rank: 4,
    username: 'Torque_99',
    title: 'DevOps Warlord',
    level: 29,
    streak: 31,
    totalXp: 98000,
    gold: 1420,
    flare: 'NEON_CYAN',
    avatar: {
      skinColor: '#A87A5B',
      hairColor: '#221E1F',
      hairStyle: 'short',
      shirtColor: '#10B981',
      bgGradient: 'bg-slate-900',
    },
  },
  {
    id: 'lb-5',
    rank: 5,
    username: 'Astra_Byte',
    title: 'Neural Architect',
    level: 24,
    streak: 22,
    totalXp: 74500,
    gold: 980,
    flare: 'NONE',
    avatar: {
      skinColor: '#7E5539',
      hairColor: '#8A5BEF',
      hairStyle: 'spiky',
      shirtColor: '#4A464D',
      bgGradient: 'bg-indigo-950',
    },
  },
];

const INITIAL_PARTY_QUEST: PartyQuestScroll = {
  id: 'pq-1',
  title: 'Operation: Cyber Behemoth',
  description: 'Collective raid against the Procrastination Core. Every habit completed deals team damage!',
  targetBoss: 'Procrastination Behemoth MK-X',
  bossHp: 8400,
  currentHp: 3200,
  cost: 250,
  rewardXp: 600,
  rewardGold: 250,
  isUnlocked: true,
  participants: [
    { name: 'Vex_Cipher', damage: 2400 },
    { name: 'ZeroSage', damage: 1850 },
    { name: 'You (Operator)', damage: 950, isUser: true },
  ],
};

const INITIAL_TRANSMISSIONS = [
  { id: 'msg-1', author: 'Vex_Cipher', text: 'Unlocked Sonic Katana in the Vault! +15% INT boost is insane.', time: '5m ago' },
  { id: 'msg-2', author: 'ZeroSage', text: 'Hit a 50-day streak on morning code rituals! Stay locked in team.', time: '18m ago' },
  { id: 'msg-3', author: 'Torque_99', text: 'Sent 50 gold tip to Nova_Prime for the PR review help.', time: '35m ago' },
  { id: 'msg-4', author: 'Nova_Prime', text: 'Behemoth party boss is down to 40% HP! Keep crushing habits!', time: '1h ago' },
];

export const SyndicateGuildView: React.FC<SyndicateGuildViewProps> = ({
  currentUsername,
  currentUserLevel,
  currentUserStreak,
  currentUserXp,
  currentUserGold,
  activeFlare = 'NONE',
  onSendTip,
  onAttackPartyBoss,
}) => {
  const [subTab, setSubTab] = useState<'LEADERBOARD' | 'PARTY_RAID' | 'GIFTING' | 'FEED'>('LEADERBOARD');

  const [partyQuest, setPartyQuest] = useState<PartyQuestScroll>(INITIAL_PARTY_QUEST);
  const [transmissions, setTransmissions] = useState(INITIAL_TRANSMISSIONS);
  const [inputMessage, setInputMessage] = useState('');
  const [tipTarget, setTipTarget] = useState('Vex_Cipher');
  const [tipAmount, setTipAmount] = useState('50');
  const [giftSuccessToast, setGiftSuccessToast] = useState<string | null>(null);

  const handlePostTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      author: currentUsername,
      text: inputMessage.trim(),
      time: 'Just now',
    };

    setTransmissions([newMsg, ...transmissions]);
    sound.playTaskComplete();
    setInputMessage('');
  };

  const handleSendGift = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(tipAmount, 10) || 50;
    if (currentUserGold < amount) {
      sound.playDamage();
      return;
    }

    sound.playSkillUnlock();
    onSendTip?.(tipTarget, amount);
    setGiftSuccessToast(`Successfully sent ${amount} Gold to ${tipTarget}!`);

    setTimeout(() => setGiftSuccessToast(null), 3000);
  };

  const handlePartyStrike = () => {
    if (partyQuest.currentHp <= 0) return;
    sound.playCritHit();
    const strikeDmg = Math.floor(Math.random() * 250) + 150;
    const nextHp = Math.max(0, partyQuest.currentHp - strikeDmg);

    setPartyQuest((prev) => ({
      ...prev,
      currentHp: nextHp,
      participants: prev.participants.map((p) =>
        p.isUser ? { ...p, damage: p.damage + strikeDmg } : p
      ),
    }));

    onAttackPartyBoss?.(strikeDmg);
  };

  const bossHpPercent = Math.round((partyQuest.currentHp / partyQuest.bossHp) * 100);

  return (
    <div className="space-y-4 font-mono text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1 text-[10px] font-bold">
        <span className="text-cyan-400">[ SYNDICATE GUILD & COMMUNITY ]</span>
        <div className="flex items-center gap-1.5 text-purple-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>MATRIX GRID: ONLINE</span>
        </div>
      </div>

      {/* Hero Syndicate Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-purple-500/60 bg-gradient-to-r from-[#170e2f] via-[#150a24] to-[#080516] p-5 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-purple-400 bg-purple-950/80 px-2 py-0.5 text-[10px] font-black text-purple-300">
              <Users className="w-3 h-3 text-purple-400" />
              <span>NEXUS OPERATOR ALLIANCE</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Syndicate Social Hub
            </h2>
            <p className="text-xs text-slate-300 font-sans max-w-sm">
              Climb global leaderboards, launch party scrolls, tip allies, and coordinate live habit operations!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0c0822] border border-indigo-900 px-3 py-2 rounded-2xl">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-[9px] text-slate-400">YOUR GUILD RANK</div>
              <div className="text-xs font-black text-amber-300">#6 Global Contender</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl border border-indigo-950 bg-[#070514] p-1 text-xs font-bold">
        {[
          { key: 'LEADERBOARD', label: '🏆 Ranks', icon: Trophy },
          { key: 'PARTY_RAID', label: '📜 Party Raids', icon: Swords },
          { key: 'GIFTING', label: '🎁 Gifting', icon: Gift },
          { key: 'FEED', label: '📡 Chat Feed', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                sound.playClick();
                setSubTab(tab.key as any);
              }}
              className={`py-2 px-1 rounded-xl text-center flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast */}
      {giftSuccessToast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500 bg-emerald-950/80 p-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{giftSuccessToast}</span>
        </div>
      )}

      {/* 1. Leaderboard View with Holographic Flares */}
      {subTab === 'LEADERBOARD' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
            <span>OPERATOR RANKINGS // ALL TIME</span>
            <span className="text-cyan-400">🔥 TOP 5 PRODIGIES</span>
          </div>

          <div className="space-y-2">
            {INITIAL_LEADERBOARD.map((user) => {
              const isFirst = user.rank === 1;
              const isSecond = user.rank === 2;
              const isThird = user.rank === 3;

              const flareBorder =
                user.flare === 'GLITCH_FLAME'
                  ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                  : user.flare === 'SOLAR_GOLD'
                  ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-1 ring-amber-300'
                  : user.flare === 'CHRONO_PURPLE'
                  ? 'border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : user.flare === 'NEON_CYAN'
                  ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'border-indigo-950';

              return (
                <div
                  key={user.id}
                  className={`relative flex items-center justify-between rounded-2xl border bg-[#0d0922]/90 p-3.5 transition-all ${flareBorder}`}
                >
                  {/* Left: Rank & Avatar */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-xl font-black text-xs ${
                        isFirst
                          ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                          : isSecond
                          ? 'bg-slate-300 text-slate-950'
                          : isThird
                          ? 'bg-amber-700 text-white'
                          : 'bg-indigo-950 text-slate-400'
                      }`}
                    >
                      {user.rank}
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-indigo-950 overflow-hidden">
                      <PixelAvatar config={user.avatar || DEFAULT_AVATAR} size={36} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">{user.username}</span>
                        {user.flare !== 'NONE' && (
                          <span className="text-[9px] font-black uppercase text-pink-400 bg-pink-950/60 border border-pink-500/40 px-1 rounded">
                            {user.flare.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{user.title}</div>
                    </div>
                  </div>

                  {/* Right: Stats & Streak */}
                  <div className="flex items-center gap-3 text-right">
                    <div className="hidden sm:block text-[10px] text-slate-400">
                      <div>LVL <span className="font-bold text-white">{user.level}</span></div>
                      <div>{user.totalXp.toLocaleString()} XP</div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-500/50 px-2 py-1 rounded-xl">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>{user.streak}D</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Current Player Card */}
            <div className={`mt-4 rounded-2xl border-2 p-3.5 bg-gradient-to-r from-[#170e33] to-[#0c0822] flex items-center justify-between ${
              activeFlare === 'GLITCH_FLAME'
                ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : activeFlare === 'SOLAR_GOLD'
                ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                : 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-black text-xs">
                  6
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-cyan-300">{currentUsername} (YOU)</span>
                    <span className="text-[9px] font-black uppercase text-cyan-400 bg-cyan-950/80 border border-cyan-400 px-1 rounded">
                      CONTENDER
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-300">Chrono-Knight // LVL {currentUserLevel}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <span>🪙 {currentUserGold}</span>
                <span className="text-rose-400">🔥 {currentUserStreak}D</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Co-op Party Raids (Unlocked with scrolls) */}
      {subTab === 'PARTY_RAID' && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-purple-500/60 bg-gradient-to-b from-[#180e30] to-[#0a071c] p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400">
                  // CO-OP SYNDICATE RAID
                </span>
                <h3 className="text-base font-black text-white">{partyQuest.targetBoss}</h3>
                <p className="text-xs text-slate-300 font-sans mt-0.5">{partyQuest.description}</p>
              </div>

              <div className="rounded-xl border border-amber-500/60 bg-amber-950/60 px-2.5 py-1 text-xs font-black text-amber-300 shrink-0">
                🎁 +{partyQuest.rewardXp} XP / +{partyQuest.rewardGold} Gold
              </div>
            </div>

            {/* Boss HP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-rose-400">BOSS SHIELD INTEGRITY</span>
                <span className="text-white">{partyQuest.currentHp.toLocaleString()} / {partyQuest.bossHp.toLocaleString()} HP</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-900 border border-indigo-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${bossHpPercent}%` }}
                />
              </div>
            </div>

            {/* Team Contributions */}
            <div className="rounded-xl border border-indigo-950 bg-[#0d0822] p-2.5 text-xs space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase">Team Damage Contribution:</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                {partyQuest.participants.map((p) => (
                  <div key={p.name} className="p-1.5 rounded-lg border border-indigo-900 bg-white/5">
                    <div className="font-bold text-white truncate">{p.name}</div>
                    <div className="text-cyan-400 font-black">{p.damage.toLocaleString()} DMG</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Strike Button */}
            <button
              type="button"
              onClick={handlePartyStrike}
              disabled={partyQuest.currentHp <= 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 py-3 text-xs font-black text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Swords className="w-4 h-4" />
              <span>{partyQuest.currentHp <= 0 ? '🏆 RAID COMPLETE // VICTORY' : 'Execute Habit Strike (-200 DMG)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Gifting / Tip Terminal */}
      {subTab === 'GIFTING' && (
        <div className="rounded-2xl border border-indigo-900 bg-[#0d0924] p-4 text-xs space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-pink-400" />
              <span>Operator Tribute & Tip Terminal</span>
            </h3>
            <p className="text-slate-400 font-sans">
              Send gold tips, honor commendations, or supportive buffs to friends and guildmates.
            </p>
          </div>

          <form onSubmit={handleSendGift} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Select Recipient Operator
              </label>
              <select
                value={tipTarget}
                onChange={(e) => setTipTarget(e.target.value)}
                className="w-full rounded-xl border border-indigo-900 bg-[#120c2e] px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Vex_Cipher">Vex_Cipher (Grandmaster Chrono)</option>
                <option value="ZeroSage">ZeroSage (Algorithmic Monk)</option>
                <option value="Nova_Prime">Nova_Prime (Void Sentinel)</option>
                <option value="Torque_99">Torque_99 (DevOps Warlord)</option>
                <option value="Astra_Byte">Astra_Byte (Neural Architect)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Gift Amount (🪙 Gold Credits)
              </label>
              <div className="flex gap-2">
                {['25', '50', '100', '250'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTipAmount(amt)}
                    className={`flex-1 py-2 rounded-xl text-center font-bold border transition-all ${
                      tipAmount === amt
                        ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-sm'
                        : 'border-indigo-950 bg-[#120c2e] text-slate-400 hover:text-white'
                    }`}
                  >
                    🪙 {amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={currentUserGold < parseInt(tipAmount, 10)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-xs font-black text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Send {tipAmount} Gold Gift to {tipTarget}</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. Live Transmission Chat Feed */}
      {subTab === 'FEED' && (
        <div className="space-y-3">
          <form onSubmit={handlePostTransmission} className="flex gap-2">
            <input
              type="text"
              required
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Transmit message or achievement to syndicate..."
              className="flex-1 rounded-xl border border-indigo-900 bg-[#0e0a24] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-black text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

          <div className="space-y-2">
            {transmissions.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl border border-indigo-950 bg-[#0d0920] p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-black text-cyan-400">@{msg.author}</span>
                  <span className="text-slate-500">{msg.time}</span>
                </div>
                <p className="text-slate-200 font-sans">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
