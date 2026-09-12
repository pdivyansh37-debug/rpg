'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Shield,
  Zap,
  Sparkles,
  Heart,
  Flame,
  Clock,
  Swords,
  Award,
  Crown,
  Gift,
  Plus,
  Trash2,
  Check,
  Tag,
  ShoppingBag,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { ExchangeRewardItem, ActiveBuffs } from '@/types/game';
import { sound } from '@/lib/sound';

interface RewardsVaultViewProps {
  userGold: number;
  userShards: number;
  heroHp: number;
  heroMaxHp: number;
  activeBuffs: ActiveBuffs;
  onPurchaseReward: (item: ExchangeRewardItem) => void;
  onEquipGear?: (item: ExchangeRewardItem) => void;
  onAddCustomReward?: (title: string, cost: number, icon: string) => void;
  onDeleteCustomReward?: (id: string) => void;
}

const DEFAULT_EXCHANGE_REWARDS: ExchangeRewardItem[] = [
  // 1. Equipment & Gear
  {
    id: 'eq-1',
    title: 'Plasma Edge Katana',
    description: 'High-frequency ion blade that sharpens cognitive strike precision.',
    cost: 350,
    category: 'EQUIPMENT',
    slot: 'WEAPON',
    rarity: 'EPIC',
    statBonus: '+15% Intellect & +10% XP',
    icon: '⚔️',
    isOwned: false,
    isEquipped: false,
  },
  {
    id: 'eq-2',
    title: 'Titanium Kinetic Chassis',
    description: 'Reinforced cybernetic armor plate with built-in biometric dampening.',
    cost: 420,
    category: 'EQUIPMENT',
    slot: 'ARMOR',
    rarity: 'LEGENDARY',
    statBonus: '+120 Max HP & +15% Stamina',
    icon: '🛡️',
    isOwned: false,
    isEquipped: false,
  },
  {
    id: 'eq-3',
    title: 'Chrono-Weave Neural Robes',
    description: 'Lightweight fiber coat woven with synaptic superconductors.',
    cost: 300,
    category: 'EQUIPMENT',
    slot: 'ROBE',
    rarity: 'RARE',
    statBonus: '+18% Agility & Flow State',
    icon: '🥋',
    isOwned: false,
    isEquipped: false,
  },
  {
    id: 'eq-4',
    title: 'Aegis Deflector Shield',
    description: 'Hard-light energy buckler that deflects procrastination impulses.',
    cost: 380,
    category: 'EQUIPMENT',
    slot: 'SHIELD',
    rarity: 'EPIC',
    statBonus: '+15% Damage Reduction on Slip',
    icon: '🔰',
    isOwned: false,
    isEquipped: false,
  },

  // 2. Consumables & Potions
  {
    id: 'con-1',
    title: 'Streak Freeze Shield',
    description: 'Automated chronal stasis. Protects your daily ritual streak if a day is missed.',
    cost: 150,
    category: 'POTION',
    slot: 'POTION',
    rarity: 'RARE',
    statBonus: 'Preserves 1 Missed Day Streak',
    icon: '❄️',
    effectType: 'STREAK_SHIELD',
  },
  {
    id: 'con-2',
    title: '24-Hour Overclock XP Booster',
    description: 'Double XP (+100%) multiplier applied to all completed habits and quests for 24 hours.',
    cost: 200,
    category: 'POTION',
    slot: 'POTION',
    rarity: 'EPIC',
    statBonus: '2x XP Multiplier for 24h',
    icon: '⚡',
    effectType: 'XP_BOOSTER',
  },
  {
    id: 'con-3',
    title: 'Nanite Full Health Refill',
    description: 'Instant bio-restoration protocol. Restores full HP lost from uncompleted habits or bad vices.',
    cost: 90,
    category: 'POTION',
    slot: 'POTION',
    rarity: 'COMMON',
    statBonus: 'Instantly Restores 100% HP',
    icon: '🧪',
    effectType: 'HEAL',
  },

  // 3. Meta & Social Perks
  {
    id: 'meta-1',
    title: 'Syndicate Raid Scroll: Cyber Behemoth',
    description: 'Ancient holographic scroll that summons an epic co-op team boss in the Syndicate Hub.',
    cost: 250,
    category: 'META_PERK',
    slot: 'META',
    rarity: 'EPIC',
    statBonus: 'Unlocks Co-op Guild Raid & 500 XP Pool',
    icon: '📜',
    effectType: 'GUILD_SCROLL',
  },
  {
    id: 'meta-2',
    title: 'Glitch Flame Leaderboard Flare',
    description: 'Pulsing animated holographic border that highlights your operator handle on the global board.',
    cost: 300,
    category: 'META_PERK',
    slot: 'META',
    rarity: 'LEGENDARY',
    statBonus: 'Neon Glitch Frame on High Scores',
    icon: '🔥',
    effectType: 'LEADERBOARD_FLARE',
  },
  {
    id: 'meta-3',
    title: 'Solar Gold Operator Flare',
    description: 'Golden radiant aura frame for your rank on the syndicate leaderboard.',
    cost: 280,
    category: 'META_PERK',
    slot: 'META',
    rarity: 'EPIC',
    statBonus: 'Golden Hologram Border on Leaderboard',
    icon: '✨',
    effectType: 'LEADERBOARD_FLARE',
  },
  {
    id: 'meta-4',
    title: 'Operator Gifting Bundle (Tip & Badge)',
    description: 'Package containing 50 Gold credits and an Honor Commendation badge to gift a guildmate.',
    cost: 100,
    category: 'META_PERK',
    slot: 'META',
    rarity: 'RARE',
    statBonus: 'Send Tip + Honor Badge to a Friend',
    icon: '🎁',
    effectType: 'GIFT_TIP',
  },

  // 4. Custom Real-Life Rewards
  {
    id: 'custom-1',
    title: '1 Hour Immersive Video Games',
    description: 'Guilt-free relaxation gaming session funded by today productive deep work.',
    cost: 120,
    category: 'CUSTOM',
    slot: 'CUSTOM',
    rarity: 'COMMON',
    statBonus: 'Real-Life Reward / Dopamine Surge',
    icon: '🎮',
    effectType: 'CUSTOM',
  },
  {
    id: 'custom-2',
    title: 'Artisan Espresso / Cafe Treat',
    description: 'Specialty coffee drink or snack enjoyed as a high-performance milestone reward.',
    cost: 80,
    category: 'CUSTOM',
    slot: 'CUSTOM',
    rarity: 'COMMON',
    statBonus: 'Real-Life Reward / Taste Boost',
    icon: '☕',
    effectType: 'CUSTOM',
  },
];

export const RewardsVaultView: React.FC<RewardsVaultViewProps> = ({
  userGold,
  userShards,
  heroHp,
  heroMaxHp,
  activeBuffs,
  onPurchaseReward,
  onEquipGear,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'ALL' | 'EQUIPMENT' | 'POTION' | 'META_PERK' | 'CUSTOM'
  >('ALL');

  const [rewardsList, setRewardsList] = useState<ExchangeRewardItem[]>(DEFAULT_EXCHANGE_REWARDS);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCost, setCustomCost] = useState('100');
  const [customIcon, setCustomIcon] = useState('🎁');

  const filteredRewards =
    activeCategory === 'ALL'
      ? rewardsList
      : rewardsList.filter((r) => r.category === activeCategory);

  const handleBuy = (item: ExchangeRewardItem) => {
    if (userGold < item.cost) {
      sound.playDamage();
      return;
    }

    sound.playBuy();
    onPurchaseReward(item);

    // If equipment, mark as owned
    if (item.category === 'EQUIPMENT') {
      setRewardsList((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, isOwned: true, isEquipped: true } : r))
      );
    }
  };

  const handleCreateCustomReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newReward: ExchangeRewardItem = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      description: 'Personal custom real-life milestone incentive.',
      cost: Math.max(10, parseInt(customCost, 10) || 50),
      category: 'CUSTOM',
      slot: 'CUSTOM',
      rarity: 'COMMON',
      statBonus: 'Custom Real-Life Reward',
      icon: customIcon || '🎁',
      effectType: 'CUSTOM',
    };

    setRewardsList((prev) => [newReward, ...prev]);
    sound.playSkillUnlock();
    setCustomTitle('');
    setIsAddCustomOpen(false);
  };

  const handleDeleteReward = (id: string) => {
    sound.playClick();
    setRewardsList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4 font-mono text-slate-100">
      {/* Top Breadcrumb & Currency Readout */}
      <div className="flex items-center justify-between px-1 text-[10px] font-bold">
        <span className="text-cyan-400">[ REWARDS VAULT & EXCHANGE ]</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-amber-300 font-black">
            <span>🪙 {userGold.toLocaleString()} GOLD</span>
          </div>
          {activeBuffs.streakShields > 0 && (
            <div className="flex items-center gap-1 text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-400 px-1.5 py-0.5 rounded">
              <span>❄️ {activeBuffs.streakShields} SHIELD</span>
            </div>
          )}
          {activeBuffs.xpBoosterActive && (
            <div className="flex items-center gap-1 text-purple-300 font-bold bg-purple-950/80 border border-purple-400 px-1.5 py-0.5 rounded animate-pulse">
              <span>⚡ 2x XP</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Exchange Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-gradient-to-r from-[#1b120c] via-[#1c102a] to-[#0c081e] p-5 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-400 bg-amber-950/80 px-2 py-0.5 text-[10px] font-black text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>COIN EXCHANGE MARKET</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Trade Quest Gold for Real Value
            </h2>
            <p className="text-xs text-slate-300 font-sans max-w-sm">
              Upgrade gear stats, buy streak protection, trigger 2x XP overdrive, unlock team scrolls, or fund real-life rewards!
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsAddCustomOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-black text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Custom Reward</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-indigo-950 bg-[#070514] p-1.5 text-xs font-bold">
        {[
          { key: 'ALL', label: 'All Items', icon: '🌐' },
          { key: 'EQUIPMENT', label: '⚔️ Equipment & Gear', icon: '⚔️' },
          { key: 'POTION', label: '🧪 Potions & Shields', icon: '🧪' },
          { key: 'META_PERK', label: '🌟 Meta & Social', icon: '🌟' },
          { key: 'CUSTOM', label: '🎁 Custom Rewards', icon: '🎁' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveCategory(tab.key as any);
            }}
            className={`flex-1 min-w-[90px] py-2 px-2 rounded-xl text-center transition-all ${
              activeCategory === tab.key
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Custom Reward Modal Form */}
      <AnimatePresence>
        {isAddCustomOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border-2 border-cyan-400/80 bg-[#120c2e] p-4 text-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-indigo-900">
              <span className="font-black text-cyan-300">// CREATE CUSTOM REAL-LIFE REWARD</span>
              <button
                type="button"
                onClick={() => setIsAddCustomOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomReward} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Reward Name / Activity
                  </label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Watch 1 Episode of Anime, Coffee Date, Buy Book"
                    className="w-full rounded-xl border border-indigo-900 bg-[#0d0722] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Cost in Gold (🪙)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    required
                    value={customCost}
                    onChange={(e) => setCustomCost(e.target.value)}
                    className="w-full rounded-xl border border-indigo-900 bg-[#0d0722] px-3 py-2 text-xs text-amber-300 font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Icon:</span>
                  {['🎮', '☕', '🎬', '🍕', '📚', '🏖️', '🎁'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCustomIcon(ic)}
                      className={`h-7 w-7 rounded-lg text-sm transition-transform ${
                        customIcon === ic ? 'bg-cyan-500 text-slate-950 scale-110 font-bold' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 font-black text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-sm"
                >
                  Save Reward
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredRewards.map((item) => {
          const canAfford = userGold >= item.cost;
          const isEquippable = item.category === 'EQUIPMENT';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                item.rarity === 'LEGENDARY'
                  ? 'border-amber-500/60 bg-gradient-to-b from-[#1c120c] to-[#0a0718] shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : item.rarity === 'EPIC'
                  ? 'border-purple-500/60 bg-gradient-to-b from-[#180e28] to-[#090616] shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'border-cyan-500/40 bg-gradient-to-b from-[#0f142b] to-[#080918] shadow-[0_0_15px_rgba(0,240,255,0.1)]'
              }`}
            >
              {/* Top Row: Icon, Title, Category Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-xl shadow-inner">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                            item.rarity === 'LEGENDARY'
                              ? 'border-amber-400 text-amber-300 bg-amber-950/60'
                              : item.rarity === 'EPIC'
                              ? 'border-purple-400 text-purple-300 bg-purple-950/60'
                              : 'border-cyan-400 text-cyan-300 bg-cyan-950/60'
                          }`}
                        >
                          {item.slot || item.category}
                        </span>
                        {item.category === 'CUSTOM' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReward(item.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5"
                            title="Delete custom reward"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-white tracking-tight mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="flex items-center gap-1 rounded-xl border border-amber-500/60 bg-amber-950/70 px-2.5 py-1 text-xs font-black text-amber-300 shadow-sm shrink-0">
                    <span>🪙</span>
                    <span>{item.cost}</span>
                  </div>
                </div>

                {/* Description & Stat Bonus */}
                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                  {item.description}
                </p>

                {item.statBonus && (
                  <div className="mb-3 flex items-center gap-1.5 rounded-xl border border-indigo-900/80 bg-[#120b2e] px-2.5 py-1.5 text-[11px] font-bold text-cyan-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{item.statBonus}</span>
                  </div>
                )}
              </div>

              {/* Action Button: Purchase / Redeem / Equip */}
              <div className="pt-2 border-t border-white/10">
                {isEquippable && item.isOwned ? (
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-900/60 border border-emerald-400 py-2 text-xs font-black text-emerald-200"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{item.isEquipped ? 'EQUIPPED // ACTIVE' : 'PURCHASED'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all shadow-md ${
                      canAfford
                        ? item.category === 'CUSTOM'
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
                        : 'border border-slate-800 bg-[#100b28] text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <span>
                          {item.category === 'CUSTOM'
                            ? 'Claim Reward'
                            : item.category === 'EQUIPMENT'
                            ? 'Buy & Equip'
                            : 'Exchange & Activate'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-slate-600" />
                        <span>Need {item.cost - userGold} more Gold</span>
                      </>
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
