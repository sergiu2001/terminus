import { Difficulty } from '../Contract';
import { Task } from './Task';
import { TaskDefinitions } from './TaskDefinitions';

/**
 * TaskFactory
 * - Provides two ways to create tasks:
 *   1) createTasksForSeed: deterministic using (difficulty, seed, genVersion)
 *   2) createTasksForDifficulty: non-deterministic using Math.random
 * - The deterministic path uses Mulberry32 PRNG seeded via a djb2-like hash.
 */

// Simple deterministic PRNG (Mulberry32) for reproducible randomness from a seed
// Source: Public domain implementation
function mulberry32(seed: number) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hashStringToInt(str: string): number {
    // djb2-like hash
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) + h) + str.charCodeAt(i);
        h |= 0; // 32-bit
    }
    return h >>> 0; // ensure unsigned
}

export class TaskFactory {
    static createTasksForSeed(difficulty: Difficulty, seed: string, genVersion = 1): Task[] {
        // genVersion can switch algorithm in future; for now, single path
        const rand = mulberry32(hashStringToInt(`${genVersion}:${difficulty}:${seed}`));

        const basicTasks = TaskDefinitions.getDefinitionsForCategory('basic');
        const intermediateTasks = TaskDefinitions.getDefinitionsForCategory('intermediate');
        const advancedTasks = TaskDefinitions.getDefinitionsForCategory('advanced');

    // Helpers using deterministic rand
        const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length) % arr.length];
        const shuffle = <T,>(arr: T[]): T[] => {
            const a = arr.slice();
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(rand() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        };

        switch (difficulty) {
            case 'easy': {
                const sum = Math.floor(rand() * 16) + 10; // 10..25
                const tasks = [
                    new Task(basicTasks.find(t => t.ruleId === 'minLength')!, { minLength: 3 }),
                    new Task(basicTasks.find(t => t.ruleId === 'uppercaseGlyphs')!, { count: 1 }),
                    new Task(basicTasks.find(t => t.ruleId === 'specialGlyphs')!, { count: 1 }),
                    new Task(basicTasks.find(t => t.ruleId === 'digitGlyphsSum')!, { sum })
                ];
                return shuffle(tasks);
            }
            case 'medium': {
                const substring = rand() > 0.5 ? 'XY' : 'AB';
                const tasks = [
                    new Task(basicTasks.find(t => t.ruleId === 'minLength')!, { minLength: 7 }),
                    new Task(basicTasks.find(t => t.ruleId === 'uppercaseGlyphs')!, { count: 2 }),
                    new Task(basicTasks.find(t => t.ruleId === 'specialGlyphs')!, { count: 2 }),
                    new Task(pick(intermediateTasks), { substring })
                ];
                return shuffle(tasks);
            }
            case 'hard': {
                const sum = Math.floor(rand() * 50) + 10; // 10..59
                const tasks = [
                    new Task(basicTasks.find(t => t.ruleId === 'minLength')!, { minLength: 9 }),
                    new Task(basicTasks.find(t => t.ruleId === 'uppercaseGlyphs')!, { count: 3 }),
                    new Task(advancedTasks.find(t => t.ruleId === 'evenUppercaseOddDigits')!),
                    new Task(advancedTasks.find(t => t.ruleId === 'romanNumeralSum')!, { sum })
                ];
                return shuffle(tasks);
            }
            default:
                return [];
        }
    }

    static createTasksForDifficulty(difficulty: Difficulty): Task[] {
        const basicTasks = TaskDefinitions.getDefinitionsForCategory('basic');

        switch (difficulty) {
            case 'easy':
                return [
                    new Task(basicTasks.find(t => t.ruleId === 'minLength')!, { minLength: 3 }),
                    new Task(basicTasks.find(t => t.ruleId === 'uppercaseGlyphs')!, { count: 1 }),
                    new Task(basicTasks.find(t => t.ruleId === 'specialGlyphs')!, { count: 1 }),
                    new Task(basicTasks.find(t => t.ruleId === 'digitGlyphsSum')!, {
                        sum: Math.floor(Math.random() * 16) + 10
                    })
                ].sort(() => Math.random() - 0.5);

            case 'medium':
                const intermediateTasks = TaskDefinitions.getDefinitionsForCategory('intermediate');
                return [
                    new Task(basicTasks.find(t => t.ruleId === 'minLength')!, { minLength: 7 }),
                    new Task(basicTasks.find(t => t.ruleId === 'uppercaseGlyphs')!, { count: 2 }),
                    new Task(basicTasks.find(t => t.ruleId === 'specialGlyphs')!, { count: 2 }),
                    new Task(intermediateTasks[Math.floor(Math.random() * intermediateTasks.length)], {
                        substring: Math.random() > 0.5 ? 'XY' : 'AB' // For containsSubstring rule
                    })
                ].sort(() => Math.random() - 0.5);

            case 'hard':
                const advancedTasks = TaskDefinitions.getDefinitionsForCategory('advanced');
                return [
                    new Task(basicTasks.find(t => t.ruleId === 'minLength')!, { minLength: 9 }),
                    new Task(basicTasks.find(t => t.ruleId === 'uppercaseGlyphs')!, { count: 3 }),
                    new Task(advancedTasks.find(t => t.ruleId === 'evenUppercaseOddDigits')!),
                    new Task(advancedTasks.find(t => t.ruleId === 'romanNumeralSum')!, {
                        sum: Math.floor(Math.random() * 50) + 10
                    })
                ].sort(() => Math.random() - 0.5);

            default:
                return [];
        }
    }

    // Helper method to create custom task combinations
    static createCustomTasks(taskIds: string[], params: Record<string, Record<string, any>> = {}): Task[] {
        const allDefinitions = TaskDefinitions.getAllDefinitions();

        return taskIds.map(id => {
            const definition = allDefinitions.find(def => def.id === id);
            if (!definition) {
                throw new Error(`Task definition '${id}' not found`);
            }
            return new Task(definition, params[id] || {});
        });
    }
}