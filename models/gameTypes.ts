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
    // Optional list of task snapshots. When a seed is present, tasks can be
    // deterministically regenerated. If provided, we use them to merge progress
    // (e.g., completion states) on top of regenerated tasks for forward/back compat.
    tasks?: TaskSnapshot[];
    // Seed used to deterministically generate the contract tasks and parameters
    // so contracts can be recreated exactly later.
    seed?: string;
    // Generation algorithm version, in case future breaking changes are needed.
    genVersion?: number;
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
    updatedAt?: number;
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