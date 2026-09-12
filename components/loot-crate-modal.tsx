'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, X, Check, Shield, Gem, Zap } from 'lucide-react';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';

export interface LootReward {
  type: 'GOLD' | 'SHARDS' | 'POTION' | 'GEAR';
  title: string;
  amount?: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  icon: string;
  description: string;
}

interface LootCrateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (rewards: LootReward[]) => void;
}

const SAMPLE_LOOT_TABLE: LootReward[][] = [
  [
    {
      type: 'GOLD',
      title: 'Neural Gold Cache',
      amount: 85,
      rarity: 'RARE',
      icon: '🪙',
      description: '+85 Gold transferred to your cyber wallet.',
    },
    {
      type: 'SHARDS',
      title: 'Cyber Shard Matrix',
      amount: 4,
      rarity: 'RARE',
      icon: '💎',
      description: '+4 Cyber Shards for skill tree augmentation.',
    },
  ],
  [
    {
      type: 'POTION',
      title: 'Nanite Health Infusion',
      amount: 1,
      rarity: 'EPIC',
      icon: '🧪',
      description: 'Restores +250 HP immediately.',
    },
    {
      type: 'GOLD',
      title: 'Bounty Jackpot',
      amount: 150,
      rarity: 'LEGENDARY',
      icon: '💰',
      description: '+150 Gold bonus reward jackpot!',
    },
  ],
  [
    {
      type: 'GEAR',
      title: 'Relic: Chrono Hyper-Core',
      amount: 1,
      rarity: 'EPIC',
      icon: '⚡',
      description: 'Ancient computing artifact with +15% surge bonus.',
    },
  ],
];

export const LootCrateModal: React.FC<LootCrateModalProps> = ({
  isOpen,
  onClose,
  onClaim,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [currentRewards, setCurrentRewards] = useState<LootReward[]>(SAMPLE_LOOT_TABLE[0]);

  if (!isOpen) return null;

  const handleOpenCrate = () => {
    // Pick random reward bundle
    const randomBundle =
      SAMPLE_LOOT_TABLE[Math.floor(Math.random() * SAMPLE_LOOT_TABLE.length)];
    setCurrentRewards(randomBundle);
    setIsOpened(true);
    sound.playLootFanfare();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#FF007A', '#FBBF24', '#8A5BEF'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleClaimRewards = () => {
    sound.playCoin();
    onClaim(currentRewards);
    setIsOpened(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (isOpened) handleClaimRewards();
            else onClose();
          }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 25 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-amber-400 bg-[#0e0a22] p-6 shadow-[0_0_50px_rgba(251,191,36,0.35)] font-mono text-slate-200 text-center"
        >
          {/* Top Scanline */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]" />

          {/* Close button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 rounded-xl border border-indigo-900 bg-indigo-950/60 p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {!isOpened ? (
            /* Unopened Chest View */
            <div className="space-y-4 py-3">
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: 'easeInOut',
                }}
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-amber-400 bg-gradient-to-br from-amber-950 via-yellow-950 to-indigo-950 text-5xl shadow-[0_0_35px_rgba(251,191,36,0.6)]"
              >
                🎁
              </motion.div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  // RARE SYSTEM ENCOUNTER
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  MYSTERY LOOT CRATE!
                </h2>
                <p className="mt-2 text-xs text-slate-300">
                  Your discipline earned you a classified drop. Decrypt now to uncover cyber resources and gear!
                </p>
              </div>

              <button
                onClick={handleOpenCrate}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-4 text-sm font-black text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.7)] transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>UNBOX & DECRYPT LOOT</span>
              </button>
            </div>
          ) : (
            /* Revealed Rewards View */
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>LOOT DECRYPTED // VICTORY!</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Rewards Discovered
              </h2>

              {/* Rewards List */}
              <div className="space-y-2.5 text-left">
                {currentRewards.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="flex items-center gap-3 rounded-2xl border border-amber-400/50 bg-amber-950/30 p-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-900/60 border border-amber-400/60 text-2xl shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                        <span className="text-[10px] font-black text-amber-400 rounded-md bg-amber-950 border border-amber-800 px-1.5 py-0.5">
                          {item.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Claim Button */}
              <button
                onClick={handleClaimRewards}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 py-4 text-sm font-black text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all hover:scale-105 active:scale-95"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>CLAIM ALL LOOT</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
