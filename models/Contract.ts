// models/Contract.ts
import { ContractSnapshot } from './GameTypes';
import { Task } from './tasks/Task';
import { TaskFactory } from './tasks/TaskFactory';

export type Difficulty = 'easy' | 'medium' | 'hard';

export class Contract {
    tasks: Task[];
    currentTaskIndex: number;
    createdAt: Date;
    expirationTime: number;
    difficulty: Difficulty;

    constructor(difficulty: Difficulty, expirationTime: number = 24 * 60 * 60 * 1000) {
        this.tasks = TaskFactory.createTasksForDifficulty(difficulty);
        this.currentTaskIndex = 0;
        this.createdAt = new Date();
        this.expirationTime = expirationTime;
        this.difficulty = difficulty;
    }

    // Create contract from snapshot
    static fromSnapshot(snapshot: ContractSnapshot): Contract {
        const contract = new Contract(snapshot.difficulty, snapshot.expirationTime);
        contract.currentTaskIndex = snapshot.currentTaskIndex;
        contract.createdAt = new Date(snapshot.createdAt);
        // Restore tasks from snapshot
        contract.tasks = snapshot.tasks.map(taskSnapshot => Task.fromSnapshot(taskSnapshot));
        return contract;
    }

    // Create snapshot for persistence
    toSnapshot(): ContractSnapshot {
        return {
            difficulty: this.difficulty,
            currentTaskIndex: this.currentTaskIndex,
            createdAt: this.createdAt.getTime(),
            expirationTime: this.expirationTime,
            tasks: this.tasks.map(task => task.toSnapshot())
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

    isCurentTaskCompleted(): boolean {
        return this.tasks[this.currentTaskIndex].isCompletion() === 1;
    }
}