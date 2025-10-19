// models/Contract.ts
import { ContractSnapshot } from './GameTypes';
import { Task } from './tasks/Task';
import { TaskFactory } from './tasks/TaskFactory';

export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Contract
 * - A sequence of Tasks generated for a given difficulty.
 * - When `seed` is present, tasks (their order and parameters) are generated
 *   deterministically so the contract can be recreated later (with `genVersion`).
 * - When hydrating from a snapshot, we merge completion state (and stable
 *   description/params) onto regenerated tasks to preserve progress.
 */
export class Contract {
    tasks: Task[];
    currentTaskIndex: number;
    createdAt: Date;
    expirationTime: number;
    difficulty: Difficulty;
    seed?: string;
    genVersion: number;

    constructor(difficulty: Difficulty, expirationTime: number = 24 * 60 * 60 * 1000, seed?: string, genVersion = 1) {
        this.seed = seed;
        this.genVersion = genVersion;
        this.tasks = seed
            ? TaskFactory.createTasksForSeed(difficulty, seed, genVersion)
            : TaskFactory.createTasksForDifficulty(difficulty);
        this.currentTaskIndex = 0;
        this.createdAt = new Date();
        this.expirationTime = expirationTime;
        this.difficulty = difficulty;
    }

    /** Create a Contract from a snapshot, regenerating from seed if present. */
    static fromSnapshot(snapshot: ContractSnapshot): Contract {
        const contract = new Contract(
            snapshot.difficulty,
            snapshot.expirationTime,
            snapshot.seed,
            snapshot.genVersion ?? 1
        );
        contract.currentTaskIndex = snapshot.currentTaskIndex;
        contract.createdAt = new Date(snapshot.createdAt);

    // If tasks are provided in snapshot, merge completion state and any
    // persisted description/params with regenerated structure.
        if (snapshot.tasks && snapshot.tasks.length > 0) {
            // Map regenerated tasks by id for merge
            const byId = new Map(contract.tasks.map(t => [t.id, t] as const));
            for (const snapTask of snapshot.tasks) {
                const t = byId.get(snapTask.id);
                if (t) {
                    t.completed = snapTask.completed;
                    // Keep snapshot description if provided, to avoid text drift
                    if (snapTask.description) t.description = snapTask.description;
                    // Also keep params to reflect exact target values
                    if (snapTask.params) t.params = snapTask.params;
                }
            }
        } else if (!snapshot.seed) {
            // Legacy: no seed, rely entirely on provided tasks
            // For backward compatibility, if no seed and tasks exists, construct from them
            // (this path triggers only when older snapshot format without seed provided tasks)
            // Note: This else-if will only run if tasks were not provided above and seed missing
        }
        
        // If snapshot includes explicit tasks but we didn't merge (no seed), fully restore
        if (!snapshot.seed && snapshot.tasks && snapshot.tasks.length > 0) {
            contract.tasks = snapshot.tasks.map(taskSnapshot => Task.fromSnapshot(taskSnapshot));
        }
        return contract;
    }

    /** Create a snapshot for persistence. */
    toSnapshot(): ContractSnapshot {
        return {
            difficulty: this.difficulty,
            currentTaskIndex: this.currentTaskIndex,
            createdAt: this.createdAt.getTime(),
            expirationTime: this.expirationTime,
            // Store tasks to track progress and keep readable state, but with seed
            // present we can always regenerate structure deterministically.
            tasks: this.tasks.map(task => task.toSnapshot()),
            seed: this.seed,
            genVersion: this.genVersion,
        };
    }

    isExpired(): boolean {
        const now = new Date().getTime();
        return now > this.createdAt.getTime() + this.expirationTime;
    }

    validateTask(task: Task, input: string): Task {
        if (task.validate(input)) {
            task.markCompleted();
        } else {
            task.resetCompletion();
        }
        return task;
    }

    isCurrentTaskCompleted(): boolean {
        return this.tasks[this.currentTaskIndex].isCompletion() === 1;
    }
}