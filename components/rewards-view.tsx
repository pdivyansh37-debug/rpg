'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Heart, ShoppingBag, Plus, Sparkles, Shield, Swords } from 'lucide-react';
import { RewardItem } from '@/types/game';
import { sound } from '@/lib/sound';

interface RewardsViewProps {
  rewards: RewardItem[];
  userGold: number;
  onBuyReward: (reward: RewardItem) => void;
  onAddCustomReward?: () => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  rewards,
  userGold,
  onBuyReward,
  onAddCustomReward,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'CUSTOM' | 'SHOP'>('ALL');

  const filteredRewards = rewards.filter((r) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'CUSTOM') return r.type === 'CUSTOM';
    if (activeCategory === 'SHOP') return r.type !== 'CUSTOM';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="flex justify-between items-center pb-1">
        <div className="flex gap-2 text-xs font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveCategory('ALL');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeCategory === 'ALL'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveCategory('CUSTOM');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeCategory === 'CUSTOM'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            Custom Rewards
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveCategory('SHOP');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeCategory === 'SHOP'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            In-Game Shop
          </button>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onAddCustomReward?.();
          }}
          className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1.5 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Reward</span>
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredRewards.map((reward) => {
          const canAfford = userGold >= reward.cost;

          return (
            <motion.div
              key={reward.id}
              layout
              className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {reward.type === 'POTION' ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 border border-rose-200">
                        <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                      </div>
                    ) : reward.type === 'GEAR' ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                        <Swords className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 tracking-tight leading-snug">
                        {reward.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {reward.type === 'CUSTOM' ? 'Self-Reward' : 'Item'}
                      </span>
                    </div>
                  </div>
                </div>

                {reward.notes && (
                  <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                    {reward.notes}
                  </p>
                )}
              </div>

              {/* Purchase Button */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 font-bold text-slate-800 text-xs">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-[10px] font-black">
                    H
                  </div>
                  <span>{reward.cost} Gold</span>
                </div>

                <button
                  onClick={() => {
                    if (canAfford) {
                      sound.playBuy();
                      onBuyReward(reward);
                    } else {
                      sound.playHabitMinus();
                    }
                  }}
                  disabled={!canAfford}
                  className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    canAfford
                      ? 'bg-amber-400 text-amber-950 shadow-sm hover:bg-amber-300 active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Buy</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
