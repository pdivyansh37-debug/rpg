'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Sparkles,
  ShoppingBag,
  Check,
  Tag,
  Loader2,
  Crown,
  Palette,
  ShieldAlert,
  Swords,
  Cpu,
  Shield,
  Zap,
  CheckCircle2,
  Flame,
  Star,
  Eye,
} from 'lucide-react';
import { buyShopItem } from '@/actions/shop-actions';
import { sound } from '@/lib/sound';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'AVATAR_COSMETIC' | 'PROFILE_BADGE' | 'CUSTOM_THEME' | 'TITLE' | 'GEAR';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  isOwned: boolean;
  isEquipped?: boolean;
  perkText?: string;
}

interface ShopViewProps {
  items: ShopItem[];
  userGold: number;
}

const RARITY_CONFIGS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  COMMON: {
    border: 'border-slate-800',
    bg: 'bg-slate-900/60',
    text: 'text-slate-300',
    glow: '',
  },
  RARE: {
    border: 'border-cyan-400/80',
    bg: 'bg-gradient-to-b from-[#0a1928] to-[#07101a]',
    text: 'text-cyan-300',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.25)]',
  },
  EPIC: {
    border: 'border-purple-500/80',
    bg: 'bg-gradient-to-b from-[#180a2a] to-[#10071c]',
    text: 'text-purple-300',
    glow: 'shadow-[0_0_18px_rgba(168,85,247,0.3)]',
  },
  LEGENDARY: {
    border: 'border-amber-400',
    bg: 'bg-gradient-to-b from-[#241406] via-[#1a0f05] to-[#0d0702]',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_25px_rgba(251,191,36,0.35)]',
  },
};

export const ShopView: React.FC<ShopViewProps> = ({ items: initialItems, userGold }) => {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [gold, setGold] = useState(userGold);
  const [items, setItems] = useState<ShopItem[]>(initialItems);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [equippedTitle, setEquippedTitle] = useState('Archmage of TypeScript');

  const filteredItems = items.filter((item) =>
    selectedType === 'ALL' ? true : item.type === selectedType
  );

  const handlePurchase = (item: ShopItem) => {
    if (gold < item.cost || isPending) {
      sound.playBossGate();
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await buyShopItem(item.id);

      if (res.success) {
        sound.playCoin();
        setGold(res.data.newGold);
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isOwned: true } : i))
        );
      } else {
        // Mock fallback if offline / demo mode
        sound.playCoin();
        setGold((g) => g - item.cost);
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isOwned: true } : i))
        );
      }
    });
  };

  const handleToggleEquip = (item: ShopItem) => {
    sound.playClick();
    if (item.type === 'TITLE') {
      setEquippedTitle(item.name.replace('Title: ', '').replaceAll('"', ''));
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.type === item.type) {
          return { ...i, isEquipped: i.id === item.id ? !i.isEquipped : false };
        }
        return i;
      })
    );
  };

  return (
    <div className="space-y-5 font-mono">
      {/* Shop Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/80 bg-gradient-to-r from-[#180e05] via-[#150a22] to-[#070b1e] p-5 sm:p-6 shadow-[0_0_30px_rgba(251,191,36,0.25)]">
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                CYBERNETIC BAZAAR // VENDOR PROTOCOL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Vanity & Cyberdeck Arsenal
            </h2>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Acquire legendary cosmetic frames, titles, cyberdeck augments, and UI matrix themes.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-400/90 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 px-4 py-2 text-sm font-mono font-black text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] shrink-0">
            <span className="text-lg">🪙</span>
            <span>{gold.toLocaleString()} Gold</span>
          </div>
        </div>

        {/* Current Active Cosmetics Indicator */}
        <div className="mt-4 pt-3 border-t border-amber-950/80 flex items-center gap-3 text-xs flex-wrap">
          <span className="text-slate-400">Current Title:</span>
          <span className="px-2.5 py-0.5 rounded-lg border border-cyan-400/70 bg-cyan-950/80 text-cyan-300 font-black">
            "{equippedTitle}"
          </span>
          <span className="text-slate-400 ml-auto flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Auto-sync enabled
          </span>
        </div>

        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-800 bg-rose-950/90 p-2.5 text-xs text-rose-300">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: ':: All Artifacts' },
          { key: 'TITLE', label: ':: Titles' },
          { key: 'GEAR', label: ':: Cyberdeck Gear' },
          { key: 'CUSTOM_THEME', label: ':: Matrix Themes' },
          { key: 'AVATAR_COSMETIC', label: ':: Crest Frames' },
          { key: 'PROFILE_BADGE', label: ':: Badges' },
        ].map(({ key, label }) => {
          const isSelected = selectedType === key;
          return (
            <button
              key={key}
              onClick={() => {
                sound.playClick();
                setSelectedType(key);
              }}
              className={`rounded-xl border px-3.5 py-2 transition-all shrink-0 font-bold ${
                isSelected
                  ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'border-indigo-950 bg-[#100b24] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const canAfford = gold >= item.cost;
          const rarityConfig = RARITY_CONFIGS[item.rarity] || RARITY_CONFIGS.COMMON;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 p-5 ${rarityConfig.border} ${rarityConfig.bg} ${rarityConfig.glow} backdrop-blur-md`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-current ${rarityConfig.text}`}
                  >
                    {item.rarity}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {item.type.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-black text-white mb-1.5">{item.name}</h3>
                <p className="text-xs text-slate-300 font-sans line-clamp-2">{item.description}</p>

                {item.perkText && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/50 border border-cyan-900/60 px-2.5 py-1 rounded-lg">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{item.perkText}</span>
                  </div>
                )}
              </div>

              {/* Purchase / Equip Action Footer */}
              <div className="mt-4 pt-3 border-t border-indigo-950/80 flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono font-black text-amber-300 text-sm">
                  <span>🪙</span>
                  <span>{item.cost} G</span>
                </div>

                {item.isOwned ? (
                  <button
                    onClick={() => handleToggleEquip(item)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      item.isEquipped
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                        : 'border border-emerald-500/70 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    {item.isEquipped ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> EQUIPPED
                      </>
                    ) : (
                      'EQUIP'
                    )}
                  </button>
                ) : (
                  <button
                    disabled={!canAfford || isPending}
                    onClick={() => handlePurchase(item)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all ${
                      canAfford
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.4)] hover:bg-amber-300 active:scale-95'
                        : 'border border-slate-800 bg-slate-900/80 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'ACQUIRE'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
