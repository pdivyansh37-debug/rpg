import { supabase, isSupabaseConfigured } from './supabase';
import { HeroState, HabitItem, DailyItem, TodoItem } from '@/types/game';
import { CyberQuest } from '@/components/quest-card';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Gets currently logged-in user ID or null if unauthenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

/**
 * Ensures user has an initialized record in public.users, public.user_attributes, and starter tasks
 */
export async function initUserIfMissing(authUser: {
  id: string;
  email?: string | null;
  user_metadata?: any;
}): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!existingUser) {
      const username =
        authUser.user_metadata?.username ||
        authUser.email?.split('@')[0] ||
        'Nexus Operator';

      // Insert User Profile
      await supabase.from('users').upsert({
        id: authUser.id,
        username,
        class_title: 'CHRONO-KNIGHT',
        specialization: 'Cyber-Focus Kinetic Synthesis',
        level: 1,
        hp: 800,
        max_hp: 800,
        xp: 0,
        next_level_xp: 100,
        total_xp: 0,
        gold: 0,
        cyber_shards: 0,
        streak_count: 0,
        unspent_skill_points: 0,
      });

      // Insert Attributes
      await supabase.from('user_attributes').upsert({
        user_id: authUser.id,
        str: 10,
        intellect: 10,
        sta: 10,
        agi: 10,
        syn: 10,
        void: 10,
      });

      // Insert Starter Quests
      await supabase.from('quests').upsert([
        {
          user_id: authUser.id,
          title: 'Morning Deep Work: 90m Code Session',
          description: 'Execute focused algorithm design & full-stack matrix integration.',
          difficulty: 'HARD',
          attribute_type: 'INTELLECT',
          xp_reward: 150,
          gold_reward: 60,
          streak_bonus: 6,
          completed: false,
          time_string: '11:30 AM',
          protocol_type: '[ BOSS GATE // INTELLECT ]',
          meta_badge: 'BOSS GATE',
          is_boss: true,
        },
        {
          user_id: authUser.id,
          title: 'Iron Temple: Heavy Squat & Pullups',
          description: 'Boost core power output and forge physical fortitude.',
          difficulty: 'MEDIUM',
          attribute_type: 'STRENGTH',
          xp_reward: 75,
          gold_reward: 28,
          streak_bonus: 3,
          completed: false,
          protocol_type: '[ RITUAL // STRENGTH ]',
          meta_badge: 'Ready to Claim',
          is_boss: false,
        },
      ]);

      // Insert Starter Habits
      await supabase.from('habits').upsert([
        {
          user_id: authUser.id,
          title: '25-Minute Deep Focus Sprint',
          notes: 'No distractions or multitasking. Pure flow state.',
          is_positive: true,
          is_negative: false,
          positive_count: 0,
          negative_count: 0,
          difficulty: 'MEDIUM',
          attribute_type: 'INTELLECT',
        },
        {
          user_id: authUser.id,
          title: 'Doomscrolling / Mindless Feeds',
          notes: 'Mindless scrolling drains operator focus and damages HP!',
          is_positive: false,
          is_negative: true,
          positive_count: 0,
          negative_count: 0,
          difficulty: 'HARD',
          attribute_type: 'AGILITY',
        },
      ]);

      // Insert Starter Dailies
      await supabase.from('dailies').upsert([
        {
          user_id: authUser.id,
          title: 'Daily Code Commit & Matrix Sync',
          notes: 'Ship at least 1 clean pull request or feature commit.',
          completed: false,
          streak: 0,
          difficulty: 'MEDIUM',
          attribute_type: 'INTELLECT',
        },
      ]);

      // Insert Starter Todos
      await supabase.from('todos').upsert([
        {
          user_id: authUser.id,
          title: 'Deploy Life RPG Production Release',
          notes: 'Verify responsive build, Supabase integration, and audio synthesis.',
          completed: false,
          due_date: 'Today',
          difficulty: 'HARD',
          attribute_type: 'INTELLECT',
        },
      ]);
    }
  } catch (err) {
    console.warn('initUserIfMissing error:', err);
  }
}

/**
 * Fetch Hero profile and stats for the authenticated user from Supabase
 */
export async function fetchHeroFromDb(): Promise<HeroState | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !user) return null;

    const { data: attrs } = await supabase
      .from('user_attributes')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return {
      id: user.id,
      username: user.username,
      classTitle: user.class_title || 'CHRONO-KNIGHT',
      specialization: user.specialization || 'Cyber-Focus Kinetic Synthesis',
      level: user.level,
      hp: user.hp,
      maxHp: user.max_hp,
      xp: user.xp,
      nextLevelXp: user.next_level_xp,
      totalXp: user.total_xp,
      gold: user.gold,
      cyberShards: user.cyber_shards,
      streakCount: user.streak_count,
      unspentSkillPoints: user.unspent_skill_points,
      isOverclocked: user.is_overclocked,
      vitalityBonus: Number(user.vitality_bonus || 10.0),
      surgeBonus: Number(user.surge_bonus || 10.0),
      strikeLatency: user.strike_latency || 35,
      radar: {
        str: attrs?.str ?? 10,
        int: attrs?.intellect ?? 10,
        sta: attrs?.sta ?? 10,
        agi: attrs?.agi ?? 10,
        syn: attrs?.syn ?? 10,
        void: attrs?.void ?? 10,
      },
    };
  } catch (err) {
    console.warn('Supabase fetchHero error:', err);
    return null;
  }
}

/**
 * Save updated Hero state to Supabase for the authenticated user
 */
export async function saveHeroToDb(hero: HeroState): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error: userError } = await supabase
      .from('users')
      .update({
        username: hero.username,
        level: hero.level,
        hp: hero.hp,
        max_hp: hero.maxHp,
        xp: hero.xp,
        next_level_xp: hero.nextLevelXp,
        total_xp: hero.totalXp,
        gold: hero.gold,
        cyber_shards: hero.cyberShards,
        streak_count: hero.streakCount,
        unspent_skill_points: hero.unspentSkillPoints,
        is_overclocked: hero.isOverclocked,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (hero.radar) {
      await supabase
        .from('user_attributes')
        .upsert({
          user_id: userId,
          str: hero.radar.str,
          intellect: hero.radar.int,
          sta: hero.radar.sta,
          agi: hero.radar.agi,
          syn: hero.radar.syn,
          void: hero.radar.void,
          updated_at: new Date().toISOString(),
        });
    }

    return !userError;
  } catch (err) {
    console.warn('Supabase saveHero error:', err);
    return false;
  }
}

/**
 * Fetch Quests for current user
 */
export async function fetchQuestsFromDb(): Promise<CyberQuest[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description || '',
      difficulty: q.difficulty,
      attributeType: q.attribute_type,
      xpReward: q.xp_reward,
      goldReward: q.gold_reward,
      streakBonus: q.streak_bonus,
      completed: q.completed,
      completedAt: q.completed_at,
      timeString: q.time_string,
      protocolType: q.protocol_type,
      metaBadge: q.meta_badge,
      isBoss: q.is_boss,
    }));
  } catch (err) {
    console.warn('Supabase fetchQuests error:', err);
    return null;
  }
}

/**
 * Insert a new Quest in Supabase
 */
export async function insertQuestToDb(quest: CyberQuest): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('quests')
      .insert({
        user_id: userId,
        title: quest.title,
        description: quest.description,
        difficulty: quest.difficulty,
        attribute_type: quest.attributeType,
        xp_reward: quest.xpReward,
        gold_reward: quest.goldReward,
        streak_bonus: quest.streakBonus,
        completed: false,
        time_string: quest.timeString,
        protocol_type: quest.protocolType,
        meta_badge: quest.metaBadge,
        is_boss: quest.isBoss,
      })
      .select('id')
      .single();

    if (error || !data) return null;
    return data.id;
  } catch (err) {
    console.warn('Supabase insertQuest error:', err);
    return null;
  }
}

/**
 * Toggle Quest completion in Supabase
 */
export async function toggleQuestInDb(questId: string, completed: boolean): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('quests')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', questId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase toggleQuest error:', err);
    return false;
  }
}

/**
 * Delete a Quest in Supabase
 */
export async function deleteQuestInDb(questId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', questId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase deleteQuest error:', err);
    return false;
  }
}

/**
 * Fetch Habits for current user
 */
export async function fetchHabitsFromDb(): Promise<HabitItem[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map((h) => ({
      id: h.id,
      title: h.title,
      notes: h.notes || '',
      isPositive: h.is_positive,
      isNegative: h.is_negative,
      positiveCount: h.positive_count,
      negativeCount: h.negative_count,
      difficulty: h.difficulty,
      attributeType: h.attribute_type,
    }));
  } catch (err) {
    console.warn('Supabase fetchHabits error:', err);
    return null;
  }
}

/**
 * Save / Update Habit count
 */
export async function updateHabitCountInDb(
  habitId: string,
  positiveCount: number,
  negativeCount: number
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('habits')
      .update({
        positive_count: positiveCount,
        negative_count: negativeCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', habitId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase updateHabitCount error:', err);
    return false;
  }
}

/**
 * Fetch Dailies for current user
 */
export async function fetchDailiesFromDb(): Promise<DailyItem[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('dailies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      notes: d.notes || '',
      completed: d.completed,
      streak: d.streak,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      difficulty: d.difficulty,
      attributeType: d.attribute_type,
    }));
  } catch (err) {
    console.warn('Supabase fetchDailies error:', err);
    return null;
  }
}

/**
 * Toggle Daily in Supabase
 */
export async function toggleDailyInDb(
  dailyId: string,
  completed: boolean,
  streak: number
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('dailies')
      .update({
        completed,
        streak,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dailyId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase toggleDaily error:', err);
    return false;
  }
}

/**
 * Fetch Todos for current user
 */
export async function fetchTodosFromDb(): Promise<TodoItem[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map((t) => ({
      id: t.id,
      title: t.title,
      notes: t.notes || '',
      completed: t.completed,
      dueDate: t.due_date,
      difficulty: t.difficulty,
      attributeType: t.attribute_type,
    }));
  } catch (err) {
    console.warn('Supabase fetchTodos error:', err);
    return null;
  }
}

/**
 * Toggle Todo in Supabase
 */
export async function toggleTodoInDb(todoId: string, completed: boolean): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('todos')
      .update({
        completed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', todoId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase toggleTodo error:', err);
    return false;
  }
}

/**
 * Claim all ready quests in Supabase
 */
export async function claimAllQuestsInDb(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('quests')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('completed', false);

    return !error;
  } catch (err) {
    console.warn('Supabase claimAllQuests error:', err);
    return false;
  }
}

/**
 * Update Quest details in Supabase
 */
export async function updateQuestInDb(quest: CyberQuest): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('quests')
      .update({
        title: quest.title,
        description: quest.description,
        difficulty: quest.difficulty,
        attribute_type: quest.attributeType,
        xp_reward: quest.xpReward,
        gold_reward: quest.goldReward,
        streak_bonus: quest.streakBonus,
        time_string: quest.timeString,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quest.id)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase updateQuest error:', err);
    return false;
  }
}

/**
 * Insert a new Habit in Supabase
 */
export async function insertHabitToDb(habit: HabitItem): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: userId,
        title: habit.title,
        notes: habit.notes,
        is_positive: habit.isPositive,
        is_negative: habit.isNegative,
        positive_count: habit.positiveCount || 0,
        negative_count: habit.negativeCount || 0,
        difficulty: habit.difficulty,
        attribute_type: habit.attributeType,
      })
      .select('id')
      .single();

    if (error || !data) return null;
    return data.id;
  } catch (err) {
    console.warn('Supabase insertHabit error:', err);
    return null;
  }
}

/**
 * Update Habit details in Supabase
 */
export async function updateHabitInDb(habit: HabitItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('habits')
      .update({
        title: habit.title,
        notes: habit.notes,
        is_positive: habit.isPositive,
        is_negative: habit.isNegative,
        difficulty: habit.difficulty,
        attribute_type: habit.attributeType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', habit.id)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase updateHabit error:', err);
    return false;
  }
}

/**
 * Delete a Habit in Supabase
 */
export async function deleteHabitInDb(habitId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase deleteHabit error:', err);
    return false;
  }
}

/**
 * Insert a new Daily in Supabase
 */
export async function insertDailyToDb(daily: DailyItem): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('dailies')
      .insert({
        user_id: userId,
        title: daily.title,
        notes: daily.notes,
        completed: false,
        streak: 0,
        difficulty: daily.difficulty,
        attribute_type: daily.attributeType,
      })
      .select('id')
      .single();

    if (error || !data) return null;
    return data.id;
  } catch (err) {
    console.warn('Supabase insertDaily error:', err);
    return null;
  }
}

/**
 * Update Daily details in Supabase
 */
export async function updateDailyInDb(daily: DailyItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('dailies')
      .update({
        title: daily.title,
        notes: daily.notes,
        difficulty: daily.difficulty,
        attribute_type: daily.attributeType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', daily.id)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase updateDaily error:', err);
    return false;
  }
}

/**
 * Delete a Daily in Supabase
 */
export async function deleteDailyInDb(dailyId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('dailies')
      .delete()
      .eq('id', dailyId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase deleteDaily error:', err);
    return false;
  }
}

/**
 * Insert a new Todo in Supabase
 */
export async function insertTodoToDb(todo: TodoItem): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        title: todo.title,
        notes: todo.notes,
        completed: false,
        due_date: todo.dueDate || 'Today',
        difficulty: todo.difficulty,
        attribute_type: todo.attributeType,
      })
      .select('id')
      .single();

    if (error || !data) return null;
    return data.id;
  } catch (err) {
    console.warn('Supabase insertTodo error:', err);
    return null;
  }
}

/**
 * Update Todo details in Supabase
 */
export async function updateTodoInDb(todo: TodoItem): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('todos')
      .update({
        title: todo.title,
        notes: todo.notes,
        due_date: todo.dueDate,
        difficulty: todo.difficulty,
        attribute_type: todo.attributeType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', todo.id)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase updateTodo error:', err);
    return false;
  }
}

/**
 * Delete a Todo in Supabase
 */
export async function deleteTodoInDb(todoId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', userId);

    return !error;
  } catch (err) {
    console.warn('Supabase deleteTodo error:', err);
    return false;
  }
}

