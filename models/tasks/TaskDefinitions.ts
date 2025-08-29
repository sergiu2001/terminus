// TaskDefinitions.ts - Template definitions separated from logic
export interface TaskDefinition {
    id: string;
    ruleId: string;
    descriptionTemplate: string;
    params?: Record<string, any>;
}

export class TaskDefinitions {
    static readonly definitions: Record<string, TaskDefinition[]> = {
        basic: [
            {
                id: 'b1',
                ruleId: 'minLength',
                descriptionTemplate: 'The Codex Porta requires a sequence of at least {minLength} glyphs to authorize any further commands.'
            },
            {
                id: 'b2',
                ruleId: 'uppercaseGlyphs',
                descriptionTemplate: 'The Codex Porta requires a sequence of {count} uppercase glyphs to authorize any further commands.'
            },
            {
                id: 'b3',
                ruleId: 'specialGlyphs',
                descriptionTemplate: 'The Codex Porta requires a sequence of {count} special glyphs to authorize any further commands.'
            },
            {
                id: 'b4',
                ruleId: 'digitGlyphsSum',
                descriptionTemplate: 'The Codex Porta requires a sum of {sum} digit glyphs in the sequence to authorize any further commands.'
            },
            {
                id: 'b5',
                ruleId: 'lowercaseGlyphs',
                descriptionTemplate: 'The Codex Porta mandates a sequence containing exactly {count} lowercase glyphs to unlock further directives.'
            }
        ],
        intermediate: [
            {
                id: 'i1',
                ruleId: 'firstLastSame',
                descriptionTemplate: 'The Codex Porta insists that the first and last glyphs of the sequence match.'
            },
            {
                id: 'i2',
                ruleId: 'lengthIsPrime',
                descriptionTemplate: 'The Codex Porta only accepts sequences whose length is a prime number.'
            },
            {
                id: 'i3',
                ruleId: 'evenConsonants',
                descriptionTemplate: 'An even number of consonant glyphs is required by the Codex Porta.'
            },
            {
                id: 'i4',
                ruleId: 'containsSubstring',
                descriptionTemplate: 'The Codex Porta requires the sequence to include the sacred glyph pattern "{substring}".'
            }
        ],
        advanced: [
            {
                id: 'a1',
                ruleId: 'lengthIsPerfectSquare',
                descriptionTemplate: 'The Codex Porta only accepts sequences whose length is a perfect square.'
            },
            {
                id: 'a2',
                ruleId: 'evenUppercaseOddDigits',
                descriptionTemplate: 'The Codex Porta requires an even number of uppercase glyphs and an odd number of numerical glyphs in the sequence.'
            },
            {
                id: 'a3',
                ruleId: 'romanNumeralSum',
                descriptionTemplate: 'The Codex Porta demands the sum of the Roman numeral glyphs in the sequence to be exactly {sum}.'
            },
            {
                id: 'a4',
                ruleId: 'lengthIsFibonacci',
                descriptionTemplate: 'The Codex Porta only accepts sequences whose length is a Fibonacci number.'
            }
        ]
    };

    static getDefinitionsForCategory(category: string): TaskDefinition[] {
        return this.definitions[category] || [];
    }

    static getAllDefinitions(): TaskDefinition[] {
        return Object.values(this.definitions).flat();
    }
}