import { supabase, isSupabaseConfigured } from './supabase';
import { HeroState } from '@/types/game';
import { CyberQuest } from '@/components/quest-card';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Fetch Hero profile and stats from Supabase
 */
export async function fetchHeroFromDb(): Promise<HeroState | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', DEMO_USER_ID)
      .maybeSingle();

    if (userError || !user) return null;

    const { data: attrs } = await supabase
      .from('user_attributes')
      .select('*')
      .eq('user_id', DEMO_USER_ID)
      .maybeSingle();

    return {
      id: user.id,
      username: user.username,
      classTitle: user.class_title,
      specialization: user.specialization,
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
      vitalityBonus: Number(user.vitality_bonus || 12.8),
      surgeBonus: Number(user.surge_bonus || 18.0),
      strikeLatency: user.strike_latency || 35,
      radar: {
        str: attrs?.str ?? 14,
        int: attrs?.intellect ?? 18,
        sta: attrs?.sta ?? 14,
        agi: attrs?.agi ?? 11,
        syn: attrs?.syn ?? 16,
        void: attrs?.void ?? 12,
      },
    };
  } catch (err) {
    console.warn('Supabase fetchHero error:', err);
    return null;
  }
}

/**
 * Save updated Hero state to Supabase
 */
export async function saveHeroToDb(hero: HeroState): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error: userError } = await supabase
      .from('users')
      .update({
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
      .eq('id', DEMO_USER_ID);

    if (hero.radar) {
      await supabase
        .from('user_attributes')
        .update({
          str: hero.radar.str,
          intellect: hero.radar.int,
          sta: hero.radar.sta,
          agi: hero.radar.agi,
          syn: hero.radar.syn,
          void: hero.radar.void,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', DEMO_USER_ID);
    }

    return !userError;
  } catch (err) {
    console.warn('Supabase saveHero error:', err);
    return false;
  }
}

/**
 * Fetch Quests from Supabase
 */
export async function fetchQuestsFromDb(): Promise<CyberQuest[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', DEMO_USER_ID)
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
    const { data, error } = await supabase
      .from('quests')
      .insert({
        user_id: DEMO_USER_ID,
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
    const { error } = await supabase
      .from('quests')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', questId);

    return !error;
  } catch (err) {
    console.warn('Supabase toggleQuest error:', err);
    return false;
  }
}

/**
 * Claim all quests in Supabase
 */
export async function claimAllQuestsInDb(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('quests')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', DEMO_USER_ID)
      .eq('completed', false);

    return !error;
  } catch (err) {
    console.warn('Supabase claimAllQuests error:', err);
    return false;
  }
}
