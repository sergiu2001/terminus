# Profile storage and sync

The game uses a local-first approach for player profile data:

- Local: Zustand store persisted with MMKV (`session/stores/useProfileStore.ts`). Updates bump a local `updatedAt` timestamp.
- Cloud: Firestore document at `users/{uid}` keeps a `profile` object and `profileUpdatedAt` server timestamp.
- Sync: On login, we reconcile local vs remote by preferring the highest `updatedAt`. Then we subscribe to remote changes and push local changes (debounced) to Firestore. On logout we clear the local profile.

Key files:
- `models/Profile.ts` – includes `updatedAt` and helpers.
- `session/sync/profileSync.ts` – handles reconciliation, subscription, and writes.
- `context/AuthContext.tsx` – wires sync to Firebase Auth state.

Suggested Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Note: The first time a user logs in, if neither local nor remote profile exists, a default profile is created locally and then synced to Firestore.
