import { TaskSnapshot } from "../GameTypes";
import { TaskDefinition } from "./TaskDefinitions";
import { TaskRules } from "./TaskRules";

/**
 * Task
 * - Represents a single rule-based step in a contract.
 * - `completed` uses numeric states for persistence/back-compat:
 *   0 = pending, 1 = completed, 2 = failed (attempted but invalid)
 * - `descriptionTemplate` is interpolated with `params` to produce `description`.
 */

export class Task {
    id: string;
    ruleId: string;
    descriptionTemplate: string;
    description: string;
    regex?: string;
    completed: number;
    params: Record<string, any>;

    /** Create a task from a definition plus optional param overrides. */
    constructor(definition: TaskDefinition, params: Record<string, any> = {}) {
        this.id = definition.id;
        this.ruleId = definition.ruleId;
        this.descriptionTemplate = definition.descriptionTemplate;
        this.completed = 0;
        this.params = { ...definition.params, ...params };
        this.description = this.interpolateDescription(this.descriptionTemplate, this.params);

        const rule = TaskRules.getRule(this.ruleId);
        this.regex = rule?.regex || '';
    }

    /** Recreate a task from a serializable snapshot. */
    static fromSnapshot(snapshot: TaskSnapshot): Task {
        const definition: TaskDefinition = {
            id: snapshot.id,
            ruleId: snapshot.ruleId,
            descriptionTemplate: snapshot.descriptionTemplate,
            params: snapshot.params
        };

        const task = new Task(definition, snapshot.params);
        task.completed = snapshot.completed;
        task.description = snapshot.description;
        return task;
    }

    /** Convert to a serializable snapshot for persistence. */
    toSnapshot(): TaskSnapshot {
        return {
            id: this.id,
            ruleId: this.ruleId,
            descriptionTemplate: this.descriptionTemplate,
            description: this.description,
            regex: this.regex,
            completed: this.completed,
            params: this.params
        };
    }

    /** Replace {key} placeholders in the template with param values. */
    private interpolateDescription(template: string, params: Record<string, any>): string {
        return template.replace(/{(\w+)}/g, (_, key) => String(params[key] || ''));
    }

    /** Validate `input` using the rule referenced by `ruleId` and `params`. */
    validate(input: string): boolean {
        return TaskRules.validate(this.ruleId, input, this.params);
    }

    /** Numeric completion getter retained for existing code. */
    isCompletion(): number { return this.completed; }

    /** Mark this task as successfully completed. */
    markCompleted(): void { this.completed = 1; }

    /** Mark this task as failed (attempted but invalid). */
    resetCompletion(): void { this.completed = 2; }

    /** Return the regex string (if provided) as a display hint only. */
    getRule(): string { return this.regex || ''; }
}