export type QuestDifficulty = 'TRIVIAL' | 'EASY' | 'MEDIUM' | 'HARD';
export type AttributeType = 'STRENGTH' | 'INTELLECT' | 'STAMINA' | 'AGILITY';
export type ItemType = 'AVATAR_COSMETIC' | 'PROFILE_BADGE' | 'CUSTOM_THEME' | 'TITLE';
export type QuestStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';

export interface HeroProfile {
  id: string;
  username: string;
  avatarUrl?: string | null;
  level: number;
  totalXp: number;
  currentXp: number;
  nextLevelXp: number;
  gold: number;
  streakCount: number;
  longestStreak: number;
  lastActiveDate?: Date | null;
  attributes: {
    strength: number;
    intellect: number;
    stamina: number;
    agility: number;
    strengthXp: number;
    intellectXp: number;
    staminaXp: number;
    agilityXp: number;
  };
}
