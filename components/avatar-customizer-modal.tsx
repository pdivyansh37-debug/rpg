'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles } from 'lucide-react';
import { PixelAvatar } from './pixel-avatar';
import { AvatarConfig } from '@/types/game';
import { sound } from '@/lib/sound';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: AvatarConfig;
  onSaveConfig: (newConfig: AvatarConfig) => void;
}

const SKIN_TONES = [
  { label: 'Pale', color: '#FCD8B8' },
  { label: 'Fair', color: '#E5B887' },
  { label: 'Tan', color: '#A87A5B' },
  { label: 'Warm', color: '#7E5539' },
  { label: 'Deep', color: '#4D301E' },
];

const HAIR_COLORS = [
  { label: 'Black', color: '#221E1F' },
  { label: 'Brown', color: '#5A3825' },
  { label: 'Blonde', color: '#F7D070' },
  { label: 'Red', color: '#B33C1B' },
  { label: 'Silver', color: '#C0C0D0' },
  { label: 'Purple', color: '#8A5BEF' },
];

const HAIR_STYLES: { id: AvatarConfig['hairStyle']; label: string }[] = [
  { id: 'afro', label: 'Afro Curls' },
  { id: 'short', label: 'Short' },
  { id: 'spiky', label: 'Spiky' },
  { id: 'long', label: 'Long' },
];

const SHIRT_COLORS = [
  { label: 'Charcoal', color: '#4A464D' },
  { label: 'Purple', color: '#7C4DFF' },
  { label: 'Blue', color: '#2196F3' },
  { label: 'Red', color: '#E91E63' },
  { label: 'Emerald', color: '#10B981' },
  { label: 'Gold', color: '#F59E0B' },
];

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig,
}) => {
  const [config, setConfig] = useState<AvatarConfig>(currentConfig);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playTaskComplete();
    onSaveConfig(config);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl p-5 text-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Customize Character Avatar
            </h2>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Preview Box */}
          <div className="my-4 flex flex-col items-center justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#9E8EF0] shadow-md">
              <PixelAvatar config={config} size={84} />
            </div>
            <span className="mt-1.5 text-xs font-semibold text-slate-500">8-Bit Pixel Character</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Hair Style */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Hair Style</label>
              <div className="grid grid-cols-4 gap-1.5">
                {HAIR_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setConfig((prev) => ({ ...prev, hairStyle: style.id }));
                    }}
                    className={`py-1.5 rounded-xl text-center font-bold transition-all ${
                      config.hairStyle === style.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Hair Color</label>
              <div className="flex gap-2">
                {HAIR_COLORS.map((h) => (
                  <button
                    key={h.color}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setConfig((prev) => ({ ...prev, hairColor: h.color }));
                    }}
                    style={{ backgroundColor: h.color }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform ${
                      config.hairColor === h.color
                        ? 'border-purple-600 scale-110 shadow-sm'
                        : 'border-white hover:scale-105'
                    }`}
                  >
                    {config.hairColor === h.color && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Skin Tone</label>
              <div className="flex gap-2">
                {SKIN_TONES.map((s) => (
                  <button
                    key={s.color}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setConfig((prev) => ({ ...prev, skinColor: s.color }));
                    }}
                    style={{ backgroundColor: s.color }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform ${
                      config.skinColor === s.color
                        ? 'border-purple-600 scale-110 shadow-sm'
                        : 'border-white hover:scale-105'
                    }`}
                  >
                    {config.skinColor === s.color && <Check className="w-4 h-4 text-slate-800 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Shirt Color */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Tunic / Shirt Color</label>
              <div className="flex gap-2">
                {SHIRT_COLORS.map((shirt) => (
                  <button
                    key={shirt.color}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setConfig((prev) => ({ ...prev, shirtColor: shirt.color }));
                    }}
                    style={{ backgroundColor: shirt.color }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform ${
                      config.shirtColor === shirt.color
                        ? 'border-purple-600 scale-110 shadow-sm'
                        : 'border-white hover:scale-105'
                    }`}
                  >
                    {config.shirtColor === shirt.color && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#7C4DFF] py-3 text-sm font-bold text-white shadow-md hover:bg-[#6D3DF0] active:scale-[0.99] transition-transform"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Avatar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
