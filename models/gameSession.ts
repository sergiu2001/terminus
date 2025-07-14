import { customAlphabet } from 'nanoid/non-secure';
import { Contract, Difficulty } from './Contract';
import type { GameSessionSnapshot, IGameSession } from './gameTypes';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

export class GameSession implements IGameSession {
    private _snap!: GameSessionSnapshot;
    private _contract!: Contract;

    get snapshot() {
        if (!this._snap) throw new Error('no session');
        return this._snap;
    }

    get contract() {
        if (!this._contract) throw new Error('no contract');
        return this._contract;
    }

    start(level: Difficulty, durationMs: number) {
        const now = Date.now();
        this._snap = {
            id: nanoid(),
            level,
            startedAt: now,
            endsAt: now + durationMs,
            status: 'active',
        };
        this._contract = new Contract(level, durationMs);
    }

    hydrate(data: GameSessionSnapshot) {
        this._snap = data;
        if (!this._contract) {
            this._contract = new Contract(data.level, data.endsAt - data.startedAt);
        }
    }

    finish(result: 'won' | 'lost' | 'expired') {
        this._snap = { ...this._snap, status: result };
    }

    timeLeft() {
        return Math.max(0, this._snap.endsAt - Date.now());
    }

    validateInput(input: string): boolean {
        const currentTask = this._contract.tasks[this._contract.currentTaskIndex];
        if (currentTask) {
            return this._contract.validateTask(currentTask, input).isCompletion() === 1;
        }
        return false;
    }

    advanceTask() {
        if (this._contract.currentTaskIndex < this._contract.tasks.length - 1) {
            this._contract.currentTaskIndex++;
            return true;
        }
        return false;
    }

    allTasksCompleted(): boolean {
        return this._contract.currentTaskIndex === this._contract.tasks.length - 1 && 
               this._contract.isCurentTaskCompleted();
    }

    toJSON() {
        return this._snap;
    }
}
