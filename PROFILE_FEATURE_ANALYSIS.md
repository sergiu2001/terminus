# Profile Feature - Complete Analysis & Improvements

## Current Implementation Overview

### Architecture
```
┌─────────────────┐
│   index.tsx     │ ← Displays profile (reactive)
│   (UI Layer)    │
└────────┬────────┘
         │ useProfileStore()
┌────────▼────────┐
│ useProfileStore │ ← Zustand store (local state)
│    + MMKV       │
└────────┬────────┘
         │ subscribeWithSelector
┌────────▼────────┐
│  profileSync.ts │ ← Firestore sync (cloud)
│                 │
└─────────────────┘
```

### Data Flow
1. **On Login**: `AuthContext` → `initProfileSync()` → Loads from Firestore → Updates local store
2. **On Update**: Local store change → Debounced write to Firestore (300ms)
3. **On Remote Change**: Firestore snapshot → Compare versions → Update local if remote is newer
4. **On Logout**: Clear local store + stop sync

---

## ✅ What's Working

### 1. **Display** (index.tsx)
- ✅ Profile displays on home screen
- ✅ Shows username, money, tokens
- ✅ Reactive updates via Zustand selector
- ✅ Fallback values for null profile

### 2. **Local Persistence** (MMKV)
- ✅ Uses `react-native-mmkv` for fast storage
- ✅ Persists between app restarts
- ✅ Proper async storage adapter

### 3. **Cloud Sync** (Firestore)
- ✅ Bi-directional sync
- ✅ Version-based conflict resolution
- ✅ Debounced writes (prevents spam)
- ✅ Real-time updates via onSnapshot
- ✅ Handles clock skew with version numbers

### 4. **Auth Integration**
- ✅ Syncs on login
- ✅ Clears on logout
- ✅ Creates default profile for new users
- ✅ Uses Firebase displayName/email for username

---

## ❌ Critical Issues & Missing Features

### 1. **No Balance Update Mechanism** 🔴 CRITICAL
**Problem**: The `withBalances()` method exists but is NEVER called anywhere.

**Impact**: 
- Money and tokens never change
- Completing contracts has no reward
- Profile is essentially read-only

**Current Code**:
```typescript
// Profile.ts - Method exists
withBalances(deltaMoney: number, deltaTokens: number) {
    const nextMoney = Math.max(0, (this.money ?? 0) + (deltaMoney ?? 0));
    const nextTokens = Math.max(0, (this.tokens ?? 0) + (deltaTokens ?? 0));
    return new Profile(this.id, this.username, nextMoney, nextTokens, Date.now(), (this.version ?? 0) + 1);
}

// ❌ NEVER CALLED ANYWHERE IN THE CODEBASE
```

### 2. **No Reward System** 🔴 CRITICAL
**Problem**: Completing contracts doesn't reward the player.

**Missing Logic**:
- When `GameSession.endGameSession('won')` is called
- Should calculate reward based on difficulty
- Should update profile with `withBalances()`

### 3. **No Profile Editing** 🟡 IMPORTANT
**Problem**: Can't change username after creation.

**Missing**:
- Edit profile command/screen
- Username validation
- Update method in store

### 4. **No Visual Feedback** 🟡 IMPORTANT
**Problem**: Profile updates happen silently.

**Missing**:
- Balance change animations (+100 💰)
- Level-up notifications
- Profile sync status indicator

### 5. **Missing Profile Stats** 🟢 ENHANCEMENT
**Suggested Additions**:
- Level/XP system
- Contracts completed counter
- Win/loss ratio
- Total earnings
- Achievements

---

## 🔧 Implementation Plan

### Phase 1: Critical Fixes (Immediate)

#### 1.1 Add Reward System
Create helper function to update balances and integrate with game finish.

#### 1.2 Connect Rewards to Game Completion
Update `useSessionStore.finish()` to award rewards.

#### 1.3 Add Profile Stats Tracking
Extend Profile model with statistics.

### Phase 2: Enhancements (Short-term)

#### 2.1 Profile Editing
Add command/UI to change username.

#### 2.2 Visual Feedback
Add animations for balance changes.

#### 2.3 Better Profile Display
Show more stats, add avatar selection.

### Phase 3: Advanced Features (Future)

#### 3.1 Achievements System
Track and display player achievements.

#### 3.2 Leaderboards
Compare stats with other players.

#### 3.3 Profile Customization
Themes, avatars, titles, badges.

---

## 📝 Recommended Improvements

### Issue 1: Version Bumping Logic (Potential Bug)
**Location**: `profileSync.ts` lines 116-119

**Current Code**:
```typescript
if ((profile.version ?? 0) <= lastRemoteVersion) {
    const next = new Profile(profile.id, profile.username, profile.money, profile.tokens, Date.now(), lastRemoteVersion + 1);
    useProfileStore.getState().setProfileFromRemote(next);
}
```

**Problem**: This creates an infinite loop if local version equals remote version.

**Fix**: Should only bump if strictly less than remote.

### Issue 2: No Error Boundaries
**Problem**: Profile errors could crash the app.

**Fix**: Add try-catch in UI components and error states.

### Issue 3: No Loading States
**Problem**: Profile might be undefined during initial load.

**Fix**: Add loading indicator in index.tsx.

---

## 🎯 Quick Wins (Implement First)

1. **Add `updateBalance()` helper function**
2. **Integrate rewards in `finish()` action**
3. **Add completed contracts counter**
4. **Show loading state in index.tsx**
5. **Add profile command in terminal**

---

## Code Quality Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| Architecture | ⭐⭐⭐⭐ | Clean separation of concerns |
| Type Safety | ⭐⭐⭐⭐⭐ | Full TypeScript coverage |
| Persistence | ⭐⭐⭐⭐⭐ | MMKV + Firestore working well |
| Sync Logic | ⭐⭐⭐⭐ | Good conflict resolution |
| Reactivity | ⭐⭐⭐⭐⭐ | Zustand selectors perfect |
| Completeness | ⭐⭐ | Missing reward system |
| Testing | ⭐ | No tests found |

**Overall**: Strong foundation, needs feature completion.

---

## Next Steps

See the following files for implementations:
1. `services/profileService.ts` - Profile update helpers
2. `models/Profile.ts` - Extended model
3. `session/stores/useSessionStore.ts` - Reward integration
4. `app/index.tsx` - Enhanced UI

Run the generator below to create these improvements automatically.
