import { Profile } from '@/models/Profile';
import mmkvStorage from '@/session/storage/mmkvStorage';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

// using shared mmkvStorage adapter
export interface ProfileState {
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  setProfileFromRemote: (p: Profile) => void;
  clearProfile: () => void;
}

const useProfileStore = create<ProfileState>()(
  subscribeWithSelector(
    persist(
    (set, get) => ({
      profile: null,
      // local setter: bump updatedAt
      setProfile: (p: Profile) => {
        const currentVersion = get().profile?.version ?? p.version ?? 0;
        const updated = new Profile(p.id, p.username, p.money, p.tokens, Date.now(), currentVersion + 1);
        set({ profile: updated });
      },
      // remote setter: trust provided updatedAt
      setProfileFromRemote: (p: Profile) => set({ profile: p }),
      clearProfile: () => set({ profile: null }),
    }),
    { name: 'profile-store', storage: mmkvStorage as any }
  )
  )
);

export default useProfileStore;
