import type { GameSessionSnapshot, IGameSession } from '@/models/GameTypes';
import { nanoid } from 'nanoid';
import { Contract, Difficulty } from './Contract';


const MAX_HISTORY = 50;
const MAX_LOGS = 100;

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
            logs: ['Game Session started.'],
            inputHistory: []
        };
    }

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

    timeLeft() {
        return Math.max(0, this._snap.endsAt - Date.now());
    }

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

    advanceTask() {
        if (this._contract.currentTaskIndex < this._contract.tasks.length - 1) {
            this._contract.currentTaskIndex++;
            // Update snapshot after advancing task
            this._snap = { ...this._snap, contract: this._contract.toSnapshot() };
            return true;
        }
        return false;
    }

    allTasksCompleted(): boolean {
        return this._contract.currentTaskIndex === this._contract.tasks.length - 1 &&
            this._contract.isCurrentTaskCompleted();
    }

    addLog(log: string) {
        const newLogs = [...this._snap.logs, log];
        // Keep only the most recent logs to prevent memory issues
        if (newLogs.length > MAX_LOGS) {
            newLogs.splice(0, newLogs.length - MAX_LOGS);
        }
        this._snap = { ...this._snap, logs: newLogs };
    }

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