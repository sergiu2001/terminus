import { Difficulty } from '../Contract';
import { Task } from './Task';
import { TaskDefinitions } from './TaskDefinitions';

export class TaskFactory {
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