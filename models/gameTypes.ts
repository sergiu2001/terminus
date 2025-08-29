import { Difficulty } from './Contract';

export interface TaskSnapshot {
    id: string;
    ruleId: string;
    descriptionTemplate: string;
    description: string;
    regex?: string;
    completed: number;
    params: Record<string, any>;
}

export interface ContractSnapshot {
    difficulty: Difficulty;
    currentTaskIndex: number;
    createdAt: number;
    expirationTime: number;
    tasks: TaskSnapshot[];
}

export interface GameSessionSnapshot {
    id: string;
    level: Difficulty;
    startedAt: number;
    endsAt: number;
    status: 'active' | 'won' | 'lost' | 'expired';
    contract: ContractSnapshot;
    logs: string[];
    inputHistory: string[];
}

export interface IGameSession {
    readonly snapshot: GameSessionSnapshot;
    startGameSession(level: Difficulty, durationMs: number): void;
    hydrateGameSession(data: GameSessionSnapshot): void;
    endGameSession(result: 'won' | 'lost' | 'expired'): void;
    timeLeft(): number;
    addLog(log: string): void;
    addToInputHistory(input: string): void;
    toJSON(): GameSessionSnapshot;
}