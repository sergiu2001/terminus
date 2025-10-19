import { Difficulty } from '@/models/Contract';
import { GameSession } from '@/models/GameSession';
import { GameSessionSnapshot } from '@/models/GameTypes';
import mmkvStorage from '@/session/storage/mmkvStorage';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

// reuse shared mmkvStorage adapter

export interface SessionState {
    data: GameSessionSnapshot | null;
    // actions
    start: (params: { level: Difficulty; duration: number }) => void;
    hydrate: (snap: GameSessionSnapshot) => void;
    finish: (status: 'won' | 'lost' | 'expired') => void;
    addLog: (text: string) => void;
    addMultipleLogs: (logs: string[]) => void;
    addToInputHistory: (text: string) => void;
    updateSession: () => void;
    clearFinishedSession: () => void;
    clearSession: () => void;
    // internal helpers (not persisted)
    _ensureInstance?: () => GameSession | null;
    _persistInstance?: () => void;
}

let sessionInstance: GameSession | null = null;

const useSessionStore = create<SessionState>()(
    subscribeWithSelector(
    persist(
        (set, get) => ({
            data: null,

            // Create or return existing in-memory instance based on snapshot
            _ensureInstance: () => {
                if (sessionInstance) return sessionInstance;
                const snap = get().data as GameSessionSnapshot | null;
                if (!snap) return null;
                sessionInstance = new GameSession();
                sessionInstance.hydrateGameSession(snap);
                return sessionInstance;
            },

            _persistInstance: () => {
                if (!sessionInstance) return;
                const snap = sessionInstance.snapshot;
                set({ data: { ...snap, updatedAt: Date.now() } });
            },

            start: ({ level, duration }: { level: Difficulty; duration: number }) => {
                try {
                    sessionInstance = new GameSession();
                    sessionInstance.startGameSession(level, duration);
                    set({ data: { ...sessionInstance.snapshot, updatedAt: Date.now() } });
                } catch (error) {
                    console.error('Error starting session:', error);
                }
            },

            hydrate: (snap: GameSessionSnapshot) => {
                try {
                    // replace persisted snapshot and clear in-memory instance to force rehydrate on demand
                    sessionInstance = null;
                    set({ data: snap });
                } catch (error) {
                    console.error('Error hydrating session:', error);
                    sessionInstance = null;
                    set({ data: null });
                }
            },

            finish: (status: 'won' | 'lost' | 'expired') => {
                try {
                    const inst = get()._ensureInstance?.();
                    if (inst) {
                        inst.endGameSession(status);
                        get()._persistInstance?.();
                    } else {
                        // update snapshot status if no instance
                        const s = get().data as GameSessionSnapshot | null;
                        if (s) set({ data: { ...s, status, updatedAt: Date.now() } });
                    }
                } catch (error) {
                    console.error('Error finishing session:', error);
                }
            },

            addLog: (text: string) => {
                try {
                    const inst = get()._ensureInstance?.();
                    if (inst) {
                        inst.addLog(text);
                        get()._persistInstance?.();
                    }
                } catch (error) {
                    console.error('Error adding log:', error);
                }
            },

            addMultipleLogs: (logs: string[]) => {
                try {
                    const inst = get()._ensureInstance?.();
                    if (inst) {
                        logs.forEach((l) => inst.addLog(l));
                        get()._persistInstance?.();
                    }
                } catch (error) {
                    console.error('Error adding multiple logs:', error);
                }
            },

            addToInputHistory: (text: string) => {
                try {
                    const inst = get()._ensureInstance?.();
                    if (inst) {
                        inst.addToInputHistory(text);
                        get()._persistInstance?.();
                    }
                } catch (error) {
                    console.error('Error adding to input history:', error);
                }
            },

            updateSession: () => {
                try {
                    const inst = get()._ensureInstance?.();
                    if (inst) {
                        get()._persistInstance?.();
                    }
                } catch (error) {
                    console.error('Error updating session:', error);
                }
            },

            clearFinishedSession: () => {
                const s = get().data as GameSessionSnapshot | null;
                if (s && s.status !== 'active') {
                    sessionInstance = null;
                    set({ data: null });
                }
            },
            clearSession: () => {
                sessionInstance = null;
                set({ data: null });
            },
        }),
        {
            name: 'session-store',
            // mmkv adapter - cast to any to satisfy persist typing
            storage: mmkvStorage as any,
        }
    )
    )
);

export function getSession() {
    if (!sessionInstance) {
        const snap = useSessionStore.getState().data;
        if (!snap) throw new Error('No game session available');
        sessionInstance = new GameSession();
        sessionInstance.hydrateGameSession(snap);
    }
    return sessionInstance;
}

export default useSessionStore;
