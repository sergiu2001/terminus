// Session sync policy:
// - Write to Firestore ONLY when a session starts (status becomes 'active') or
//   when status changes (e.g., to 'won' | 'lost' | 'expired').
// - Use server timestamps (`sessionUpdatedAt`) and remote-newer checks to avoid
//   write loops and prefer authoritative data.
import { db } from '@/firebaseConfig';
import useSessionStore, { SessionState } from '@/session/stores/useSessionStore';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';

const COLLECTION = 'users';

export async function writeSessionToFirestore(uid: string) {
  const state = useSessionStore.getState();
  const snap = state.data;
  if (!snap) return;

  const ref = doc(db, COLLECTION, uid);
  try {
    await setDoc(
      ref,
      { session: snap, sessionUpdatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error('Error writing session to Firestore', err);
  }
}

export async function initSessionSync(uid: string) {
  const ref = doc(db, COLLECTION, uid);
  let applyingRemote = false;
  let lastRemoteAppliedAt: number | undefined;
  let writeTimeout: ReturnType<typeof setTimeout> | null = null;

  // hydrate once from server if exists
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as any;
      if (data?.session) {
        const ts = (data.sessionUpdatedAt || data.updatedAt) as Timestamp | number | undefined;
        const remoteUpdated = ts instanceof Timestamp ? ts.toMillis() : typeof ts === 'number' ? ts : undefined;
        const local = useSessionStore.getState().data;
        const localUpdated = local?.updatedAt;
        if (!localUpdated || (remoteUpdated && remoteUpdated > localUpdated)) {
          applyingRemote = true;
          useSessionStore.getState().hydrate({ ...data.session, updatedAt: remoteUpdated ?? data.session.updatedAt });
          applyingRemote = false;
          lastRemoteAppliedAt = remoteUpdated ?? data.session.updatedAt;
        }
      }
    }
  } catch (err) {
    console.error('Error reading session from Firestore', err);
  }

  // subscribe to remote changes
  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data() as any;
    if (data?.session) {
      const ts = (data.sessionUpdatedAt || data.updatedAt) as Timestamp | number | undefined;
      const remoteUpdated = ts instanceof Timestamp ? ts.toMillis() : typeof ts === 'number' ? ts : undefined;
      const local = useSessionStore.getState().data;
      const localUpdated = local?.updatedAt;
      if (!localUpdated || (remoteUpdated && remoteUpdated > localUpdated)) {
        applyingRemote = true;
        useSessionStore.getState().hydrate({ ...data.session, updatedAt: remoteUpdated ?? data.session.updatedAt });
        applyingRemote = false;
        lastRemoteAppliedAt = remoteUpdated ?? data.session.updatedAt;
      }
    }
  }, (err) => console.error('Session snapshot error', err));

  // write to Firestore only when a session starts or status changes
  const unsubStore = useSessionStore.subscribe(
    (s: SessionState) => s.data,
    (session, prev) => {
      if (!session) return;
      if (applyingRemote) return; // avoid echo

      const currentStatus = session.status;
      const prevStatus = prev?.status;

      const isNewSession = !prev && currentStatus === 'active';
      const statusChanged = prev && prevStatus !== currentStatus;

      if (!isNewSession && !statusChanged) return;

      // Only push if local is newer than last remote applied
      const localUpdated = session.updatedAt ?? 0;
      if (lastRemoteAppliedAt && localUpdated <= lastRemoteAppliedAt) return;

      if (writeTimeout) clearTimeout(writeTimeout);
      writeTimeout = setTimeout(() => {
        writeSessionToFirestore(uid).catch(console.error);
      }, 300);
    }
  );

  return () => {
    unsub();
    unsubStore();
  };
}
