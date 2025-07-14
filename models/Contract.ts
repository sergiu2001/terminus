// models/Contract.ts
import { Task } from './Task';
import { TaskFactory } from './TaskFactory';

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

    isExpired(): boolean {
        const now = new Date().getTime();
        return now > this.createdAt.getTime() + this.expirationTime;
    }

    validateTask(task: Task, input: string): Task {
        if (task.validate(input)) {
            task.markCompleted();
        }else {
            task.resetCompletion();
        }
        return task;
    }
    isCurentTaskCompleted(): boolean {
        return this.tasks[this.currentTaskIndex].isCompletion() === 1;
    }
}