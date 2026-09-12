export type QuestDifficulty = 'TRIVIAL' | 'EASY' | 'MEDIUM' | 'HARD';
export type AttributeType = 'STRENGTH' | 'INTELLECT' | 'STAMINA' | 'AGILITY';
export type ItemType = 'AVATAR_COSMETIC' | 'PROFILE_BADGE' | 'CUSTOM_THEME' | 'TITLE' | 'GEAR' | 'POTION';

export interface AvatarConfig {
  skinColor: string;
  hairColor: string;
  hairStyle: 'afro' | 'short' | 'spiky' | 'long';
  shirtColor: string;
  bgGradient: string;
}

export interface StartingObjective {
  id: string;
  title: string;
  completed: boolean;
  rewardXp: number;
  rewardGold: number;
}

export interface HabiticaHero {
  id: string;
  username: string;
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  nextLevelXp: number;
  mana: number;
  maxMana: number;
  gold: number;
  gems: number;
  avatar: AvatarConfig;
  startingObjectives: StartingObjective[];
}

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

export interface HabitItem {
  id: string;
  title: string;
  notes?: string;
  isPositive: boolean;
  isNegative: boolean;
  positiveCount: number;
  negativeCount: number;
  difficulty: QuestDifficulty;
  attributeType?: AttributeType;
}

export interface DailyItem {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  streak: number;
  daysOfWeek: number[]; // 0 = Sun ... 6 = Sat
  difficulty: QuestDifficulty;
  checklist?: { id: string; text: string; completed: boolean }[];
  attributeType?: AttributeType;
}

export interface TodoItem {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  difficulty: QuestDifficulty;
  checklist?: { id: string; text: string; completed: boolean }[];
  attributeType?: AttributeType;
}

export interface RewardItem {
  id: string;
  title: string;
  notes?: string;
  cost: number;
  type: 'CUSTOM' | 'POTION' | 'GEAR' | 'COSMETIC';
  icon?: string;
  healAmount?: number;
  isPurchased?: boolean;
}

export type LeaderboardFlare =
  | 'NONE'
  | 'NEON_CYAN'
  | 'CHRONO_PURPLE'
  | 'SOLAR_GOLD'
  | 'GLITCH_FLAME';

export interface ExchangeRewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'EQUIPMENT' | 'POTION' | 'META_PERK' | 'CUSTOM';
  icon?: string;
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  statBonus?: string;
  slot?: 'WEAPON' | 'ARMOR' | 'ROBE' | 'SHIELD' | 'POTION' | 'META' | 'CUSTOM';
  isOwned?: boolean;
  isEquipped?: boolean;
  stock?: number;
  effectType?:
    | 'HEAL'
    | 'STREAK_SHIELD'
    | 'XP_BOOSTER'
    | 'GUILD_SCROLL'
    | 'LEADERBOARD_FLARE'
    | 'GIFT_TIP'
    | 'CUSTOM';
}

export interface LeaderboardOperator {
  id: string;
  rank: number;
  username: string;
  title: string;
  level: number;
  streak: number;
  totalXp: number;
  gold: number;
  flare: LeaderboardFlare;
  isUser?: boolean;
  avatar?: AvatarConfig;
}

export interface PartyQuestScroll {
  id: string;
  title: string;
  description: string;
  targetBoss: string;
  bossHp: number;
  currentHp: number;
  cost: number;
  rewardXp: number;
  rewardGold: number;
  isUnlocked: boolean;
  participants: { name: string; damage: number; isUser?: boolean }[];
}

export interface ActiveBuffs {
  streakShields: number;
  xpBoosterActive: boolean;
  xpBoosterExpiresAt?: number | string | null;
  activeFlare: LeaderboardFlare;
}

export interface GearItem {
  id: string;
  slot: 'WEAPON' | 'NEURAL_DECK' | 'CHASSIS' | 'RELIC';
  name: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  cost: number;
  description: string;
  bonuses: string[];
  isEquipped?: boolean;
  isOwned?: boolean;
  imageUrl?: string;
}

export interface SkillNode {
  id: string;
  title: string;
  tier: number;
  maxTier: number;
  unlocked: boolean;
  cost: number;
  description: string;
  icon: string;
  category: 'CORE' | 'ATTACK' | 'DEFENSE' | 'FOCUS';
}

export interface AuditLog {
  id: string;
  action: string;
  attribute: string;
  xpGain: number;
  multiplier: string;
  timestamp: string;
}

export interface FireteamMember {
  id: string;
  name: string;
  role: string;
  damage: number;
  isUser?: boolean;
  avatarColor: string;
}

export interface RaidDirective {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  rewardDamage: number;
  completed: boolean;
  isClaimed: boolean;
}

export interface WorldBossState {
  name: string;
  title: string;
  currentHp: number;
  maxHp: number;
  timeLeft: string;
  userStoredDamage: number;
  globalParticipants: number;
}

export interface RadarStats {
  str: number;
  int: number;
  sta: number;
  agi: number;
  syn: number;
  void: number;
}

export interface HeroState {
  id: string;
  username: string;
  classTitle: string;
  specialization: string;
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  nextLevelXp: number;
  totalXp: number;
  gold: number;
  cyberShards: number;
  streakCount: number;
  unspentSkillPoints: number;
  radar: RadarStats;
  vitalityBonus: number;
  surgeBonus: number;
  strikeLatency: number;
  isOverclocked: boolean;
  avatar?: AvatarConfig;
  activeBuffs?: ActiveBuffs;
}
