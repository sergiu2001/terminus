import { Difficulty } from '@/models/Contract';
import { GameSession } from '@/models/GameSession';
import { GameSessionSnapshot } from '@/models/GameTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';

let session: GameSession | null = null;

export const checkStorage = async () => {
    try {
        const storedData = await ExpoFileSystemStorage.getItem('persist:root');
        console.log('Raw persisted data:', storedData);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log('Parsed storage data:', parsedData);
        }
    } catch (error) {
        console.error('Error reading storage:', error);
    }
};

export interface SessionState {
    data: GameSessionSnapshot | null;
}

const initialState: SessionState = { data: null };

const slice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        start: (s, a: PayloadAction<{ level: Difficulty; duration: number }>) => {
            try {
                session = new GameSession();
                session.startGameSession(a.payload.level, a.payload.duration);
                s.data = session.snapshot;
            } catch (error) {
                console.error('Error starting session:', error);
            }
        },
        hydrate: (s, a: PayloadAction<GameSessionSnapshot>) => {
            try {
                session = new GameSession();
                session.hydrateGameSession(a.payload);
                s.data = session.snapshot;
            } catch (error) {
                console.error('Error hydrating session:', error);
                s.data = null;
                session = null;
            }
        },
        finish: (s, a: PayloadAction<'won' | 'lost' | 'expired'>) => {
            try {
                if (session && s.data && s.data.status === 'active') {
                    session.endGameSession(a.payload);
                    s.data = session.snapshot;
                }
            } catch (error) {
                console.error('Error finishing session:', error);
                if (s.data) {
                    s.data = { ...s.data, status: a.payload };
                }
            }
        },
        addLog: (s, a: PayloadAction<string>) => {
            try {
                if (session && s.data) {
                    session.addLog(a.payload);
                    s.data = session.snapshot;
                }
            } catch (error) {
                console.error('Error adding log:', error);
            }
        },
        addMultipleLogs: (s, a: PayloadAction<string[]>) => {
            try {
                if (session && s.data) {
                    a.payload.forEach(log => session?.addLog(log));
                    s.data = session.snapshot;
                }
            } catch (error) {
                console.error('Error adding multiple logs:', error);
            }
        },
        addToInputHistory: (s, a: PayloadAction<string>) => {
            try {
                if (session && s.data) {
                    session.addToInputHistory(a.payload);
                    s.data = session.snapshot;
                }
            } catch (error) {
                console.error('Error adding to input history:', error);
            }
        },
        updateSession: (s) => {
            try {
                if (session && s.data) {
                    s.data = session.snapshot;
                }
            } catch (error) {
                console.error('Error updating session:', error);
            }
        },
        clearFinishedSession: (s) => {
            if (s.data && s.data.status !== 'active') {
                session = null;
                s.data = null;
            }
        }
    },
});

export const { start, hydrate, finish, addLog, addMultipleLogs, addToInputHistory, updateSession, clearFinishedSession } = slice.actions;
export default slice.reducer;

export const getSession = () => {
    if (!session) {
        throw new Error('No game session available');
    }
    return session;
};