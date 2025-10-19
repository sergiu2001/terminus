import type { GameSessionSnapshot, IGameSession } from '@/models/GameTypes';
import { nanoid } from 'nanoid';
import { Contract, Difficulty } from './Contract';


const MAX_HISTORY = 50;
const MAX_LOGS = 100;

/**
 * GameSession
 * - Manages an in-memory Contract and a serializable snapshot for persistence.
 * - Provides lifecycle operations: start, hydrate, validate input, advance,
 *   finish, and maintains logs/history with size caps.
 */
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

    /** Start a new session with the given difficulty and duration (ms). */
    startGameSession(level: Difficulty, durationMs: number) {
        const now = Date.now();
        // Generate a reproducible seed per session/contract
        const seed = nanoid();
        this._contract = new Contract(level, durationMs, seed);
        this._snap = {
            id: nanoid(),
            level,
            startedAt: now,
            endsAt: now + durationMs,
            status: 'active',
            contract: this._contract.toSnapshot(),
            logs: [
                'Game Session started.',
                `Seed: ${seed}`
            ],
            inputHistory: []
        };
    }

    /** Hydrate this instance from a snapshot (e.g., loaded from storage/remote). */
    hydrateGameSession(data: GameSessionSnapshot) {
        this._snap = {
            ...data,
            // Ensure logs and inputHistory exist for backwards compatibility
            logs: data.logs || ['Game Session started.'],
            inputHistory: data.inputHistory || []
        };
        // Restore contract from snapshot instead of creating new one
        this._contract = Contract.fromSnapshot(data.contract);
    }

    /** Finalize current session and append a terminal log message. */
    endGameSession(result: 'won' | 'lost' | 'expired') {
        this._snap = {
            ...this._snap,
            status: result,
            contract: this._contract.toSnapshot() // Update contract snapshot
        };
        
        // Add final log message
        const finalMessage = result === 'won' ? 'Mission completed successfully!' : 
                            result === 'lost' ? 'Mission failed.' : 
                            'Session expired. Game over.';
        this.addLog(finalMessage);
    }

    /** Milliseconds remaining until `endsAt` (never negative). */
    timeLeft() {
        return Math.max(0, this._snap.endsAt - Date.now());
    }

    /** Validate user input for the current task, persisting its completion state. */
    validateInput(input: string): boolean {
        const currentTask = this._contract.tasks[this._contract.currentTaskIndex];
        if (currentTask) {
            const result = this._contract.validateTask(currentTask, input).isCompletion() === 1;
            // Update snapshot after validation
            this._snap = { ...this._snap, contract: this._contract.toSnapshot() };
            return result;
        }
        return false;
    }

    /** Advance to next task if available, persisting the new contract snapshot. */
    advanceTask() {
        if (this._contract.currentTaskIndex < this._contract.tasks.length - 1) {
            this._contract.currentTaskIndex++;
            // Update snapshot after advancing task
            this._snap = { ...this._snap, contract: this._contract.toSnapshot() };
            return true;
        }
        return false;
    }

    /** True when at the last task and it is completed. */
    allTasksCompleted(): boolean {
        return this._contract.currentTaskIndex === this._contract.tasks.length - 1 &&
            this._contract.isCurrentTaskCompleted();
    }

    /** Append a log entry, trimming to a max size to prevent unbounded growth. */
    addLog(log: string) {
        const newLogs = [...this._snap.logs, log];
        // Keep only the most recent logs to prevent memory issues
        if (newLogs.length > MAX_LOGS) {
            newLogs.splice(0, newLogs.length - MAX_LOGS);
        }
        this._snap = { ...this._snap, logs: newLogs };
    }

    /** Prepend input to history, trimming to max size. Empty strings ignored. */
    addToInputHistory(input: string) {
        if (input.trim() === "") return;
        
        const newHistory = [input, ...this._snap.inputHistory];
        // Keep only the most recent history entries
        if (newHistory.length > MAX_HISTORY) {
            newHistory.splice(MAX_HISTORY);
        }
        this._snap = { ...this._snap, inputHistory: newHistory };
    }

    toJSON() {
    return { ...this._snap, updatedAt: Date.now() };
    }
}
 