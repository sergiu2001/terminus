# Profile Feature - Implementation Guide

## Overview
Your profile feature has been enhanced with a complete reward system, statistics tracking, and better persistence. Here's what's been added and how to use it.

---

## ✅ What Was Fixed

### 1. **Reward System** ✨
- Automatically awards money, tokens, and XP when completing contracts
- Rewards scale based on:
  - **Difficulty**: Easy (100/5/50) → Medium (250/12/150) → Hard (500/25/300)
  - **Speed**: Complete faster = up to 2x multiplier
- Failed contracts tracked but no penalty

### 2. **Statistics Tracking** 📊
Extended `Profile` model with:
- **Level & XP**: Progressive leveling system (XP requirement grows exponentially)
- **Contracts Completed/Failed**: Track your performance
- **Total Earnings**: Lifetime money earned
- **Win Rate**: Automatic calculation

### 3. **Enhanced Display** 🎨
**index.tsx** now shows:
- Loading state during profile initialization
- Level and XP progress (e.g., "50/100")
- Contracts completed count
- Win rate percentage

**Terminal Profile Command**:
```
> profile

═══════════════════════════════════
        AGENT PROFILE
═══════════════════════════════════
ID:        abc123
Username:  player_name
Level:     5
XP:        75/225
───────────────────────────────────
Money:     $1,250
Tokens:    45
───────────────────────────────────
Completed: 12
Failed:    3
Win Rate:  80%
Earnings:  $3,500
═══════════════════════════════════
```

### 4. **Profile Service** 🛠️
New centralized service (`services/profileService.ts`) with:
- `updateProfileBalances()` - Modify money/tokens
- `awardReward()` - Give rewards after contract
- `deductCost()` - Spend money (for future shop)
- `updateUsername()` - Change username
- `canAfford()` - Check if player can buy something

---

## 🎮 How It Works

### Reward Flow
```
Player completes contract
         ↓
useSessionStore.finish('won')
         ↓
Calculate reward (difficulty + time bonus)
         ↓
awardReward() → updateProfileBalances()
         ↓
Profile store updates (with version bump)
         ↓
profileSync writes to Firestore (debounced 300ms)
         ↓
UI auto-updates via Zustand selector
```

### Data Flow
```
Component (index.tsx)
    ↓ useProfileStore((s) => s.profile)
Zustand Store (useProfileStore)
    ↓ MMKV persistence
Local Storage (instant)
    ↓ profileSync subscription
Firestore (cloud backup)
```

---

## 📝 Code Examples

### Update Balance Manually
```typescript
import { updateProfileBalances } from '@/services/profileService';

// Add money and tokens
updateProfileBalances(100, 5);

// Deduct money (negative values)
updateProfileBalances(-50, 0);
```

### Check If Player Can Afford
```typescript
import { canAfford } from '@/services/profileService';

if (canAfford(500, 10)) {
  // Player has at least $500 and 10 tokens
  deductCost(500, 10);
  // Give item
}
```

### Get Current Profile
```typescript
import { getCurrentProfile } from '@/services/profileService';

const profile = getCurrentProfile();
if (profile) {
  console.log(`${profile.username} has $${profile.money}`);
}
```

### Update Username
```typescript
import { updateUsername } from '@/services/profileService';

if (updateUsername('new_name')) {
  console.log('Username updated!');
} else {
  console.log('Invalid username');
}
```

---

## 🔧 Configuration

### Reward Tuning
Edit `services/profileService.ts`:

```typescript
const baseRewards: Record<Difficulty, { money: number; tokens: number; xp: number }> = {
  easy: { money: 100, tokens: 5, xp: 50 },    // Adjust these
  medium: { money: 250, tokens: 12, xp: 150 },
  hard: { money: 500, tokens: 25, xp: 300 },
};
```

### Level Progression
Edit `models/Profile.ts`:

```typescript
stats.xpToNextLevel = Math.floor(stats.xpToNextLevel * 1.5); // Growth rate
```

Change `1.5` to make leveling faster (lower) or slower (higher).

---

## 🎨 UI Components

### Profile Display (index.tsx)
Automatically updates when profile changes. Shows:
- Username, Level, XP bar
- Money and Tokens
- Contracts completed
- Win rate %

### Reward Notification (Optional)
Created but not yet integrated: `components/overlay/RewardNotification.tsx`

To use it, add to your game completion screen:
```tsx
import RewardNotification from '@/components/overlay/RewardNotification';

const [showReward, setShowReward] = useState(false);
const [lastReward, setLastReward] = useState({ money: 0, tokens: 0, xp: 0 });

// After contract completion:
setLastReward({ money: 250, tokens: 12, xp: 150 });
setShowReward(true);

return (
  <>
    {/* Your other components */}
    <RewardNotification
      money={lastReward.money}
      tokens={lastReward.tokens}
      xp={lastReward.xp}
      show={showReward}
      onHide={() => setShowReward(false)}
    />
  </>
);
```

---

## 🔐 Persistence Details

### Local Storage (MMKV)
- **Key**: `profile-store`
- **Storage**: React Native MMKV (faster than AsyncStorage)
- **Updates**: Immediate (synchronous)

### Cloud Storage (Firestore)
- **Collection**: `users`
- **Document ID**: Firebase UID
- **Structure**:
```json
{
  "profile": {
    "id": "user_uid",
    "username": "player_name",
    "money": 1250,
    "tokens": 45,
    "stats": {
      "contractsCompleted": 12,
      "contractsFailed": 3,
      "totalEarnings": 3500,
      "level": 5,
      "xp": 75,
      "xpToNextLevel": 225
    },
    "version": 23,
    "updatedAt": 1697654321000
  },
  "profileUpdatedAt": {Firebase.Timestamp}
}
```

### Sync Behavior
- **Write Debounce**: 300ms (prevents spam)
- **Conflict Resolution**: Higher version wins
- **Real-time**: Uses Firestore `onSnapshot()`
- **Offline**: Works offline, syncs when reconnected

---

## 🐛 Troubleshooting

### Profile Not Updating in UI
**Cause**: Not using Zustand selector correctly
**Fix**: Use selector in component:
```typescript
const profile = useProfileStore((s) => s.profile); // ✅ Reactive
// NOT: useProfileStore.getState().profile // ❌ Not reactive
```

### Rewards Not Being Awarded
**Check**:
1. Is `finish('won')` being called?
2. Check console for `Reward awarded:` log
3. Verify profile is loaded (not null)

### Profile Not Syncing to Cloud
**Check**:
1. Is user authenticated?
2. Check Firestore rules (must allow read/write for own UID)
3. Check network connection
4. Look for errors in console

### Version Conflicts
**Symptom**: Profile keeps resetting
**Fix**: Ensure only one device is active, or clear local storage:
```typescript
import mmkvStorage from '@/session/storage/mmkvStorage';
await mmkvStorage.removeItem('profile-store');
```

---

## 🚀 Next Steps

### Immediate Enhancements
1. **Add reward notification animation** - Integrate `RewardNotification` component
2. **Show level-up popup** - Celebrate when player levels up
3. **Add profile editing UI** - Allow username changes from settings

### Future Features
1. **Achievements System**
   - "First Contract" badge
   - "Speed Demon" (complete 10 contracts under time)
   - "Millionaire" (earn 1,000,000 money)

2. **Shop System**
   - Buy items with money/tokens
   - Use `deductCost()` for purchases

3. **Leaderboards**
   - Query Firestore for top players
   - Sort by level, earnings, win rate

4. **Profile Avatars**
   - Let users upload custom avatars
   - Store URL in profile

5. **Contract Difficulty Unlocking**
   - Require certain level for hard contracts
   - Use `profile.stats.level` to gate content

---

## 📚 File Reference

### Created/Modified Files
```
✅ services/profileService.ts         - Profile operations
✅ models/Profile.ts                   - Extended with stats
✅ session/stores/useProfileStore.ts   - Updated for stats
✅ session/stores/useSessionStore.ts   - Reward integration
✅ app/index.tsx                       - Enhanced display
✅ hooks/inputs/command/useCommandHandle.ts - Better profile command
✅ components/overlay/RewardNotification.tsx - Reward popup

📄 PROFILE_FEATURE_ANALYSIS.md        - This document
📄 session/sync/profileSync.ts         - Already working
📄 context/AuthContext.tsx             - Already working
```

### Key Methods

**Profile Model**:
- `withBalances(money, tokens)` - Update currency
- `withContractCompleted(xp)` - Track completion + XP
- `withContractFailed()` - Track failure
- `getWinRate()` - Calculate win percentage

**Profile Service**:
- `calculateReward(difficulty, time, maxTime)` - Compute reward
- `awardReward(reward)` - Give player reward
- `updateProfileBalances(money, tokens)` - Modify currency
- `deductCost(money, tokens)` - Spend currency
- `updateUsername(name)` - Change username
- `getCurrentProfile()` - Get profile safely
- `canAfford(money, tokens)` - Check affordability

---

## ✨ Summary

Your profile feature now:
- ✅ **Displays** on index.tsx with live updates
- ✅ **Persists** locally (MMKV) and cloud (Firestore)
- ✅ **Auto-updates** when changed (Zustand reactivity)
- ✅ **Awards rewards** on contract completion
- ✅ **Tracks statistics** (level, XP, win rate, etc.)
- ✅ **Handles conflicts** with version control
- ✅ **Works offline** with sync when online

The foundation is solid and ready for expansion! 🚀
