import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'terminus' });

export type MMKVStorage = {
  getItem: (name: string) => Promise<string | null>;
  setItem: (name: string, value: string) => Promise<void>;
  removeItem: (name: string) => Promise<void>;
};

export const mmkvStorage: MMKVStorage = {
  getItem: async (name: string) => {
    try {
      const value = storage.getString(name);
      return value ?? null;
    } catch (e) {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    // Guard: MMKV only accepts string/number/bool/ArrayBuffer
    const toStore = typeof value === 'string' ? value : JSON.stringify(value);
    storage.set(name, toStore);
    return Promise.resolve();
  },
  removeItem: async (name: string) => {
    storage.delete(name);
    return Promise.resolve();
  },
};

export default mmkvStorage;
