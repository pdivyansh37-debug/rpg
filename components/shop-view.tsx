'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { buyShopItem } from '@/actions/shop-actions';
import { sound } from '@/lib/sound';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'AVATAR_COSMETIC' | 'PROFILE_BADGE' | 'CUSTOM_THEME' | 'TITLE';
  rarity: string;
  isOwned: boolean;
  isEquipped?: boolean;
}

interface ShopViewProps {
  items: ShopItem[];
  userGold: number;
}

const RARITY_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  COMMON: { border: 'border-slate-700', bg: 'bg-slate-900/60', text: 'text-slate-300' },
  RARE: { border: 'border-sky-500/70', bg: 'bg-sky-950/40', text: 'text-sky-300' },
  EPIC: { border: 'border-purple-500/80', bg: 'bg-purple-950/40', text: 'text-purple-300' },
  LEGENDARY: {
    border: 'border-amber-400',
    bg: 'bg-amber-950/50',
    text: 'text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
  },
};

export const ShopView: React.FC<ShopViewProps> = ({ items, userGold }) => {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [gold, setGold] = useState(userGold);
  const [ownedMap, setOwnedMap] = useState<Record<string, boolean>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: item.isOwned }), {})
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredItems = items.filter((item) =>
    selectedType === 'ALL' ? true : item.type === selectedType
  );

  const handlePurchase = (item: ShopItem) => {
    if (gold < item.cost || isPending) return;

    setErrorMsg(null);
    startTransition(async () => {
      const res = await buyShopItem(item.id);

      if (res.success) {
        sound.playCoin();
        setGold(res.data.newGold);
        setOwnedMap((prev) => ({ ...prev, [item.id]: true }));
      } else {
        setErrorMsg(res.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Shop Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                Bazaar of Arcana
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">Vanity & Reward Shop</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Spend your quest bounty on rare titles, themes, and badges.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-amber-600/60 bg-amber-950/80 px-4 py-2 text-sm font-mono font-black text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Coins className="h-5 w-5 text-amber-400" />
            <span>{gold.toLocaleString()} G</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-800 bg-rose-950/80 p-2.5 text-xs text-rose-300">
            <ShieldAlert className="w-4 h-4" />
            {errorMsg}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {['ALL', 'TITLE', 'CUSTOM_THEME', 'PROFILE_BADGE', 'AVATAR_COSMETIC'].map(
          (t) => (
            <button
              key={t}
              onClick={() => {
                sound.playClick();
                setSelectedType(t);
              }}
              className={`rounded-xl border px-3 py-1.5 transition-all ${
                selectedType === t
                  ? 'border-amber-400 bg-amber-950/60 font-bold text-amber-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          )
        )}
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isOwned = ownedMap[item.id];
          const canAfford = gold >= item.cost;
          const rarityStyle =
            RARITY_COLORS[item.rarity] || RARITY_COLORS.COMMON;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 p-5 ${rarityStyle.border} ${rarityStyle.bg} backdrop-blur-sm`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded border border-current ${rarityStyle.text}`}
                  >
                    {item.rarity}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    {item.type.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
              </div>

              {/* Purchase / Owned Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono font-bold text-amber-300 text-sm">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{item.cost} G</span>
                </div>

                {isOwned ? (
                  <span className="flex items-center gap-1 rounded-lg bg-emerald-950/70 border border-emerald-700/60 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> OWNED
                  </span>
                ) : (
                  <button
                    disabled={!canAfford || isPending}
                    onClick={() => handlePurchase(item)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-mono text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'PURCHASE'
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
