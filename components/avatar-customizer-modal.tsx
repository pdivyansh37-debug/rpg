'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Dices, Shield, Zap, RefreshCw, User, Cpu } from 'lucide-react';
import { PixelAvatar, DEFAULT_AVATAR } from './pixel-avatar';
import { AvatarConfig, AvatarGender, AvatarHairStyle } from '@/types/game';
import { sound } from '@/lib/sound';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig?: AvatarConfig;
  onSaveConfig: (newConfig: AvatarConfig) => void;
  operatorName?: string;
  operatorLevel?: number;
}

const GENDER_OPTIONS: { id: AvatarGender; label: string; icon: string; desc: string }[] = [
  { id: 'MALE', label: 'Male / Knight', icon: '♂️', desc: 'Warrior Chassis' },
  { id: 'FEMALE', label: 'Female / Valkyrie', icon: '♀️', desc: 'Aegis Chassis' },
  { id: 'CYBORG', label: 'Cyborg / Synth', icon: '🤖', desc: 'Augmented Frame' },
];

const SKIN_TONES = [
  { label: 'Pale', color: '#FCD8B8' },
  { label: 'Fair', color: '#E5B887' },
  { label: 'Tan', color: '#A87A5B' },
  { label: 'Warm', color: '#7E5539' },
  { label: 'Deep', color: '#4D301E' },
  { label: 'Chrome Synth', color: '#CBD5E1' },
  { label: 'Neon Cyan', color: '#67E8F9' },
  { label: 'Void Lilac', color: '#C084FC' },
];

const HAIR_COLORS = [
  { label: 'Obsidian', color: '#221E1F' },
  { label: 'Espresso', color: '#5A3825' },
  { label: 'Platinum Blonde', color: '#F7D070' },
  { label: 'Cyber Cyan', color: '#00F0FF' },
  { label: 'Neon Pink', color: '#F43F5E' },
  { label: 'Purple Void', color: '#8A5BEF' },
  { label: 'Toxic Lime', color: '#84CC16' },
  { label: 'Silver Chrome', color: '#E2E8F0' },
];

const HAIR_STYLES: { id: AvatarHairStyle; label: string; iconText: string; category?: 'ALL' | 'MALE' | 'FEMALE' }[] = [
  { id: 'short', label: 'Short Crop', iconText: '✂️ Short' },
  { id: 'spiky', label: 'Cyber Spiky', iconText: '⚡ Spiky' },
  { id: 'afro', label: 'Afro Curls', iconText: '🌀 Afro' },
  { id: 'long', label: 'Flowing Long', iconText: '🌊 Long' },
  { id: 'ponytail', label: 'High Ponytail', iconText: '🎀 Ponytail' },
  { id: 'bob', label: 'Neon Bob', iconText: '💇‍♀️ Bob Cut' },
  { id: 'braids', label: 'Twin Braids', iconText: '✨ Braids' },
  { id: 'cyber_helm', label: 'Visor Helm', iconText: '🪖 Helm' },
];

const SHIRT_COLORS = [
  { label: 'Shadow Plate', color: '#4A464D' },
  { label: 'Chrono Violet', color: '#7C4DFF' },
  { label: 'Ion Cyan', color: '#00D8F6' },
  { label: 'Laser Crimson', color: '#E11D48' },
  { label: 'Matrix Emerald', color: '#10B981' },
  { label: 'Solar Amber', color: '#F59E0B' },
];

const AURA_GLOWS = [
  { label: 'Matrix Cyan', bg: 'from-cyan-950/60 to-indigo-950/80', border: 'border-cyan-400', shadow: 'rgba(0,240,255,0.4)' },
  { label: 'Chrono Violet', bg: 'from-purple-950/60 to-indigo-950/80', border: 'border-purple-400', shadow: 'rgba(168,85,247,0.4)' },
  { label: 'Solar Gold', bg: 'from-amber-950/60 to-orange-950/80', border: 'border-amber-400', shadow: 'rgba(251,191,36,0.4)' },
  { label: 'Crimson Surge', bg: 'from-rose-950/60 to-red-950/80', border: 'border-rose-400', shadow: 'rgba(244,63,94,0.4)' },
];

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentConfig = DEFAULT_AVATAR,
  onSaveConfig,
  operatorName = 'Nexus Operator',
  operatorLevel = 1,
}) => {
  const [config, setConfig] = useState<AvatarConfig>({ ...DEFAULT_AVATAR, ...currentConfig });
  const [selectedAuraIndex, setSelectedAuraIndex] = useState(0);

  if (!isOpen) return null;

  const currentAura = AURA_GLOWS[selectedAuraIndex] || AURA_GLOWS[0];

  const handleSelectGender = (gender: AvatarGender) => {
    sound.playClick();
    if (gender === 'FEMALE') {
      setConfig((prev) => ({
        ...prev,
        gender: 'FEMALE',
        hairStyle: prev.hairStyle === 'short' || prev.hairStyle === 'spiky' ? 'ponytail' : prev.hairStyle,
      }));
    } else if (gender === 'CYBORG') {
      setConfig((prev) => ({
        ...prev,
        gender: 'CYBORG',
        skinColor: prev.skinColor === '#FCD8B8' ? '#CBD5E1' : prev.skinColor,
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        gender: 'MALE',
        hairStyle: prev.hairStyle === 'ponytail' || prev.hairStyle === 'braids' ? 'spiky' : prev.hairStyle,
      }));
    }
  };

  const handleRandomize = () => {
    sound.playClick();
    const randomGender = GENDER_OPTIONS[Math.floor(Math.random() * GENDER_OPTIONS.length)].id;
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].color;
    const randomHairCol = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].color;
    const randomHairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
    const randomShirt = SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)].color;
    const randomAura = Math.floor(Math.random() * AURA_GLOWS.length);

    setConfig({
      gender: randomGender,
      skinColor: randomSkin,
      hairColor: randomHairCol,
      hairStyle: randomHairStyle,
      shirtColor: randomShirt,
      bgGradient: AURA_GLOWS[randomAura].bg,
    });
    setSelectedAuraIndex(randomAura);
  };

  const handleSave = () => {
    sound.playLevelUp();
    onSaveConfig(config);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-cyan-500/50 bg-[#0c0920]/95 shadow-[0_0_50px_rgba(0,240,255,0.25)] p-5 sm:p-6 text-slate-100 max-h-[92vh] flex flex-col"
        >
          {/* Top Neon Scanline */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(0,240,255,0.8)]" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400 bg-cyan-950/60 shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase">
                  // BIOMETRIC SYNTHESIS
                </span>
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Avatar Matrix Studio
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRandomize}
                title="Randomize Appearance"
                className="flex items-center gap-1 rounded-xl border border-purple-500/60 bg-purple-950/50 px-2.5 py-1.5 text-[11px] font-bold text-purple-300 hover:border-purple-400 hover:bg-purple-900/60 transition-all shadow-sm"
              >
                <Dices className="w-3.5 h-3.5 text-purple-300" />
                <span className="hidden sm:inline">Randomize</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="rounded-xl border border-indigo-900 bg-indigo-950/40 p-1.5 text-slate-400 hover:border-cyan-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Customizer Content */}
          <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-4 text-xs custom-scrollbar">
            {/* Live Character Preview Hologram */}
            <div className="relative flex flex-col items-center justify-center py-4 rounded-2xl border border-indigo-900/60 bg-gradient-to-b from-[#150d36] to-[#0a061b] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

              {/* Glowing Avatar Frame */}
              <div
                className={`relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 ${currentAura.border} bg-gradient-to-b ${currentAura.bg} transition-all duration-300`}
                style={{ boxShadow: `0 0 25px ${currentAura.shadow}` }}
              >
                <PixelAvatar config={config} size={80} />
                {/* Level Tag */}
                <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-purple-400 bg-purple-950 font-black text-[10px] text-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.7)]">
                  {operatorLevel}
                </span>
              </div>

              {/* Operator Badge Info */}
              <div className="mt-3 text-center">
                <span className="text-xs font-black text-white">{operatorName}</span>
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <span>
                    {config.gender === 'FEMALE' ? '♀️ Neon Valkyrie' : config.gender === 'CYBORG' ? '🤖 Synth Cyborg' : '♂️ Chrono-Knight'}
                  </span>
                  <span className="text-slate-500">//</span>
                  <span className="text-purple-300">MK-VII</span>
                </div>
              </div>
            </div>

            {/* 1. Gender & Body Archetype Section */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">
                1. Gender & Body Archetype
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENDER_OPTIONS.map((g) => {
                  const isSelected = (config.gender || 'MALE') === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleSelectGender(g.id)}
                      className={`p-2.5 rounded-2xl text-center transition-all border flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                          : 'border-indigo-950 bg-[#120c2e] text-slate-400 hover:text-white hover:border-indigo-800'
                      }`}
                    >
                      <span className="text-lg">{g.icon}</span>
                      <span className="text-[11px] font-black">{g.label}</span>
                      <span className="text-[9px] text-slate-400 hidden sm:inline">{g.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Hair Style Section */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">
                2. Cybernetic Hairstyle
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {HAIR_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setConfig((prev) => ({ ...prev, hairStyle: style.id }));
                    }}
                    className={`py-2 px-2 rounded-xl text-center text-[11px] font-bold transition-all border ${
                      config.hairStyle === style.id
                        ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                        : 'border-indigo-950 bg-[#120c2e] text-slate-400 hover:text-white hover:border-indigo-800'
                    }`}
                  >
                    {style.iconText}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Hair Color Section */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">
                3. Hair Pigment
              </label>
              <div className="flex flex-wrap gap-2">
                {HAIR_COLORS.map((h) => (
                  <button
                    key={h.color}
                    type="button"
                    title={h.label}
                    onClick={() => {
                      sound.playClick();
                      setConfig((prev) => ({ ...prev, hairColor: h.color }));
                    }}
                    style={{ backgroundColor: h.color }}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-transform ${
                      config.hairColor === h.color
                        ? 'border-cyan-400 scale-110 shadow-[0_0_10px_rgba(0,240,255,0.6)] ring-2 ring-cyan-400/40'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                  >
                    {config.hairColor === h.color && (
                      <Check className="w-4 h-4 text-white drop-shadow stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Skin Tone Section */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">
                4. Synthetic Dermis (Skin Tone)
              </label>
              <div className="flex flex-wrap gap-2">
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.color}
                    type="button"
                    title={s.label}
                    onClick={() => {
                      sound.playClick();
                      setConfig((prev) => ({ ...prev, skinColor: s.color }));
                    }}
                    style={{ backgroundColor: s.color }}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-transform ${
                      config.skinColor === s.color
                        ? 'border-cyan-400 scale-110 shadow-[0_0_10px_rgba(0,240,255,0.6)] ring-2 ring-cyan-400/40'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                  >
                    {config.skinColor === s.color && (
                      <Check className="w-4 h-4 text-slate-950 drop-shadow stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Armor / Chassis Color Section */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">
                5. Combat Chassis Armor Tint
              </label>
              <div className="flex flex-wrap gap-2">
                {SHIRT_COLORS.map((sh) => (
                  <button
                    key={sh.color}
                    type="button"
                    title={sh.label}
                    onClick={() => {
                      sound.playClick();
                      setConfig((prev) => ({ ...prev, shirtColor: sh.color }));
                    }}
                    style={{ backgroundColor: sh.color }}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition-transform ${
                      config.shirtColor === sh.color
                        ? 'border-purple-400 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.6)] ring-2 ring-purple-400/40'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                  >
                    {config.shirtColor === sh.color && (
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Aura Selection */}
            <div>
              <label className="block text-[11px] font-black text-slate-300 mb-1.5 uppercase tracking-wider">
                6. Biometric Aura Glow
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AURA_GLOWS.map((aura, idx) => (
                  <button
                    key={aura.label}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedAuraIndex(idx);
                      setConfig((prev) => ({ ...prev, bgGradient: aura.bg }));
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-[11px] font-bold ${
                      selectedAuraIndex === idx
                        ? `${aura.border} bg-gradient-to-r ${aura.bg} text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]`
                        : 'border-indigo-950 bg-[#120c2e] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{aura.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer / Save Action */}
          <div className="pt-3 border-t border-indigo-950 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-indigo-900 bg-[#120c2e] text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 py-2.5 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Inscribe Avatar Matrix</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
