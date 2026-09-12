import {
  getXpRequiredForLevel,
  calculateLevelFromTotalXp,
  evaluateStreak,
  calculateFinalRewards,
  DIFFICULTY_REWARDS,
} from '../lib/progression';

/**
 * Game Progression Mechanics Test Suite
 */
describe('Life RPG Core Progression Mechanics', () => {
  describe('Leveling Formula: floor(100 * (Level ^ 1.5))', () => {
    test('calculates correct XP thresholds for initial levels', () => {
      expect(getXpRequiredForLevel(1)).toBe(100);
      expect(getXpRequiredForLevel(2)).toBe(282);
      expect(getXpRequiredForLevel(3)).toBe(519);
      expect(getXpRequiredForLevel(4)).toBe(800);
    });

    test('correctly calculates level and remainder for total XP', () => {
      // 0 XP -> Level 1, 0/100 XP
      const lvl1 = calculateLevelFromTotalXp(0, 1);
      expect(lvl1.level).toBe(1);
      expect(lvl1.currentXp).toBe(0);
      expect(lvl1.didLevelUp).toBe(false);

      // 100 XP -> Level 2, 0/282 XP
      const lvl2 = calculateLevelFromTotalXp(100, 1);
      expect(lvl2.level).toBe(2);
      expect(lvl2.currentXp).toBe(0);
      expect(lvl2.didLevelUp).toBe(true);
      expect(lvl2.levelsGained).toBe(1);

      // 450 XP -> Level 2 (100 used for L1->L2, 350 remaining out of 282 -> advances to Level 3 with 68 XP)
      // 100 (L1->L2) + 282 (L2->L3) = 382. 450 - 382 = 68 XP in Level 3.
      const lvl3 = calculateLevelFromTotalXp(450, 1);
      expect(lvl3.level).toBe(3);
      expect(lvl3.currentXp).toBe(68);
      expect(lvl3.didLevelUp).toBe(true);
      expect(lvl3.levelsGained).toBe(2);
    });
  });

  describe('Streak Engine', () => {
    test('initializes streak to 1 if no previous active date', () => {
      const res = evaluateStreak(null, new Date('2026-09-12T10:00:00Z'), 0);
      expect(res.newStreakCount).toBe(1);
      expect(res.isStreakMaintained).toBe(true);
      expect(res.isStreakBroken).toBe(false);
    });

    test('maintains streak on the same calendar day', () => {
      const lastActive = new Date('2026-09-12T08:00:00Z');
      const now = new Date('2026-09-12T18:00:00Z');
      const res = evaluateStreak(lastActive, now, 5);
      expect(res.newStreakCount).toBe(5);
      expect(res.isStreakBroken).toBe(false);
    });

    test('increments streak on consecutive day', () => {
      const lastActive = new Date('2026-09-11T20:00:00Z');
      const now = new Date('2026-09-12T10:00:00Z');
      const res = evaluateStreak(lastActive, now, 5);
      expect(res.newStreakCount).toBe(6);
      expect(res.isStreakBroken).toBe(false);
      expect(res.streakBonusMultiplier).toBe(1.1); // 1 + (6-1)*0.02 = 1.10x
    });

    test('resets streak to 1 when gap is 2 or more days', () => {
      const lastActive = new Date('2026-09-08T10:00:00Z');
      const now = new Date('2026-09-12T10:00:00Z');
      const res = evaluateStreak(lastActive, now, 10);
      expect(res.newStreakCount).toBe(1);
      expect(res.isStreakBroken).toBe(true);
      expect(res.streakBonusMultiplier).toBe(1.0);
    });
  });

  describe('Rewards & Multipliers', () => {
    test('applies streak multipliers accurately', () => {
      const base = DIFFICULTY_REWARDS.HARD; // 200 XP, 100 G, 150 Attr XP
      const rewards = calculateFinalRewards('HARD', 1.25);
      expect(rewards.xp).toBe(250);
      expect(rewards.gold).toBe(125);
      expect(rewards.attributeXp).toBe(188);
    });
  });
});
