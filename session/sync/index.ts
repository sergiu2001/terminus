import { initProfileSync, ProfileSyncOptions } from './profileSync';
import { initSessionSync } from './sessionSync';

export async function initSyncForUser(uid: string, profileDefaults?: ProfileSyncOptions['profileDefaults']) {
  // Initialize sync modules for the authenticated user. Returns a cleanup function.
  const unsubProfile = await initProfileSync(uid, profileDefaults ? { profileDefaults } : undefined);
  const unsubSession = await initSessionSync(uid);

  return () => {
    try { unsubProfile?.(); } catch {}
    try { unsubSession?.(); } catch {}
  };
}
