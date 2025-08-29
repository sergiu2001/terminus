import { TaskSnapshot } from "../GameTypes";
import { TaskDefinition } from "./TaskDefinitions";
import { TaskRules } from "./TaskRules";

export class Task {
    id: string;
    ruleId: string;
    descriptionTemplate: string;
    description: string;
    regex?: string;
    completed: number;
    params: Record<string, any>;

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

    private interpolateDescription(template: string, params: Record<string, any>): string {
        return template.replace(/{(\w+)}/g, (_, key) => String(params[key] || ''));
    }

    validate(input: string): boolean {
        return TaskRules.validate(this.ruleId, input, this.params);
    }

    isCompletion(): number {
        return this.completed;
    }

    markCompleted(): void {
        this.completed = 1;
    }

    resetCompletion(): void {
        this.completed = 2;
    }

    getRule(): string {
        return this.regex || '';
    }
}