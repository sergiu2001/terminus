import { db } from '@/firebaseConfig';
import { Profile } from '@/models/Profile';
import useProfileStore, { ProfileState } from '@/session/stores/useProfileStore';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';

const COLLECTION = 'users';

let writeTimeout: ReturnType<typeof setTimeout> | null = null;

export async function writeProfileToFirestore(uid: string) {
  const state = useProfileStore.getState();
  const profile = state.profile;
  if (!profile) return;

  const ref = doc(db, COLLECTION, uid);
  try {
    await setDoc(
      ref,
      { profile: profile.toSnapshot(), profileUpdatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error('Error writing profile to Firestore', err);
  }
}

export type ProfileSyncOptions = {
  profileDefaults?: {
    username?: string;
    money?: number;
    tokens?: number;
  };
};

export async function initProfileSync(uid: string, opts?: ProfileSyncOptions) {
  const ref = doc(db, COLLECTION, uid);
  let applyingRemote = false;
  // Track both server-applied updatedAt and a logical version to avoid clock skew
  let lastRemoteAppliedAt: number | undefined;
  let lastRemoteVersion: number = 0;

  // hydrate once from server if exists
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as any;
      if (data?.profile) {
        const p = data.profile;
        const ts = (data.profileUpdatedAt || data.updatedAt) as Timestamp | number | undefined;
        const remoteUpdated = ts instanceof Timestamp ? ts.toMillis() : typeof ts === 'number' ? ts : undefined;
        const local = useProfileStore.getState().profile as Profile | null;
        const localVersion = local?.version ?? 0;
        const remoteVersion = typeof p.version === 'number' ? p.version : 0;
        const shouldApply = remoteVersion > localVersion || (!!remoteUpdated && (!local?.updatedAt || remoteUpdated > (local?.updatedAt ?? 0)));
        if (shouldApply) {
          const incoming = Profile.fromObject({ ...p, updatedAt: remoteUpdated ?? p.updatedAt, version: remoteVersion });
          applyingRemote = true;
          useProfileStore.getState().setProfileFromRemote(incoming);
          applyingRemote = false;
          lastRemoteAppliedAt = incoming.updatedAt;
          lastRemoteVersion = incoming.version ?? 0;
        }
      }
    }
    // If no remote or remote has no profile, ensure local exists and will be pushed
    const local = useProfileStore.getState().profile as Profile | null;
    if (!local) {
      // create a minimal local profile; caller should ensure UID/username mapping
      const username = opts?.profileDefaults?.username ?? `user_${uid.substring(0, 6)}`;
      const money = opts?.profileDefaults?.money ?? 0;
      const tokens = opts?.profileDefaults?.tokens ?? 0;
      const fallback = new Profile(uid, username, money, tokens, Date.now(), (lastRemoteVersion || 0) + 1);
      useProfileStore.getState().setProfile(fallback);
      // ensure Firestore doc gets created on first run
      try {
        await writeProfileToFirestore(uid);
      } catch (e) {
        console.warn('Initial profile write failed', e);
      }
    }
  } catch (err) {
    console.error('Error reading profile from Firestore', err);
  }

  // subscribe to remote changes
  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data() as any;
    if (data?.profile) {
      const p = data.profile;
      const ts = (data.profileUpdatedAt || data.updatedAt) as Timestamp | number | undefined;
      const remoteUpdated = ts instanceof Timestamp ? ts.toMillis() : typeof ts === 'number' ? ts : undefined;
      const local = useProfileStore.getState().profile as Profile | null;
      const localVersion = local?.version ?? 0;
      const remoteVersion = typeof p.version === 'number' ? p.version : 0;
      const shouldApply = remoteVersion > localVersion || (!!remoteUpdated && (!local?.updatedAt || remoteUpdated > (local?.updatedAt ?? 0)));
      if (shouldApply) {
        const incoming = Profile.fromObject({ ...p, updatedAt: remoteUpdated ?? p.updatedAt, version: remoteVersion });
        applyingRemote = true;
        useProfileStore.getState().setProfileFromRemote(incoming);
        applyingRemote = false;
        lastRemoteAppliedAt = incoming.updatedAt;
        lastRemoteVersion = incoming.version ?? 0;
      }
    }
  }, (err) => console.error('Profile snapshot error', err));

  // write local changes to Firestore when profile changes
  const unsubStore = useProfileStore.subscribe(
    (s: ProfileState) => s.profile,
    (profile: Profile | null) => {
      if (!profile) return;
      // debounce writes to avoid echo
      if (applyingRemote) return;
      // Bump version locally if needed and if not ahead of remote
      if ((profile.version ?? 0) <= lastRemoteVersion) {
        const next = new Profile(profile.id, profile.username, profile.money, profile.tokens, Date.now(), lastRemoteVersion + 1);
        useProfileStore.getState().setProfileFromRemote(next);
      }
      if (writeTimeout) clearTimeout(writeTimeout);
      writeTimeout = setTimeout(() => {
        writeProfileToFirestore(uid).catch(console.error);
      }, 300);
    }
  );

  return () => {
    unsub();
    unsubStore();
  };
}
