# Profile Feature - Testing Checklist

## 🧪 Test Cases

### Basic Functionality

- [ ] **Profile Display**
  - [ ] Profile shows on index.tsx home screen
  - [ ] Shows username, level, XP, money, tokens
  - [ ] Shows contracts completed and win rate
  - [ ] Loading state appears briefly on first load
  - [ ] Updates immediately when values change

- [ ] **Profile Command**
  - [ ] Type `profile` in terminal
  - [ ] Shows formatted profile with all stats
  - [ ] Displays correct values
  - [ ] Works from home screen

### Persistence Tests

- [ ] **Local Storage (MMKV)**
  - [ ] Close and reopen app
  - [ ] Profile data persists between sessions
  - [ ] No data loss on app restart
  - [ ] Fast loading (no delay)

- [ ] **Cloud Sync (Firestore)**
  - [ ] Log in on Device A
  - [ ] Complete a contract
  - [ ] Log in on Device B (same account)
  - [ ] Profile shows updated stats
  - [ ] Both devices stay in sync

- [ ] **Offline Mode**
  - [ ] Disable network
  - [ ] Complete a contract
  - [ ] Profile updates locally
  - [ ] Enable network
  - [ ] Changes sync to Firestore

### Reward System

- [ ] **Contract Completion (Won)**
  - [ ] Complete an easy contract
  - [ ] Money increases by ~100-200
  - [ ] Tokens increase by ~5-10
  - [ ] XP increases by ~50-100
  - [ ] Contracts completed counter +1
  - [ ] Win rate updates

- [ ] **Contract Failure**
  - [ ] Fail/expire a contract
  - [ ] No money/tokens awarded
  - [ ] Contracts failed counter +1
  - [ ] Win rate decreases

- [ ] **Speed Bonus**
  - [ ] Complete contract very quickly (<50% time)
  - [ ] Reward should be close to 2x base
  - [ ] Complete contract slowly (>90% time)
  - [ ] Reward should be close to 1x base

- [ ] **Difficulty Scaling**
  - [ ] Complete easy contract → ~100 money
  - [ ] Complete medium contract → ~250 money
  - [ ] Complete hard contract → ~500 money

### Leveling System

- [ ] **XP Accumulation**
  - [ ] Complete contracts and gain XP
  - [ ] XP bar increases on profile
  - [ ] Shows correct XP/XP_needed ratio

- [ ] **Level Up**
  - [ ] Gain enough XP to level up
  - [ ] Level increases by 1
  - [ ] Overflow XP carries to next level
  - [ ] XP requirement increases

- [ ] **Multiple Level Ups**
  - [ ] Gain massive XP (cheat/test)
  - [ ] Should level up multiple times
  - [ ] XP bar shows correctly after

### Statistics Tracking

- [ ] **Contracts Completed**
  - [ ] Starts at 0 for new account
  - [ ] Increments by 1 per win
  - [ ] Persists across sessions

- [ ] **Contracts Failed**
  - [ ] Starts at 0 for new account
  - [ ] Increments by 1 per loss
  - [ ] Persists across sessions

- [ ] **Win Rate**
  - [ ] Shows 0% for new account
  - [ ] Calculates correctly (completed / total)
  - [ ] Updates after each contract
  - [ ] Shows as percentage (e.g., "75%")

- [ ] **Total Earnings**
  - [ ] Starts at 0 for new account
  - [ ] Increases by money earned (not spent)
  - [ ] Only tracks positive income
  - [ ] Persists across sessions

### Profile Service Functions

- [ ] **updateProfileBalances()**
  - [ ] Call with positive values → balance increases
  - [ ] Call with negative values → balance decreases
  - [ ] Balance never goes below 0
  - [ ] Triggers Firestore sync

- [ ] **awardReward()**
  - [ ] Awards money, tokens, XP
  - [ ] Updates profile immediately
  - [ ] Console logs reward
  - [ ] UI reflects changes

- [ ] **deductCost()**
  - [ ] Returns true if affordable
  - [ ] Returns false if not affordable
  - [ ] Only deducts if affordable
  - [ ] Doesn't go negative

- [ ] **updateUsername()**
  - [ ] Accepts valid username (3-20 chars)
  - [ ] Rejects too short (<3 chars)
  - [ ] Rejects too long (>20 chars)
  - [ ] Trims whitespace
  - [ ] Updates profile and syncs

- [ ] **canAfford()**
  - [ ] Returns true if player has enough
  - [ ] Returns false if insufficient funds
  - [ ] Checks both money AND tokens
  - [ ] Handles null profile gracefully

### Sync & Conflict Resolution

- [ ] **Version Control**
  - [ ] Local changes bump version
  - [ ] Remote changes respected if newer
  - [ ] Higher version always wins
  - [ ] No infinite loops

- [ ] **Debounced Writes**
  - [ ] Multiple rapid changes batched
  - [ ] Only writes to Firestore after 300ms pause
  - [ ] Doesn't spam Firestore
  - [ ] All changes eventually persist

- [ ] **Real-time Updates**
  - [ ] Change profile on Device A
  - [ ] Device B updates within seconds
  - [ ] No manual refresh needed
  - [ ] Works both directions

### Auth Integration

- [ ] **Login**
  - [ ] Profile loads from Firestore
  - [ ] Local profile updates
  - [ ] Sync starts automatically
  - [ ] Shows correct data immediately

- [ ] **New Account**
  - [ ] Creates default profile
  - [ ] Username from email/displayName
  - [ ] Money/tokens start at 0
  - [ ] Profile syncs to Firestore

- [ ] **Logout**
  - [ ] Local profile clears
  - [ ] Sync stops
  - [ ] No lingering data
  - [ ] Can log in again fresh

### Edge Cases

- [ ] **Null Profile**
  - [ ] UI shows fallback values (0, "anonymous")
  - [ ] No crashes
  - [ ] Commands handle gracefully
  - [ ] Loading state appears

- [ ] **Network Errors**
  - [ ] Local updates still work
  - [ ] Console shows error (not crash)
  - [ ] Retries on reconnect
  - [ ] Data not lost

- [ ] **Corrupted Data**
  - [ ] Profile.fromObject() handles missing fields
  - [ ] Stats initialize if undefined
  - [ ] No crashes
  - [ ] Recovers gracefully

- [ ] **Rapid Changes**
  - [ ] Multiple quick updates don't conflict
  - [ ] Debouncing works
  - [ ] All changes preserved
  - [ ] No data loss

### Performance

- [ ] **Load Time**
  - [ ] Profile loads in <1 second
  - [ ] No noticeable lag
  - [ ] MMKV is fast
  - [ ] UI responsive

- [ ] **Memory Usage**
  - [ ] No memory leaks
  - [ ] Store cleanup on logout
  - [ ] Subscriptions unsubscribe
  - [ ] App remains stable

- [ ] **Battery Impact**
  - [ ] No excessive wake locks
  - [ ] Firestore listener efficient
  - [ ] Debouncing reduces writes
  - [ ] Acceptable battery drain

---

## 🔧 Debug Commands

### Check Profile in Console
```typescript
import useProfileStore from '@/session/stores/useProfileStore';
console.log(useProfileStore.getState().profile);
```

### Manually Update Balance
```typescript
import { updateProfileBalances } from '@/services/profileService';
updateProfileBalances(1000, 50); // Give 1000 money, 50 tokens
```

### Force Sync to Firestore
```typescript
import { writeProfileToFirestore } from '@/session/sync/profileSync';
import { useAuth } from '@/context/AuthContext';
const { user } = useAuth();
if (user) writeProfileToFirestore(user.uid);
```

### Reset Profile (Testing Only)
```typescript
import useProfileStore from '@/session/stores/useProfileStore';
import mmkvStorage from '@/session/storage/mmkvStorage';

// Clear store
useProfileStore.getState().clearProfile();

// Clear local storage
mmkvStorage.removeItem('profile-store');

// Log out and back in to recreate
```

### Check Firestore Data
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Find collection: `users`
4. Find document: Your UID
5. Check `profile` object

---

## 🐛 Common Issues

### Issue: Profile shows "anonymous" and 0 values
**Causes**:
- Not logged in
- Profile not initialized
- Sync failed

**Fix**:
1. Check auth state: `useAuth().isAuthenticated`
2. Check profile in store: `useProfileStore.getState().profile`
3. Check console for errors
4. Verify Firestore rules allow access

### Issue: Rewards not appearing
**Causes**:
- `finish()` not called
- Profile is null
- Import error

**Fix**:
1. Add logs in `finish()` method
2. Verify profile exists before awarding
3. Check console for errors
4. Manually call `awardReward()` to test

### Issue: Profile not syncing between devices
**Causes**:
- Not logged in with same account
- Network issues
- Firestore rules block access

**Fix**:
1. Verify same UID on both devices
2. Check network connection
3. Check Firestore rules
4. Look for "Profile snapshot error" logs

### Issue: UI not updating after profile change
**Causes**:
- Not using Zustand selector
- Using `getState()` instead of hook
- Component not re-rendering

**Fix**:
```typescript
// ❌ Wrong - not reactive
const profile = useProfileStore.getState().profile;

// ✅ Correct - reactive
const profile = useProfileStore((s) => s.profile);
```

---

## ✅ Acceptance Criteria

### Must Have (P0)
- [x] Profile displays on home screen
- [x] Profile persists locally and in cloud
- [x] Rewards awarded on contract completion
- [x] Statistics tracked (completed, failed, win rate)
- [x] Profile syncs across devices
- [x] Works offline
- [x] No crashes or data loss

### Should Have (P1)
- [x] Level and XP system
- [x] Total earnings tracker
- [x] Enhanced profile command
- [x] Loading states
- [ ] Reward notification animation *(created, needs integration)*
- [ ] Username editing UI *(service ready, needs UI)*

### Nice to Have (P2)
- [ ] Level-up celebration
- [ ] Profile avatar
- [ ] Achievement badges
- [ ] Leaderboards
- [ ] Profile themes

---

## 📊 Test Report Template

```
Profile Feature Test Report
Date: ___________
Tester: ___________
Device: ___________

✅ Passed: __ / __
⚠️  Issues: __ / __
❌ Failed: __ / __

Critical Issues:
1. 
2.

Minor Issues:
1.
2.

Notes:


Overall Status: [ PASS / FAIL ]
```

---

## 🚀 Ready for Production?

Complete this checklist before deploying:

- [ ] All P0 tests pass
- [ ] No console errors
- [ ] Firestore rules configured
- [ ] Performance is acceptable
- [ ] Works on iOS and Android
- [ ] Offline mode tested
- [ ] Multi-device sync tested
- [ ] New account flow tested
- [ ] Logout/login cycle tested
- [ ] Documentation complete

**Sign-off**: ________________  Date: __________
