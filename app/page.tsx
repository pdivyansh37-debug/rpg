'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HeroHud } from '@/components/hero-hud';
import { QuestsHubView, ForgeSubTab } from '@/components/quests-hub-view';
import { CharacterMatrixView } from '@/components/character-matrix-view';
import { RewardsVaultView } from '@/components/rewards-vault-view';
import { SyndicateGuildView } from '@/components/syndicate-guild-view';
import { CyberBottomNav, MainTabType } from '@/components/cyber-bottom-nav';
import { TaskCrudModal, TaskType } from '@/components/task-crud-modal';
import { AuthModal } from '@/components/auth-modal';
import { HeroFaintModal } from '@/components/hero-faint-modal';
import { LootCrateModal, LootReward } from '@/components/loot-crate-modal';
import { FloatingCombatText, CombatTextEvent } from '@/components/floating-combat-text';
import { LevelUpModal } from '@/components/level-up-modal';
import { AvatarCustomizerModal } from '@/components/avatar-customizer-modal';
import { DEFAULT_AVATAR } from '@/components/pixel-avatar';
import { CyberQuest } from '@/components/quest-card';
import {
  HeroState,
  HabitItem,
  DailyItem,
  TodoItem,
  StartingObjective,
  ExchangeRewardItem,
  ActiveBuffs,
} from '@/types/game';
import { sound } from '@/lib/sound';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchHeroFromDb,
  saveHeroToDb,
  fetchQuestsFromDb,
  insertQuestToDb,
  updateQuestInDb,
  deleteQuestInDb,
  toggleQuestInDb,
  claimAllQuestsInDb,
  fetchHabitsFromDb,
  insertHabitToDb,
  updateHabitInDb,
  deleteHabitInDb,
  updateHabitCountInDb,
  fetchDailiesFromDb,
  insertDailyToDb,
  updateDailyInDb,
  deleteDailyInDb,
  toggleDailyInDb,
  fetchTodosFromDb,
  insertTodoToDb,
  updateTodoInDb,
  deleteTodoInDb,
  toggleTodoInDb,
  initUserIfMissing,
} from '@/lib/supabase-service';
import confetti from 'canvas-confetti';

const INITIAL_HERO: HeroState = {
  id: 'user-1',
  username: 'Nexus Operator',
  classTitle: 'CHRONO-KNIGHT',
  specialization: 'Cyber-Focus Kinetic Synthesis',
  level: 1,
  hp: 800,
  maxHp: 800,
  xp: 0,
  nextLevelXp: 100,
  totalXp: 0,
  gold: 0,
  cyberShards: 0,
  streakCount: 0,
  unspentSkillPoints: 0,
  radar: {
    str: 10,
    int: 10,
    sta: 10,
    agi: 10,
    syn: 10,
    void: 10,
  },
  vitalityBonus: 10.0,
  surgeBonus: 10.0,
  strikeLatency: 35,
  isOverclocked: false,
  avatar: DEFAULT_AVATAR,
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

const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'h-1',
    title: '25-Minute Deep Focus Sprint',
    notes: 'No distractions or multitasking. Pure flow state.',
    isPositive: true,
    isNegative: false,
    positiveCount: 0,
    negativeCount: 0,
    difficulty: 'MEDIUM',
    attributeType: 'INTELLECT',
  },
  {
    id: 'h-2',
    title: 'Clean Hydration & Electrolytes',
    notes: 'Drink 500ml water upon waking or working.',
    isPositive: true,
    isNegative: false,
    positiveCount: 0,
    negativeCount: 0,
    difficulty: 'EASY',
    attributeType: 'STAMINA',
  },
  {
    id: 'h-3',
    title: 'Doomscrolling / Mindless Feeds',
    notes: 'Mindless scrolling drains operator focus and damages HP!',
    isPositive: false,
    isNegative: true,
    positiveCount: 0,
    negativeCount: 0,
    difficulty: 'HARD',
    attributeType: 'AGILITY',
  },
  {
    id: 'h-4',
    title: 'Posture Calibration & Stretch',
    notes: 'Stand up, stretch shoulders, calibrate spinal alignment.',
    isPositive: true,
    isNegative: true,
    positiveCount: 0,
    negativeCount: 0,
    difficulty: 'TRIVIAL',
    attributeType: 'STRENGTH',
  },
];

const INITIAL_DAILIES: DailyItem[] = [
  {
    id: 'd-1',
    title: 'Daily Code Commit & Matrix Sync',
    notes: 'Ship at least 1 clean pull request or feature commit.',
    completed: false,
    streak: 0,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    difficulty: 'MEDIUM',
    attributeType: 'INTELLECT',
  },
  {
    id: 'd-2',
    title: 'Physical Calibration Workout',
    notes: 'Strength training, cardio, or mobility routine.',
    completed: false,
    streak: 0,
    daysOfWeek: [1, 2, 3, 4, 5],
    difficulty: 'HARD',
    attributeType: 'STRENGTH',
  },
  {
    id: 'd-3',
    title: 'Evening Reflection & Day Plan',
    notes: 'Review achievements and inscribe tomorrow top 3 objectives.',
    completed: false,
    streak: 0,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    difficulty: 'EASY',
    attributeType: 'STAMINA',
  },
];

const INITIAL_TODOS: TodoItem[] = [
  {
    id: 't-1',
    title: 'Deploy Life RPG Production Release',
    notes: 'Verify responsive build, Supabase integration, and audio synthesis.',
    completed: false,
    dueDate: 'Today',
    difficulty: 'HARD',
    attributeType: 'INTELLECT',
  },
  {
    id: 't-2',
    title: 'Configure Google OAuth Client Credentials',
    notes: 'Add client ID and secret in Supabase dashboard for cross-device sync.',
    completed: false,
    dueDate: 'This Week',
    difficulty: 'MEDIUM',
    attributeType: 'AGILITY',
  },
];

const INITIAL_OBJECTIVES: StartingObjective[] = [
  {
    id: 'obj-1',
    title: 'Record your first positive habit (+)',
    completed: false,
    rewardXp: 50,
    rewardGold: 35,
  },
  {
    id: 'obj-2',
    title: 'Complete a daily ritual or quest',
    completed: false,
    rewardXp: 50,
    rewardGold: 35,
  },
  {
    id: 'obj-3',
    title: 'Equip or purchase gear in the Bazaar',
    completed: false,
    rewardXp: 50,
    rewardGold: 30,
  },
];

export default function MasterHeroQuestApp() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(false);

  const [hero, setHero] = useState<HeroState>(INITIAL_HERO);
  const [quests, setQuests] = useState<CyberQuest[]>(INITIAL_QUESTS);
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [dailies, setDailies] = useState<DailyItem[]>(INITIAL_DAILIES);
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [startingObjectives, setStartingObjectives] =
    useState<StartingObjective[]>(INITIAL_OBJECTIVES);

  const [activeTab, setActiveTab] = useState<MainTabType>('QUESTS');

  // Task CRUD Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalType, setTaskModalType] = useState<TaskType>('QUEST');
  const [editingQuest, setEditingQuest] = useState<CyberQuest | null>(null);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);
  const [editingDaily, setEditingDaily] = useState<DailyItem | null>(null);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  // Modal Open Dispatchers
  const handleOpenCreateTask = (subTab?: ForgeSubTab) => {
    const typeMap: Record<ForgeSubTab, TaskType> = {
      PROTOCOLS: 'QUEST',
      HABITS: 'HABIT',
      DAILIES: 'DAILY',
      TODOS: 'TODO',
    };
    setTaskModalType(subTab ? typeMap[subTab] : 'QUEST');
    setEditingQuest(null);
    setEditingHabit(null);
    setEditingDaily(null);
    setEditingTodo(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditQuest = (quest: CyberQuest) => {
    setTaskModalType('QUEST');
    setEditingQuest(quest);
    setEditingHabit(null);
    setEditingDaily(null);
    setEditingTodo(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditHabit = (habit: HabitItem) => {
    setTaskModalType('HABIT');
    setEditingQuest(null);
    setEditingHabit(habit);
    setEditingDaily(null);
    setEditingTodo(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditDaily = (daily: DailyItem) => {
    setTaskModalType('DAILY');
    setEditingQuest(null);
    setEditingHabit(null);
    setEditingDaily(daily);
    setEditingTodo(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTodo = (todo: TodoItem) => {
    setTaskModalType('TODO');
    setEditingQuest(null);
    setEditingHabit(null);
    setEditingDaily(null);
    setEditingTodo(todo);
    setIsTaskModalOpen(true);
  };

  // Quest CRUD Handlers
  const handleCreateQuest = (newQuest: CyberQuest) => {
    sound.playSkillUnlock();
    insertQuestToDb(newQuest);
    setQuests((prev) => [newQuest, ...prev]);
  };

  const handleUpdateQuest = (updatedQuest: CyberQuest) => {
    sound.playClick();
    updateQuestInDb(updatedQuest);
    setQuests((prev) => prev.map((q) => (q.id === updatedQuest.id ? updatedQuest : q)));
  };

  const handleDeleteQuest = (id: string) => {
    sound.playClick();
    deleteQuestInDb(id);
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  // Habit CRUD Handlers
  const handleCreateHabit = (newHabit: HabitItem) => {
    sound.playSkillUnlock();
    insertHabitToDb(newHabit);
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleUpdateHabit = (updatedHabit: HabitItem) => {
    sound.playClick();
    updateHabitInDb(updatedHabit);
    setHabits((prev) => prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)));
  };

  const handleDeleteHabit = (id: string) => {
    sound.playClick();
    deleteHabitInDb(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Daily CRUD Handlers
  const handleCreateDaily = (newDaily: DailyItem) => {
    sound.playSkillUnlock();
    insertDailyToDb(newDaily);
    setDailies((prev) => [...prev, newDaily]);
  };

  const handleUpdateDaily = (updatedDaily: DailyItem) => {
    sound.playClick();
    updateDailyInDb(updatedDaily);
    setDailies((prev) => prev.map((d) => (d.id === updatedDaily.id ? updatedDaily : d)));
  };

  const handleDeleteDaily = (id: string) => {
    sound.playClick();
    deleteDailyInDb(id);
    setDailies((prev) => prev.filter((d) => d.id !== id));
  };

  // Todo CRUD Handlers
  const handleCreateTodo = (newTodo: TodoItem) => {
    sound.playSkillUnlock();
    insertTodoToDb(newTodo);
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleUpdateTodo = (updatedTodo: TodoItem) => {
    sound.playClick();
    updateTodoInDb(updatedTodo);
    setTodos((prev) => prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const handleDeleteTodo = (id: string) => {
    sound.playClick();
    deleteTodoInDb(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Gamification & Feedback states
  const [comboMultiplier, setComboMultiplier] = useState(1.0);
  const [combatTextEvents, setCombatTextEvents] = useState<CombatTextEvent[]>([]);
  const [isLootModalOpen, setIsLootModalOpen] = useState(false);
  const [isFaintModalOpen, setIsFaintModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAvatarCustomizerOpen, setIsAvatarCustomizerOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState<any>(null);
  const [isHitFlashing, setIsHitFlashing] = useState(false);

  // Active Buffs & Perks state
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuffs>({
    streakShields: 0,
    xpBoosterActive: false,
    xpBoosterExpiresAt: null,
    activeFlare: 'NONE',
  });

  // Authenticated User Session state
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email?: string | null;
    username: string;
    avatarUrl?: string | null;
    isGuest: boolean;
  }>({
    id: 'user-1',
    email: null,
    username: 'Nexus Operator',
    avatarUrl: null,
    isGuest: true,
  });

  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add floating combat text helper
  const addCombatText = (
    x: number,
    y: number,
    text: string,
    type: CombatTextEvent['type']
  ) => {
    const newEvent: CombatTextEvent = {
      id: `${Date.now()}-${Math.random()}`,
      x,
      y,
      text,
      type,
    };
    setCombatTextEvents((prev) => [...prev, newEvent]);

    setTimeout(() => {
      setCombatTextEvents((prev) => prev.filter((e) => e.id !== newEvent.id));
    }, 1200);
  };

  // Roll for random Loot Crate drop (~22% chance)
  const checkLootDrop = (x: number, y: number) => {
    const roll = Math.random();
    if (roll < 0.22) {
      addCombatText(x, y - 30, '🎁 LOOT CRATE DISCOVERED!', 'LOOT');
      setTimeout(() => {
        setIsLootModalOpen(true);
      }, 700);
    }
  };

  // Increase combo multiplier
  const bumpCombo = (x: number, y: number) => {
    const nextCombo = Math.min(2.5, Number((comboMultiplier + 0.2).toFixed(1)));
    setComboMultiplier(nextCombo);
    if (nextCombo > 1.0) {
      addCombatText(x, y - 50, `x${nextCombo.toFixed(1)} COMBO!`, 'COMBO');
      sound.playCombo();
    }

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setComboMultiplier(1.0);
    }, 45000); // 45s combo window
  };

  // Instant non-blocking session hydration in background
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Fast asynchronous session check from local cache
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        setCurrentUser({
          id: user.id,
          email: user.email,
          username:
            user.user_metadata?.username ||
            user.email?.split('@')[0] ||
            'Nexus Operator',
          avatarUrl: user.user_metadata?.avatar_url || null,
          isGuest: false,
        });
        setHero((h) => ({
          ...h,
          username:
            user.user_metadata?.username ||
            user.email?.split('@')[0] ||
            h.username,
        }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          username:
            session.user.user_metadata?.username ||
            session.user.email?.split('@')[0] ||
            'Nexus Operator',
          avatarUrl: session.user.user_metadata?.avatar_url || null,
          isGuest: false,
        });
        setHero((h) => ({
          ...h,
          username:
            session.user.user_metadata?.username ||
            session.user.email?.split('@')[0] ||
            h.username,
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Synchronize isolated player data from Supabase whenever active user changes
  useEffect(() => {
    async function loadUserData() {
      if (currentUser.isGuest || !isSupabaseConfigured) return;

      await initUserIfMissing({
        id: currentUser.id,
        email: currentUser.email,
        user_metadata: { username: currentUser.username, avatar_url: currentUser.avatarUrl },
      });

      const [dbHero, dbQuests, dbHabits, dbDailies, dbTodos] = await Promise.all([
        fetchHeroFromDb(),
        fetchQuestsFromDb(),
        fetchHabitsFromDb(),
        fetchDailiesFromDb(),
        fetchTodosFromDb(),
      ]);

      if (dbHero) setHero(dbHero);
      if (dbQuests && dbQuests.length > 0) setQuests(dbQuests);
      if (dbHabits && dbHabits.length > 0) setHabits(dbHabits);
      if (dbDailies && dbDailies.length > 0) setDailies(dbDailies);
      if (dbTodos && dbTodos.length > 0) setTodos(dbTodos);
    }
    loadUserData();
  }, [currentUser.id, currentUser.isGuest]);

  // Debounced auto-sync hero profile and attributes to Supabase
  useEffect(() => {
    if (currentUser.isGuest || !isSupabaseConfigured) return;
    const timer = setTimeout(() => {
      saveHeroToDb(hero);
    }, 1000);
    return () => clearTimeout(timer);
  }, [hero, currentUser.isGuest]);

  // Check for HP depletion / Hero Faint
  useEffect(() => {
    if (hero.hp <= 0 && !isFaintModalOpen) {
      sound.playFaint();
      setIsFaintModalOpen(true);
    }
  }, [hero.hp, isFaintModalOpen]);

  // Handle Positive Habit Trigger (+)
  const handleTriggerHabitPlus = (habit: HabitItem, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const baseExp = habit.difficulty === 'HARD' ? 60 : habit.difficulty === 'MEDIUM' ? 35 : 20;
    const baseGold = habit.difficulty === 'HARD' ? 25 : habit.difficulty === 'MEDIUM' ? 15 : 8;

    const earnedXp = Math.round(baseExp * comboMultiplier * (hero.isOverclocked ? 2 : 1));
    const earnedGold = Math.round(baseGold * comboMultiplier);

    addCombatText(x, y, `+${earnedXp} XP`, 'XP');
    setTimeout(() => addCombatText(x + 20, y - 20, `+${earnedGold} Gold`, 'GOLD'), 150);

    bumpCombo(x, y);
    checkLootDrop(x, y);

    const nextPosCount = (habit.positiveCount || 0) + 1;
    updateHabitCountInDb(habit.id, nextPosCount, habit.negativeCount || 0);

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id ? { ...h, positiveCount: nextPosCount } : h
      )
    );

    // Update Hero Stats
    setHero((h) => {
      const newTotalXp = h.totalXp + earnedXp;
      let newCurrentXp = h.xp + earnedXp;
      let newLevel = h.level;
      let newNextXp = h.nextLevelXp;
      let newSkillPoints = h.unspentSkillPoints;
      let leveledUp = false;

      if (newCurrentXp >= newNextXp) {
        newLevel += 1;
        newSkillPoints += 1;
        newCurrentXp = newCurrentXp - newNextXp;
        newNextXp = Math.round(newNextXp * 1.25);
        leveledUp = true;
      }

      if (leveledUp) {
        setLevelUpData({
          currentLevel: newLevel,
          earnedXp,
          earnedGold,
          streakBonus: 5,
          newStreak: h.streakCount,
          levelUp: true,
          nextLevelXp: newNextXp,
        });
        sound.playLevelUp();
      }

      return {
        ...h,
        level: newLevel,
        xp: newCurrentXp,
        nextLevelXp: newNextXp,
        totalXp: newTotalXp,
        gold: h.gold + earnedGold,
        hp: Math.min(h.maxHp, h.hp + 10),
        unspentSkillPoints: newSkillPoints,
      };
    });

    setStartingObjectives((prev) =>
      prev.map((o) => (o.id === 'obj-1' ? { ...o, completed: true } : o))
    );
  };

  // Handle Negative Habit Trigger (-)
  const handleTriggerHabitMinus = (habit: HabitItem, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const damageAmount = habit.difficulty === 'HARD' ? 30 : 15;

    setIsHitFlashing(true);
    setTimeout(() => setIsHitFlashing(false), 300);

    addCombatText(x, y, `-${damageAmount} HP!`, 'DAMAGE');
    setComboMultiplier(1.0);

    const nextNegCount = (habit.negativeCount || 0) + 1;
    updateHabitCountInDb(habit.id, habit.positiveCount || 0, nextNegCount);

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id ? { ...h, negativeCount: nextNegCount } : h
      )
    );

    setHero((h) => ({
      ...h,
      hp: Math.max(0, h.hp - damageAmount),
    }));
  };

  // Handle Daily Ritual Toggle
  const handleToggleDaily = (daily: DailyItem, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const updatedCompleted = !daily.completed;
    const updatedStreak = updatedCompleted ? daily.streak + 1 : Math.max(0, daily.streak - 1);
    toggleDailyInDb(daily.id, updatedCompleted, updatedStreak);

    setDailies((prev) =>
      prev.map((d) =>
        d.id === daily.id ? { ...d, completed: updatedCompleted, streak: updatedStreak } : d
      )
    );

    if (updatedCompleted) {
      const earnedXp = Math.round(45 * comboMultiplier);
      const earnedGold = Math.round(20 * comboMultiplier);

      addCombatText(x, y, `+${earnedXp} XP (Ritual)`, 'XP');
      setTimeout(() => addCombatText(x + 15, y - 20, `+${earnedGold} Gold`, 'GOLD'), 150);
      bumpCombo(x, y);
      checkLootDrop(x, y);

      setHero((h) => ({
        ...h,
        xp: h.xp + earnedXp,
        totalXp: h.totalXp + earnedXp,
        gold: h.gold + earnedGold,
        hp: Math.min(h.maxHp, h.hp + 20),
        streakCount: Math.max(h.streakCount, updatedStreak),
      }));

      setStartingObjectives((prev) =>
        prev.map((o) => (o.id === 'obj-2' ? { ...o, completed: true } : o))
      );
    }
  };

  // Handle To-Do Toggle
  const handleToggleTodo = (todo: TodoItem, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const updatedCompleted = !todo.completed;
    toggleTodoInDb(todo.id, updatedCompleted);

    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: updatedCompleted } : t))
    );

    if (updatedCompleted) {
      const earnedXp = Math.round(70 * comboMultiplier);
      const earnedGold = Math.round(35 * comboMultiplier);

      addCombatText(x, y, `+${earnedXp} XP (Bounty)`, 'XP');
      setTimeout(() => addCombatText(x + 15, y - 20, `+${earnedGold} Gold`, 'GOLD'), 150);
      bumpCombo(x, y);
      checkLootDrop(x, y);

      setHero((h) => ({
        ...h,
        xp: h.xp + earnedXp,
        totalXp: h.totalXp + earnedXp,
        gold: h.gold + earnedGold,
      }));
    }
  };

  // Toggle single quest completion status
  const handleToggleQuestStatus = (id: string, completed: boolean) => {
    toggleQuestInDb(id, completed);
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        const updated = { ...q, completed };

        if (completed) {
          const earnedXp = q.xpReward * comboMultiplier * (hero.isOverclocked ? 2 : 1);
          const earnedGold = Math.round((q.goldReward + (q.streakBonus || 0)) * comboMultiplier);

          setHero((h) => {
            const newTotalXp = h.totalXp + earnedXp;
            let newCurrentXp = h.xp + earnedXp;
            let newLevel = h.level;
            let newNextXp = h.nextLevelXp;
            let newHp = Math.min(h.maxHp, h.hp + 25);
            let newSkillPoints = h.unspentSkillPoints;

            if (newCurrentXp >= newNextXp) {
              newLevel += 1;
              newSkillPoints += 1;
              newCurrentXp = newCurrentXp - newNextXp;
              newNextXp = Math.round(newNextXp * 1.25);
              newHp = h.maxHp;
              setLevelUpData({
                currentLevel: newLevel,
                earnedXp,
                earnedGold,
                streakBonus: q.streakBonus || 5,
                newStreak: h.streakCount,
                levelUp: true,
                nextLevelXp: newNextXp,
              });
              sound.playLevelUp();
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

          setStartingObjectives((prev) =>
            prev.map((o) => (o.id === 'obj-2' ? { ...o, completed: true } : o))
          );
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
      totalEarnedXp += q.xpReward * (hero.isOverclocked ? 2 : 1);
      totalEarnedGold += q.goldReward + (q.streakBonus || 0);
    });

    setQuests((prev) => prev.map((q) => ({ ...q, completed: true })));

    setHero((h) => ({
      ...h,
      xp: h.xp + totalEarnedXp,
      totalXp: h.totalXp + totalEarnedXp,
      gold: h.gold + totalEarnedGold,
      hp: h.maxHp,
    }));

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#FF007A', '#FBBF24', '#8A5BEF'],
      });
    } catch {}
  };

  // Complete a starting objective
  const handleCompleteObjective = (id: string) => {
    const obj = startingObjectives.find((o) => o.id === id);
    if (!obj || obj.completed) return;

    sound.playCoin();
    setStartingObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, completed: true } : o))
    );

    setHero((h) => ({
      ...h,
      xp: h.xp + obj.rewardXp,
      totalXp: h.totalXp + obj.rewardXp,
      gold: h.gold + obj.rewardGold,
    }));
  };

  // Revive Operator from Faint Screen
  const handleRevive = () => {
    const goldLoss = Math.min(hero.gold, Math.round(hero.gold * 0.1));
    setHero((h) => ({
      ...h,
      hp: Math.round(h.maxHp * 0.5),
      gold: Math.max(0, h.gold - goldLoss),
    }));
    setIsFaintModalOpen(false);
  };

  // Claim Mystery Loot Crate Rewards
  const handleClaimLootRewards = (rewards: LootReward[]) => {
    let extraGold = 0;
    let extraShards = 0;
    let extraHp = 0;

    rewards.forEach((r) => {
      if (r.type === 'GOLD') extraGold += r.amount || 50;
      if (r.type === 'SHARDS') extraShards += r.amount || 2;
      if (r.type === 'POTION') extraHp += 250;
    });

    setHero((h) => ({
      ...h,
      gold: h.gold + extraGold,
      cyberShards: h.cyberShards + extraShards,
      hp: Math.min(h.maxHp, h.hp + extraHp),
    }));
  };

  // Handle Rewards & Coin Exchange purchases
  const handlePurchaseReward = (reward: ExchangeRewardItem) => {
    if (hero.gold < reward.cost) return;

    sound.playBuy();

    // Deduct currency
    setHero((h) => ({
      ...h,
      gold: Math.max(0, h.gold - reward.cost),
    }));

    // Handle Consumables, Potions & Meta Perks
    if (reward.category === 'POTION') {
      if (reward.id === 'pot-freeze') {
        setActiveBuffs((prev) => ({
          ...prev,
          streakShields: prev.streakShields + 1,
        }));
        addCombatText(window.innerWidth / 2, window.innerHeight / 2, '❄️ STREAK SHIELD +1!', 'LOOT');
      } else if (reward.id === 'pot-xp') {
        setActiveBuffs((prev) => ({
          ...prev,
          xpBoosterActive: true,
          xpBoosterExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        }));
        sound.playLevelUp();
        addCombatText(window.innerWidth / 2, window.innerHeight / 2, '⚡ 2X XP BOOSTER (24H)!', 'CRIT');
      } else if (reward.id === 'pot-heal') {
        setHero((h) => ({ ...h, hp: h.maxHp }));
        sound.playHeal();
        addCombatText(window.innerWidth / 2, window.innerHeight / 2, '💚 FULL HP RESTORED!', 'HEAL');
      }
    } else if (reward.category === 'META_PERK') {
      if (reward.id === 'meta-flare-cyan') {
        setActiveBuffs((prev) => ({ ...prev, activeFlare: 'NEON_CYAN' }));
        addCombatText(window.innerWidth / 2, window.innerHeight / 2, '✨ CYAN FLARE EQUIPPED!', 'LOOT');
      } else if (reward.id === 'meta-flare-magenta') {
        setActiveBuffs((prev) => ({ ...prev, activeFlare: 'CHRONO_PURPLE' }));
        addCombatText(window.innerWidth / 2, window.innerHeight / 2, '🔥 PURPLE FLARE EQUIPPED!', 'LOOT');
      } else if (reward.id === 'meta-flare-gold') {
        setActiveBuffs((prev) => ({ ...prev, activeFlare: 'SOLAR_GOLD' }));
        addCombatText(window.innerWidth / 2, window.innerHeight / 2, '👑 SOLAR CROWN FLARE EQUIPPED!', 'CRIT');
      } else if (reward.id === 'meta-scroll-dragon' || reward.id === 'meta-scroll-cyber') {
        addCombatText(window.innerWidth / 2, window.innerHeight / 2, '📜 RAID SCROLL ACQUIRED!', 'LOOT');
      } else if (reward.id === 'meta-gift-badge') {
        addCombatText(window.innerWidth / 2, window.innerHeight / 2, '🎁 TIP / BADGE SENT!', 'LOOT');
      }
    } else if (reward.category === 'EQUIPMENT') {
      addCombatText(window.innerWidth / 2, window.innerHeight / 2, `⚔️ ${reward.title} EQUIPPED!`, 'CRIT');
      setStartingObjectives((prev) =>
        prev.map((o) => (o.id === 'obj-3' ? { ...o, completed: true } : o))
      );
    } else if (reward.category === 'CUSTOM') {
      addCombatText(window.innerWidth / 2, window.innerHeight / 2, `🎉 CLAIMED: ${reward.title}!`, 'LOOT');
    }

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#FF007A', '#FBBF24', '#10B981'],
      });
    } catch {}
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#070514] font-mono text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-2xl border-2 border-cyan-400 bg-cyan-950/60 p-3 shadow-[0_0_30px_rgba(0,240,255,0.6)] flex items-center justify-center animate-pulse">
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-black tracking-widest text-cyan-400 uppercase">
              // NEXUS MATRIX INITIALIZING...
            </p>
            <p className="text-[11px] text-slate-400">Verifying Operator Security Credentials</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070512] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans pb-28 relative overflow-x-hidden">
      {/* Red Hit Flash Overlay when taking damage */}
      <AnimatePresence>
        {isHitFlashing && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-50 bg-rose-600/40"
          />
        )}
      </AnimatePresence>

      {/* Floating Combat Text Layer */}
      <FloatingCombatText events={combatTextEvents} />

      {/* Top Sticky Hero HUD with Avatar, Active Buffs, Google Auth & HP bar */}
      <HeroHud
        hero={{
          username: hero.username,
          level: hero.level,
          currentXp: hero.xp,
          nextLevelXp: hero.nextLevelXp,
          totalXp: hero.totalXp,
          gold: hero.gold,
          streakCount: hero.streakCount,
          hp: hero.hp,
          maxHp: hero.maxHp,
          avatar: hero.avatar || DEFAULT_AVATAR,
        }}
        activeBuffs={activeBuffs}
        comboMultiplier={comboMultiplier}
        currentUser={currentUser}
        onProfileClick={() => setActiveTab('ATTRIBUTES')}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onOpenAvatarCustomizer={() => setIsAvatarCustomizerOpen(true)}
      />

      {/* Main Content Area by Tab */}
      <main className="mx-auto max-w-lg sm:max-w-xl px-3 sm:px-4 pt-4">
        {activeTab === 'QUESTS' && (
          <QuestsHubView
            hero={hero}
            quests={quests}
            habits={habits}
            dailies={dailies}
            todos={todos}
            startingObjectives={startingObjectives}
            onToggleStatus={handleToggleQuestStatus}
            onOpenCreateQuest={handleOpenCreateTask}
            onToggleOverclock={() => {
              sound.playOverclock();
              setHero((h) => ({ ...h, isOverclocked: !h.isOverclocked }));
            }}
            onClaimAll={handleClaimAll}
            onTriggerHabitPlus={handleTriggerHabitPlus}
            onTriggerHabitMinus={handleTriggerHabitMinus}
            onToggleDaily={handleToggleDaily}
            onToggleTodo={handleToggleTodo}
            onCompleteObjective={handleCompleteObjective}
            onEditQuest={handleOpenEditQuest}
            onDeleteQuest={handleDeleteQuest}
            onEditHabit={handleOpenEditHabit}
            onDeleteHabit={handleDeleteHabit}
            onEditDaily={handleOpenEditDaily}
            onDeleteDaily={handleDeleteDaily}
            onEditTodo={handleOpenEditTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        )}

        {activeTab === 'ATTRIBUTES' && (
          <CharacterMatrixView
            hero={hero}
            onOpenAvatarCustomizer={() => setIsAvatarCustomizerOpen(true)}
            onSpendSkillPoint={() => {
              if (hero.unspentSkillPoints > 0) {
                sound.playSkillUnlock();
                setHero((h) => ({
                  ...h,
                  unspentSkillPoints: h.unspentSkillPoints - 1,
                  vitalityBonus: h.vitalityBonus + 1.5,
                }));
              }
            }}
          />
        )}

        {activeTab === 'REWARDS' && (
          <RewardsVaultView
            userGold={hero.gold}
            userShards={hero.cyberShards}
            heroHp={hero.hp}
            heroMaxHp={hero.maxHp}
            activeBuffs={activeBuffs}
            onPurchaseReward={handlePurchaseReward}
          />
        )}

        {activeTab === 'SYNDICATE' && (
          <SyndicateGuildView
            currentUsername={hero.username}
            currentUserLevel={hero.level}
            currentUserStreak={hero.streakCount}
            currentUserXp={hero.totalXp}
            currentUserGold={hero.gold}
            activeFlare={activeBuffs.activeFlare}
            onSendTip={(targetName: string, amount: number) => {
              if (hero.gold >= amount) {
                sound.playCoin();
                setHero((h) => ({ ...h, gold: Math.max(0, h.gold - amount) }));
                addCombatText(
                  window.innerWidth / 2,
                  window.innerHeight / 2,
                  `🎁 -${amount} COINS SENT TO ${targetName}!`,
                  'LOOT'
                );
              }
            }}
            onAttackPartyBoss={(damage: number) => {
              sound.playCritHit();
              addCombatText(
                window.innerWidth / 2,
                window.innerHeight / 2,
                `💥 +${damage} BOSS DAMAGE!`,
                'CRIT'
              );
            }}
          />
        )}
      </main>

      {/* Cyber Bottom Navigation Dock */}
      <CyberBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          sound.playClick();
          setActiveTab(tab);
        }}
      />

      {/* Task CRUD (Create / Edit) Universal Modal */}
      <TaskCrudModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialTaskType={taskModalType}
        editingQuest={editingQuest}
        editingHabit={editingHabit}
        editingDaily={editingDaily}
        editingTodo={editingTodo}
        onCreateQuest={handleCreateQuest}
        onUpdateQuest={handleUpdateQuest}
        onDeleteQuest={handleDeleteQuest}
        onCreateHabit={handleCreateHabit}
        onUpdateHabit={handleUpdateHabit}
        onDeleteHabit={handleDeleteHabit}
        onCreateDaily={handleCreateDaily}
        onUpdateDaily={handleUpdateDaily}
        onDeleteDaily={handleDeleteDaily}
        onCreateTodo={handleCreateTodo}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
      />

      {/* Google Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSignOut={async () => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('guest_mode');
          }
          if (isSupabaseConfigured) {
            await supabase.auth.signOut();
          }
          setCurrentUser({
            id: 'user-1',
            email: null,
            username: 'Nexus Operator',
            avatarUrl: null,
            isGuest: true,
          });
          setHero(INITIAL_HERO);
          setQuests(INITIAL_QUESTS);
          setHabits(INITIAL_HABITS);
          setDailies(INITIAL_DAILIES);
          setTodos(INITIAL_TODOS);
          router.replace('/login');
        }}
      />

      {/* Avatar Matrix Customizer Modal */}
      <AvatarCustomizerModal
        isOpen={isAvatarCustomizerOpen}
        onClose={() => setIsAvatarCustomizerOpen(false)}
        currentConfig={hero.avatar || DEFAULT_AVATAR}
        onSaveConfig={(newAvatar) => {
          setHero((h) => ({ ...h, avatar: newAvatar }));
          saveHeroToDb({ ...hero, avatar: newAvatar });
        }}
        operatorName={hero.username}
        operatorLevel={hero.level}
      />

      {/* Hero Faint / Death Penalty Modal */}
      <HeroFaintModal
        isOpen={isFaintModalOpen}
        goldPenalty={Math.min(hero.gold, Math.round(hero.gold * 0.1))}
        onRevive={handleRevive}
      />

      {/* Mystery Loot Crate Unboxing Modal */}
      <LootCrateModal
        isOpen={isLootModalOpen}
        onClose={() => setIsLootModalOpen(false)}
        onClaim={handleClaimLootRewards}
      />

      {/* Level Up Celebratory Modal */}
      <LevelUpModal
        isOpen={Boolean(levelUpData)}
        data={levelUpData}
        onClose={() => setLevelUpData(null)}
      />
    </div>
  );
}
