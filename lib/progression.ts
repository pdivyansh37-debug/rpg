// ============================================================================
// Life RPG - Core Progression & Gamification Engine
// ============================================================================

export type QuestDifficulty = 'TRIVIAL' | 'EASY' | 'MEDIUM' | 'HARD';
export type AttributeType = 'STRENGTH' | 'INTELLECT' | 'STAMINA' | 'AGILITY';

export interface BaseRewards {
  xp: number;
  gold: number;
  attributeXp: number;
}

export interface LevelProgress {
  level: number;
  totalXp: number;
  currentXp: number;     // XP gained within the current level
  nextLevelXp: number;   // XP needed to pass current level
  progressPercent: number; // 0 to 100%
  levelsGained: number;  // 0 if no level up, >0 if 1 or more levels gained
  didLevelUp: boolean;
}

export interface AttributeProgress {
  attribute: AttributeType;
  level: number;
  totalXp: number;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
  didLevelUp: boolean;
}

export interface StreakEvaluation {
  newStreakCount: number;
  isStreakMaintained: boolean;
  isStreakBroken: boolean;
  streakBonusMultiplier: number;
}

// ----------------------------------------------------------------------------
// 1. REWARD MATRIX & DIFFICULTY BALANCING
// ----------------------------------------------------------------------------

export const DIFFICULTY_REWARDS: Record<QuestDifficulty, BaseRewards> = {
  TRIVIAL: {
    xp: 15,
    gold: 5,
    attributeXp: 10,
  },
  EASY: {
    xp: 35,
    gold: 15,
    attributeXp: 25,
  },
  MEDIUM: {
    xp: 85,
    gold: 40,
    attributeXp: 60,
  },
  HARD: {
    xp: 200,
    gold: 100,
    attributeXp: 150,
  },
};

// ----------------------------------------------------------------------------
// 2. LEVELING FORMULA
// Next Level XP = floor(100 * (Level ^ 1.5))
// ----------------------------------------------------------------------------

/**
 * Calculates the exact XP required to advance from `level` to `level + 1`.
 * @example
 * Level 1 -> 2: floor(100 * 1^1.5) = 100 XP
 * Level 2 -> 3: floor(100 * 2^1.5) = 282 XP
 * Level 3 -> 4: floor(100 * 3^1.5) = 519 XP
 * Level 4 -> 5: floor(100 * 4^1.5) = 800 XP
 * Level 5 -> 6: floor(100 * 5^1.5) = 1118 XP
 */
export function getXpRequiredForLevel(level: number): number {
  if (level < 1) return 100;
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculates attribute XP requirement. Attributes level up at 60% standard scale.
 */
export function getAttributeXpRequiredForLevel(level: number): number {
  if (level < 1) return 60;
  return Math.floor(60 * Math.pow(level, 1.4));
}

/**
 * Computes the full user level progression state from total XP.
 * Handles single or multiple level-ups deterministically.
 */
export function calculateLevelFromTotalXp(
  totalXp: number,
  previousLevel: number = 1
): LevelProgress {
  let remainingXp = Math.max(0, totalXp);
  let currentLevel = 1;
  let xpNeededForNext = getXpRequiredForLevel(currentLevel);

  while (remainingXp >= xpNeededForNext) {
    remainingXp -= xpNeededForNext;
    currentLevel++;
    xpNeededForNext = getXpRequiredForLevel(currentLevel);
  }

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((remainingXp / xpNeededForNext) * 100))
  );

  const levelsGained = Math.max(0, currentLevel - previousLevel);

  return {
    level: currentLevel,
    totalXp,
    currentXp: remainingXp,
    nextLevelXp: xpNeededForNext,
    progressPercent,
    levelsGained,
    didLevelUp: levelsGained > 0,
  };
}

/**
 * Computes attribute level progression from total attribute XP.
 */
export function calculateAttributeProgress(
  attribute: AttributeType,
  totalXp: number,
  previousLevel: number = 1
): AttributeProgress {
  let remainingXp = Math.max(0, totalXp);
  let currentLevel = 1;
  let xpNeeded = getAttributeXpRequiredForLevel(currentLevel);

  while (remainingXp >= xpNeeded) {
    remainingXp -= xpNeeded;
    currentLevel++;
    xpNeeded = getAttributeXpRequiredForLevel(currentLevel);
  }

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((remainingXp / xpNeeded) * 100))
  );

  return {
    attribute,
    level: currentLevel,
    totalXp,
    currentXp: remainingXp,
    nextLevelXp: xpNeeded,
    progressPercent,
    didLevelUp: currentLevel > previousLevel,
  };
}

// ----------------------------------------------------------------------------
// 3. DAILY STREAK ENGINE & MULTIPLIERS
// ----------------------------------------------------------------------------

/**
 * Evaluates streak continuity based on last active timestamp.
 * - Same UTC calendar day: streak unchanged.
 * - Next consecutive calendar day: streak increments (+1).
 * - Missed 1+ calendar days: streak resets to 1.
 */
export function evaluateStreak(
  lastActiveDate: Date | null,
  now: Date = new Date(),
  currentStreak: number = 0
): StreakEvaluation {
  if (!lastActiveDate) {
    return {
      newStreakCount: 1,
      isStreakMaintained: true,
      isStreakBroken: false,
      streakBonusMultiplier: 1.0,
    };
  }

  // Normalize dates to UTC midnight for precise calendar-day comparison
  const lastUtc = Date.UTC(
    lastActiveDate.getUTCFullYear(),
    lastActiveDate.getUTCMonth(),
    lastActiveDate.getUTCDate()
  );
  const nowUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const dayDifference = Math.floor((nowUtc - lastUtc) / MS_PER_DAY);

  let newStreakCount = currentStreak;
  let isStreakBroken = false;
  let isStreakMaintained = true;

  if (dayDifference === 0) {
    // Already active today; streak stays as is
    newStreakCount = Math.max(1, currentStreak);
  } else if (dayDifference === 1) {
    // Consecutive day activity!
    newStreakCount = currentStreak + 1;
  } else {
    // Gap greater than 1 day - streak reset
    newStreakCount = 1;
    isStreakBroken = true;
  }

  // Streak bonus: +2% bonus per streak day up to +50% cap (1.5x)
  const streakBonusMultiplier = Math.min(1.5, 1.0 + (newStreakCount - 1) * 0.02);

  return {
    newStreakCount,
    isStreakMaintained,
    isStreakBroken,
    streakBonusMultiplier: Number(streakBonusMultiplier.toFixed(2)),
  };
}

/**
 * Calculates finalized rewards applying streak multipliers.
 */
export function calculateFinalRewards(
  difficulty: QuestDifficulty,
  streakMultiplier: number = 1.0
): BaseRewards {
  const base = DIFFICULTY_REWARDS[difficulty];
  return {
    xp: Math.round(base.xp * streakMultiplier),
    gold: Math.round(base.gold * streakMultiplier),
    attributeXp: Math.round(base.attributeXp * streakMultiplier),
  };
}
