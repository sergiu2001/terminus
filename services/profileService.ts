import { Difficulty } from '@/models/Contract';
import { Profile } from '@/models/Profile';
import useProfileStore from '@/session/stores/useProfileStore';

/**
 * Profile Service
 * Centralized logic for profile operations
 */

export interface RewardCalculation {
  money: number;
  tokens: number;
  xp: number;
}

/**
 * Calculate rewards based on difficulty and completion time
 */
export function calculateReward(
  difficulty: Difficulty,
  completionTimeMs: number,
  maxTimeMs: number
): RewardCalculation {
  // Base rewards by difficulty
  const baseRewards: Record<Difficulty, { money: number; tokens: number; xp: number }> = {
    easy: { money: 100, tokens: 5, xp: 50 },
    medium: { money: 250, tokens: 12, xp: 150 },
    hard: { money: 500, tokens: 25, xp: 300 },
  };

  const base = baseRewards[difficulty];

  // Time bonus: faster completion = more reward (up to 2x)
  const timeRatio = completionTimeMs / maxTimeMs;
  const timeMultiplier = Math.max(1, 2 - timeRatio); // 1x to 2x based on speed

  return {
    money: Math.floor(base.money * timeMultiplier),
    tokens: Math.floor(base.tokens * timeMultiplier),
    xp: Math.floor(base.xp * timeMultiplier),
  };
}

/**
 * Update profile balances (money and tokens)
 * This is the main way to modify a user's currency
 */
export function updateProfileBalances(deltaMoney: number, deltaTokens: number): void {
  const state = useProfileStore.getState();
  const currentProfile = state.profile;

  if (!currentProfile) {
    console.warn('Cannot update balances: no profile loaded');
    return;
  }

  // Use the immutable withBalances method
  const updatedProfile = currentProfile.withBalances(deltaMoney, deltaTokens);
  
  // Update the store (this will trigger sync to Firestore)
  state.setProfile(updatedProfile);
  
  console.log(`Profile updated: ${deltaMoney > 0 ? '+' : ''}${deltaMoney} money, ${deltaTokens > 0 ? '+' : ''}${deltaTokens} tokens`);
}

/**
 * Award reward to player (used when completing contracts)
 */
export function awardReward(reward: RewardCalculation): void {
  updateProfileBalances(reward.money, reward.tokens);
  
  // TODO: Add XP tracking when Profile is extended with stats
  console.log(`Reward awarded: ${reward.money} money, ${reward.tokens} tokens, ${reward.xp} XP`);
}

/**
 * Deduct cost from player (used for purchasing items/contracts)
 */
export function deductCost(money: number, tokens: number): boolean {
  const state = useProfileStore.getState();
  const currentProfile = state.profile;

  if (!currentProfile) {
    console.warn('Cannot deduct cost: no profile loaded');
    return false;
  }

  // Check if player has enough
  if (currentProfile.money < money || currentProfile.tokens < tokens) {
    console.warn('Insufficient funds');
    return false;
  }

  updateProfileBalances(-money, -tokens);
  return true;
}

/**
 * Update username
 */
export function updateUsername(newUsername: string): boolean {
  const state = useProfileStore.getState();
  const currentProfile = state.profile;

  if (!currentProfile) {
    console.warn('Cannot update username: no profile loaded');
    return false;
  }

  // Validate username
  if (!newUsername || newUsername.trim().length < 3) {
    console.warn('Username must be at least 3 characters');
    return false;
  }

  if (newUsername.length > 20) {
    console.warn('Username must be less than 20 characters');
    return false;
  }

  // Create updated profile
  const updatedProfile = new Profile(
    currentProfile.id,
    newUsername.trim(),
    currentProfile.money,
    currentProfile.tokens,
    Date.now(),
    currentProfile.version + 1
  );

  state.setProfile(updatedProfile);
  console.log(`Username updated to: ${newUsername}`);
  return true;
}

/**
 * Get current profile safely
 */
export function getCurrentProfile(): Profile | null {
  return useProfileStore.getState().profile;
}

/**
 * Check if player can afford something
 */
export function canAfford(money: number, tokens: number): boolean {
  const profile = getCurrentProfile();
  if (!profile) return false;
  return profile.money >= money && profile.tokens >= tokens;
}
