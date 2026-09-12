'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroHud } from '@/components/hero-hud';
import { QuestsHubView } from '@/components/quests-hub-view';
import { CharacterMatrixView } from '@/components/character-matrix-view';
import { ArmoryBazaarView } from '@/components/armory-bazaar-view';
import { WorldBossView } from '@/components/world-boss-view';
import { CyberBottomNav, MainTabType } from '@/components/cyber-bottom-nav';
import { CreateQuestModal } from '@/components/create-quest-modal';
import { CyberQuest } from '@/components/quest-card';
import { HeroState } from '@/types/game';
import { sound } from '@/lib/sound';
import {
  fetchHeroFromDb,
  saveHeroToDb,
  fetchQuestsFromDb,
  insertQuestToDb,
  toggleQuestInDb,
  claimAllQuestsInDb,
} from '@/lib/supabase-service';
import { Shield } from 'lucide-react';

const INITIAL_HERO: HeroState = {
  id: 'user-1',
  username: 'Nexus Operator',
  classTitle: 'CHRONO-KNIGHT',
  specialization: 'Cyber-Focus Kinetic Synthesis',
  level: 14,
  hp: 780,
  maxHp: 800,
  xp: 3850,
  nextLevelXp: 4000,
  totalXp: 18450,
  gold: 1420,
  cyberShards: 48,
  streakCount: 7,
  unspentSkillPoints: 2,
  radar: {
    str: 14,
    int: 18,
    sta: 14,
    agi: 11,
    syn: 16,
    void: 12,
  },
  vitalityBonus: 12.8,
  surgeBonus: 18.0,
  strikeLatency: 35,
  isOverclocked: false,
};

const INITIAL_QUESTS: CyberQuest[] = [
  {
    id: 'quest-1',
    title: 'Morning Deep Work: 90m Code Session',
    description: 'Execute focused algorithm design & full-stack matrix integration.',
    difficulty: 'HARD',
    attributeType: 'INTELLECT',
    xpReward: 150,
    goldReward: 60,
    streakBonus: 6,
    completed: false,
    timeString: '11:30 AM',
    protocolType: '[ BOSS GATE // INTELLECT ]',
    metaBadge: 'BOSS GATE',
    isBoss: true,
  },
  {
    id: 'quest-2',
    title: 'Iron Temple: Heavy Squat & Pullups',
    description: 'Boost core power output and forge physical fortitude.',
    difficulty: 'MEDIUM',
    attributeType: 'STRENGTH',
    xpReward: 75,
    goldReward: 28,
    streakBonus: 3,
    completed: false,
    protocolType: '[ RITUAL // STRENGTH ]',
    metaBadge: 'Ready to Claim',
    isBoss: false,
  },
  {
    id: 'quest-3',
    title: 'Hydration Overdrive & 5k Velocity Run',
    description: 'Log 2.5L clean hydration and complete endurance cardio trial.',
    difficulty: 'EASY',
    attributeType: 'STAMINA',
    xpReward: 35,
    goldReward: 18,
    streakBonus: 2,
    completed: false,
    timeString: 'Daily Cycle',
    protocolType: '[ RITUAL // STAMINA ]',
    metaBadge: 'Daily Cycle',
    isBoss: false,
  },
  {
    id: 'quest-4',
    title: 'Citadel Sweep: Inbox Zero & Code Review',
    description: 'Clear system clutter and approve pending pull request merges.',
    difficulty: 'TRIVIAL',
    attributeType: 'AGILITY',
    xpReward: 20,
    goldReward: 12,
    streakBonus: 1,
    completed: false,
    protocolType: '[ PROTOCOL // AGILITY ]',
    metaBadge: '3 Sets',
    isBoss: false,
  },
];

export default function MasterHeroQuestApp() {
  const [hero, setHero] = useState<HeroState>(INITIAL_HERO);
  const [quests, setQuests] = useState<CyberQuest[]>(INITIAL_QUESTS);
  const [activeTab, setActiveTab] = useState<MainTabType>('QUESTS');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Sync state from Supabase on mount if configured
  useEffect(() => {
    async function loadData() {
      const [dbHero, dbQuests] = await Promise.all([
        fetchHeroFromDb(),
        fetchQuestsFromDb(),
      ]);

      if (dbHero) setHero(dbHero);
      if (dbQuests && dbQuests.length > 0) setQuests(dbQuests);
    }
    loadData();
  }, []);

  // Sync hero state changes to Supabase
  useEffect(() => {
    saveHeroToDb(hero);
  }, [hero.level, hero.xp, hero.gold, hero.streakCount, hero.unspentSkillPoints, hero.radar]);

  // Toggle single quest completion status
  const handleToggleStatus = (id: string, completed: boolean) => {
    toggleQuestInDb(id, completed);
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        const updated = { ...q, completed };

        if (completed) {
          const multiplier = hero.isOverclocked ? 2 : 1;
          const streakMultiplier = 1.1;
          const earnedXp = q.xpReward * multiplier;
          const earnedGold = Math.round((q.goldReward + (q.streakBonus || 0)) * streakMultiplier);

          setHero((h) => {
            const newTotalXp = h.totalXp + earnedXp;
            let newCurrentXp = h.xp + earnedXp;
            let newLevel = h.level;
            let newNextXp = h.nextLevelXp;
            let newHp = Math.min(h.maxHp, h.hp + 15);
            let newSkillPoints = h.unspentSkillPoints;

            if (newCurrentXp >= newNextXp) {
              newLevel += 1;
              newSkillPoints += 1;
              newCurrentXp = newCurrentXp - newNextXp;
              newNextXp = Math.round(newNextXp * 1.25);
              newHp = h.maxHp;
            }

            return {
              ...h,
              level: newLevel,
              xp: newCurrentXp,
              nextLevelXp: newNextXp,
              totalXp: newTotalXp,
              gold: h.gold + earnedGold,
              hp: newHp,
              unspentSkillPoints: newSkillPoints,
            };
          });
        }

        return updated;
      })
    );
  };

  // Claim all ready quests
  const handleClaimAll = () => {
    sound.playClaimAll();
    claimAllQuestsInDb();
    const pendingQuests = quests.filter((q) => !q.completed);
    if (pendingQuests.length === 0) return;

    let totalEarnedXp = 0;
    let totalEarnedGold = 0;

    pendingQuests.forEach((q) => {
      totalEarnedXp += q.xpReward;
      totalEarnedGold += q.goldReward + (q.streakBonus || 0);
    });

    setQuests((prev) => prev.map((q) => ({ ...q, completed: true })));

    setHero((h) => {
      let newCurrentXp = h.xp + totalEarnedXp;
      let newLevel = h.level;
      let newNextXp = h.nextLevelXp;
      let newSkillPoints = h.unspentSkillPoints;

      if (newCurrentXp >= newNextXp) {
        newLevel += 1;
        newSkillPoints += 1;
        newCurrentXp = newCurrentXp - newNextXp;
        newNextXp = Math.round(newNextXp * 1.25);
      }

      return {
        ...h,
        level: newLevel,
        xp: newCurrentXp,
        nextLevelXp: newNextXp,
        totalXp: h.totalXp + totalEarnedXp,
        gold: h.gold + totalEarnedGold,
        hp: h.maxHp,
        unspentSkillPoints: newSkillPoints,
      };
    });
  };

  // Spend skill point helper
  const handleSpendSkillPoint = () => {
    if (hero.unspentSkillPoints <= 0) return;
    setHero((h) => ({
      ...h,
      unspentSkillPoints: Math.max(0, h.unspentSkillPoints - 1),
      vitalityBonus: +(h.vitalityBonus + 0.8).toFixed(1),
      surgeBonus: +(h.surgeBonus + 1.2).toFixed(1),
      strikeLatency: Math.max(15, h.strikeLatency - 2),
      radar: {
        ...h.radar,
        int: h.radar.int + 1,
        syn: h.radar.syn + 1,
      },
    }));
  };

  // Purchase item helper
  const handlePurchaseItem = (cost: number) => {
    setHero((h) => ({
      ...h,
      gold: Math.max(0, h.gold - cost),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070712] text-slate-900 dark:text-slate-100 font-sans pb-24 selection:bg-cyan-400 selection:text-slate-950 transition-colors duration-200">
      {/* Top Cyber Window Bar */}
      <div className="border-b border-slate-200 dark:border-indigo-950/60 bg-white/80 dark:bg-[#06060f] px-4 py-1 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400 tracking-wider">
        HeroQuest: Cyber-RPG Mastery Engine // v2.4
      </div>

      {/* Top RPG HUD Bar */}
      <HeroHud
        hero={{
          username: hero.username,
          level: hero.level,
          currentXp: hero.xp,
          nextLevelXp: hero.nextLevelXp,
          totalXp: hero.totalXp,
          gold: hero.gold,
          streakCount: hero.streakCount,
        }}
        onProfileClick={() => setShowProfileDrawer(true)}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-xl px-3 sm:px-4 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'QUESTS' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <QuestsHubView
                hero={hero}
                quests={quests}
                onToggleStatus={handleToggleStatus}
                onOpenCreateQuest={() => setIsCreateOpen(true)}
                onToggleOverclock={() =>
                  setHero((h) => ({ ...h, isOverclocked: !h.isOverclocked }))
                }
                onClaimAll={handleClaimAll}
              />
            </motion.div>
          )}

          {activeTab === 'ATTRIBUTES' && (
            <motion.div
              key="attributes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <CharacterMatrixView
                hero={hero}
                onSpendSkillPoint={handleSpendSkillPoint}
              />
            </motion.div>
          )}

          {activeTab === 'ARMORY' && (
            <motion.div
              key="armory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ArmoryBazaarView
                userGold={hero.gold}
                userShards={hero.cyberShards}
                onPurchaseItem={handlePurchaseItem}
              />
            </motion.div>
          )}

          {activeTab === 'BOSS' && (
            <motion.div
              key="boss"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <WorldBossView
                onBossDamageDealt={(dmg) => {
                  setHero((h) => ({
                    ...h,
                    xp: h.xp + Math.round(dmg * 0.05),
                    gold: h.gold + Math.round(dmg * 0.02),
                  }));
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cyberpunk 4-Tab Bottom Navigation Bar */}
      <CyberBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCreateQuest={() => setIsCreateOpen(true)}
      />

      {/* Inscribe Quest Modal */}
      <CreateQuestModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onQuestCreated={async (newQuest) => {
          setQuests((prev) => [newQuest, ...prev]);
          const dbId = await insertQuestToDb(newQuest);
          if (dbId) {
            setQuests((prev) =>
              prev.map((q) => (q.id === newQuest.id ? { ...q, id: dbId } : q))
            );
          }
        }}
      />

      {/* Hero Profile Modal */}
      <AnimatePresence>
        {showProfileDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-cyan-400 bg-[#0d091e] p-6 shadow-[0_0_35px_rgba(0,240,255,0.3)] text-slate-100 font-mono"
            >
              <div className="flex items-center justify-between pb-3 border-b border-indigo-950">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black text-white">HERO PROFILE MATRIX</h3>
                </div>
                <button
                  onClick={() => setShowProfileDrawer(false)}
                  className="rounded-lg bg-slate-900 border border-slate-800 p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
                  <span className="text-slate-400">Class & Specialization:</span>
                  <span className="text-cyan-300 font-bold">LVL {hero.level} CHRONO-KNIGHT</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
                  <span className="text-slate-400">Total Lifetime EXP:</span>
                  <span className="text-pink-300 font-bold">{hero.totalXp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
                  <span className="text-slate-400">Radiant Streak:</span>
                  <span className="text-rose-400 font-bold">{hero.streakCount} Days Active</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
                  <span className="text-slate-400">Cyber Gold Stash:</span>
                  <span className="text-amber-300 font-bold">{hero.gold.toLocaleString()} G</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
                  <span className="text-slate-400">Cyber Shards:</span>
                  <span className="text-cyan-300 font-bold">{hero.cyberShards} Shards</span>
                </div>
              </div>

              <button
                onClick={() => setShowProfileDrawer(false)}
                className="mt-5 w-full rounded-xl bg-cyan-500 py-2.5 font-bold text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              >
                RETURN TO MATRIX
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
