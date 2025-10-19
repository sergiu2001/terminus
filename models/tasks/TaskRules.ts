// TaskRules.ts - Centralized rule definitions
// Notes:
// - `regex` fields are optional and intended for display/hint purposes only.
//   Validation always uses the `validate` function; consumers should not parse
//   `regex` unless they explicitly handle it as a plain string.
export interface TaskRule {
    id: string;
    validate: (input: string, params?: Record<string, any>) => boolean;
    regex?: string;
}

export class TaskRules {
    private static rules = new Map<string, TaskRule>();

    static {
        // Register all rules
        this.registerRule({
            id: 'minLength',
            validate: (input: string, params = {}) => input.length >= (params.minLength || 0)
        });

        this.registerRule({
            id: 'uppercaseGlyphs',
            validate: (input: string, params = {}) =>
                (input.match(/[A-Z]/g)?.length || 0) === (params.count || 0),
            regex: '/[A-Z]/g'
        });

        this.registerRule({
            id: 'specialGlyphs',
            validate: (input: string, params = {}) =>
                (input.match(/[!@#$%^&*(),.?":{}|<>]/g)?.length || 0) === (params.count || 0),
            regex: '/[!@#$%^&*(),.?":{}|<>]/g'
        });

        this.registerRule({
            id: 'digitGlyphsSum',
            validate: (input: string, params = {}) => {
                const sum = input.match(/\d/g)?.reduce((acc, digit) => acc + parseInt(digit, 10), 0) || 0;
                return sum === (params.sum || 0);
            },
            regex: '/\d/g'
        });

        this.registerRule({
            id: 'lowercaseGlyphs',
            validate: (input: string, params = {}) =>
                (input.match(/[a-z]/g)?.length || 0) === (params.count || 0),
            regex: '/[a-z]/g'
        });

        this.registerRule({
            id: 'atLeastXDigits',
            validate: (input: string, params = {}) => {
                const digitCount = input.match(/\d/g)?.length || 0;
                return digitCount >= (params.count || 0);
            },
            regex: '/\d/'
        });

        this.registerRule({
            id: 'lengthDivisibleBy',
            validate: (input: string, params = {}) =>
                input.length % (params.divisor || 1) === 0
        });

        this.registerRule({
            id: 'minUniqueGlyphs',
            validate: (input: string, params = {}) => {
                const uniqueGlyphs = new Set(input.split(''));
                return uniqueGlyphs.size >= (params.count || 0);
            }
        });

        this.registerRule({
            id: 'firstLastSame',
            validate: (input: string) =>
                input.length > 0 && input[0] === input[input.length - 1]
        });

        this.registerRule({
            id: 'lengthIsPrime',
            validate: (input: string) => {
                const n = input.length;
                if (n < 2) return false;
                for (let i = 2; i <= Math.sqrt(n); i++) {
                    if (n % i === 0) return false;
                }
                return true;
            }
        });

        this.registerRule({
            id: 'evenConsonants',
            validate: (input: string) => {
                const consonantsCount = (input.match(/[^aeiouAEIOU\d\s\W]/g) || []).length;
                return consonantsCount % 2 === 0;
            }
        });

        this.registerRule({
            id: 'containsSubstring',
            validate: (input: string, params = {}) =>
                input.includes(params.substring || '')
        });

        this.registerRule({
            id: 'digitGlyphsSumMultiple',
            validate: (input: string, params = {}) => {
                const sum = (input.match(/\d/g) || []).reduce((acc, digit) => acc + parseInt(digit, 10), 0);
                return sum % (params.multiple || 1) === 0;
            }
        });

        this.registerRule({
            id: 'startDigitEndSpecial',
            validate: (input: string) => /^\d.*[!@#$%^&*(),.?":{}|<>]$/.test(input),
            regex: '/^\\d.*[!@#$%^&*(),.?":{}|<>]$/'
        });

        this.registerRule({
            id: 'moreVowelsThanConsonants',
            validate: (input: string) => {
                const vowelCount = (input.match(/[aeiouAEIOU]/g) || []).length;
                const consonantCount = (input.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
                return vowelCount > consonantCount;
            }
        });

        this.registerRule({
            id: 'lengthIsPerfectSquare',
            validate: (input: string) => {
                const length = input.length;
                return Number.isInteger(Math.sqrt(length));
            }
        });

        this.registerRule({
            id: 'minDifferentSpecialGlyphs',
            validate: (input: string, params = {}) => {
                const specialGlyphs = input.match(/[!@#$%^&*(),.?":{}|<>]/g) || [];
                const uniqueSpecialGlyphs = new Set(specialGlyphs);
                return uniqueSpecialGlyphs.size >= (params.count || 0);
            },
            regex: '/[!@#$%^&*(),.?":{}|<>]/g'
        });

        this.registerRule({
            id: 'evenUppercaseOddDigits',
            validate: (input: string) => {
                const uppercaseCount = (input.match(/[A-Z]/g) || []).length;
                const digitCount = (input.match(/\d/g) || []).length;
                return uppercaseCount % 2 === 0 && digitCount % 2 === 1;
            }
        });

        this.registerRule({
            id: 'moreConsonantsThanVowels',
            validate: (input: string) => {
                const vowelCount = (input.match(/[aeiouAEIOU]/g) || []).length;
                const consonantCount = (input.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
                return consonantCount > vowelCount;
            }
        });

        this.registerRule({
            id: 'romanNumeralSum',
            validate: (input: string, params = {}) => {
                const romanNumerals: { [key: string]: number } = {
                    'I': 1, 'V': 5, 'X': 10, 'L': 50,
                    'C': 100, 'D': 500, 'M': 1000
                };
                const numerals = input.toUpperCase().split('').filter(char => romanNumerals.hasOwnProperty(char));
                const total = numerals.reduce((acc, char) => acc + romanNumerals[char], 0);
                return total === (params.sum || 0);
            }
        });

        this.registerRule({
            id: 'lengthIsFibonacci',
            validate: (input: string) => {
                const isFibonacci = (n: number): boolean => {
                    const isPerfectSquare = (x: number): boolean => {
                        const s = Math.sqrt(x);
                        return s === Math.floor(s);
                    };
                    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
                };
                return isFibonacci(input.length);
            }
        });
    }

    static registerRule(rule: TaskRule): void {
        this.rules.set(rule.id, rule);
    }

    static getRule(id: string): TaskRule | undefined {
        return this.rules.get(id);
    }

    static validate(ruleId: string, input: string, params?: Record<string, any>): boolean {
        const rule = this.getRule(ruleId);
        if (!rule) {
            console.warn(`Rule '${ruleId}' not found`);
            return false;
        }
        return rule.validate(input, params);
    }
}