import { Difficulty } from './Contract';

export interface GameSessionSnapshot {
    id: string;
    level: Difficulty;
    startedAt: number;
    endsAt: number;
    status: 'active' | 'won' | 'lost' | 'expired';
}

export interface IGameSession {
    readonly snapshot: GameSessionSnapshot;
    start(level: Difficulty, durationMs: number): void;
    hydrate(data: GameSessionSnapshot): void;
    finish(result: 'won' | 'lost' | 'expired'): void;
    timeLeft(): number;
    toJSON(): GameSessionSnapshot;
}
