export class Task {
    id: string;
    descriptionTemplate: string;
    description: string;
    regex: string;
    rule: (input: string) => boolean;
    completed: number;
    params: { [key: string]: string | number };

    constructor(
        id: string,
        descriptionTemplate: string,
        rule: (input: string) => boolean,
        params: { [key: string]: string | number } = {},
        regex: string = '',
    ) {
        this.id = id;
        this.descriptionTemplate = descriptionTemplate;
        this.rule = rule;
        this.completed = 0;
        this.params = params;
        this.description = this.interpolateDescription(descriptionTemplate, params);
        this.regex = regex;
    }

    interpolateDescription(template: string, params: { [key: string]: string | number }): string {
        return template.replace(/{(\w+)}/g, (_, key) => String(params[key] || ''));
    }

    isCompletion(): number {
        return this.completed;
    }

    validate(input: string): boolean {
        return this.rule(input);
    }

    markCompleted(): void {
        this.completed = 1;
    }

    resetCompletion(): void {
        this.completed = 2;
    }
    getRule(): string {
        return this.regex;
    }
}