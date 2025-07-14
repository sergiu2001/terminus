import { Difficulty } from '@/models/Contract';
import { GameSessionSnapshot } from '@/models/gameTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameSession } from '../../models/gameSession';

const session = new GameSession();

export interface SessionState { 
    data: GameSessionSnapshot | null;
}

const initialState: SessionState = { data: null };

const slice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        start: (s, a: PayloadAction<{ level: Difficulty; duration: number }>) => {
            session.start(a.payload.level, a.payload.duration);
            s.data = session.snapshot;
        },
        hydrate: (s, a: PayloadAction<GameSessionSnapshot>) => {
            session.hydrate(a.payload);
            s.data = session.snapshot;
        },
        finish: (s, a: PayloadAction<'won' | 'lost' | 'expired'>) => {
            session.finish(a.payload);
            s.data = session.snapshot;
        },
    },
});

export const { start, hydrate, finish } = slice.actions;
export default slice.reducer;

export const getSession = () => session;
