'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Flame, Heart, AlertTriangle, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/sound';

interface HeroFaintModalProps {
  isOpen: boolean;
  goldPenalty: number;
  onRevive: () => void;
}

export const HeroFaintModal: React.FC<HeroFaintModalProps> = ({
  isOpen,
  goldPenalty,
  onRevive,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark Red Pulse Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-rose-950/90 backdrop-blur-lg"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-rose-500 bg-[#12040b] p-6 shadow-[0_0_60px_rgba(244,63,94,0.5)] font-mono text-slate-200 text-center"
        >
          {/* Top Scanline Pulse */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] animate-pulse" />

          {/* Skull Icon Emblem */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-rose-500 bg-rose-950/80 shadow-[0_0_30px_rgba(244,63,94,0.6)]">
            <Skull className="h-10 w-10 text-rose-400 animate-bounce" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-widest text-rose-400">
            [ CRITICAL FAILURE // HP 0 ]
          </span>

          <h2 className="mt-1 text-2xl font-black text-white tracking-tight">
            OPERATOR FAINTED!
          </h2>

          <p className="mt-3 text-xs text-rose-200/80 leading-relaxed">
            Your vital energy was depleted by negative habits and neglected protocols. Discipline is your armor in the digital nexus.
          </p>

          {/* Penalty Box */}
          <div className="mt-4 rounded-2xl border border-rose-900/80 bg-rose-950/40 p-3.5 text-xs text-left space-y-1.5">
            <div className="flex items-center justify-between text-rose-300 font-bold">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Discipline Penalty:
              </span>
              <span className="text-rose-400 font-black">-{goldPenalty} Gold</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Emergency Defibrillation:</span>
              <span className="text-emerald-400 font-bold">+50% Max HP Restored</span>
            </div>
          </div>

          {/* Rebirth Button */}
          <button
            onClick={() => {
              sound.playPotion();
              onRevive();
            }}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 py-4 text-sm font-black text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PHOENIX REBIRTH // REVIVE</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
