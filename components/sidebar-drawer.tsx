'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Shield,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Heart,
  Coins,
  Crown,
  Coffee,
  HelpCircle,
} from 'lucide-react';
import { PixelAvatar } from './pixel-avatar';
import { HabiticaHero } from '@/types/game';
import { sound } from '@/lib/sound';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hero: HabiticaHero;
  onOpenAvatarCustomizer: () => void;
  onResetData: () => void;
  isRestingInTavern?: boolean;
  onToggleTavern?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  hero,
  onOpenAvatarCustomizer,
  onResetData,
  isRestingInTavern = false,
  onToggleTavern,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 flex h-full w-4/5 max-w-xs flex-col bg-white shadow-2xl"
        >
          {/* Top Profile Banner */}
          <div className="bg-[#5D32A8] p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Habitica RPG
              </span>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-purple-200 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9E8EF0] shadow-sm">
                <PixelAvatar config={hero.avatar} size={42} />
              </div>
              <div>
                <h3 className="text-base font-bold leading-tight">{hero.username}</h3>
                <span className="text-xs text-purple-200 font-semibold">Level {hero.level} Warrior</span>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-semibold text-slate-700">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenAvatarCustomizer();
              }}
              className="flex w-full items-center gap-3 rounded-xl p-2.5 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <User className="w-5 h-5 text-purple-600" />
              <span>Customize Avatar</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                const muted = sound.toggleMute();
                setIsMuted(muted);
              }}
              className="flex w-full items-center gap-3 rounded-xl p-2.5 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-slate-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-purple-600" />
              )}
              <span>Sound Effects: {isMuted ? 'Muted' : 'Enabled'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onToggleTavern?.();
              }}
              className={`flex w-full items-center gap-3 rounded-xl p-2.5 transition-colors ${
                isRestingInTavern
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 font-bold'
                  : 'hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <Coffee className="w-5 h-5 text-amber-600" />
              <span>
                {isRestingInTavern ? 'Resting in Inn (Paused)' : 'Rest in the Inn'}
              </span>
            </button>

            <div className="pt-3 border-t border-slate-100 mt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onResetData();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-rose-500" />
                <span>Reset Sample Data</span>
              </button>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Habitica Gamified Life RPG • 16-Bit Edition
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
