import { Difficulty } from './Contract';
import { Task } from './Task';

export class TaskFactory {

    static taskMinLength(length: number): Task {
        return new Task(
            'b1',
            'The Codex Porta requires a sequence of at least {minLength} glyphs to authorize any further commands.',
            (input: string) => input.length >= length,
            { minLength: length },
        );
    }

    static taskUppercaseGlyphs(count: number): Task {
        return new Task(
            'b2',
            'The Codex Porta requires a sequence of {uppercaseGlyphsCount} uppercase glyphs to authorize any further commands.',
            (input: string) => input.match(/[A-Z]/g)?.length === count,
            { uppercaseGlyphsCount: count },
            '/[A-Z]/g'
        );
    }

    static taskSpecialGlyphs(count: number): Task {
        return new Task(
            'b3',
            'The Codex Porta requires a sequence of {specialGlyphsCount} special glyphs to authorize any further commands.',
            (input: string) => input.match(/[!@#$%^&*(),.?":{}|<>]/g)?.length === count,
            { specialGlyphsCount: count },
            '/[!@#$%^&*(),.?":{}|<>]/g'
        );
    }

    static taskDigitGlyphsSum(sum: number): Task {
        return new Task(
            'b4',
            'The Codex Porta requires a sum of {digitGlyphsSum} digit glyphs in the sequence to authorize any further commands.',
            (input: string) => input.match(/\d/g)?.reduce((acc, digit) => acc + parseInt(digit, 10), 0) === sum,
            { digitGlyphsSum: sum },
            '/\d/g'
        );
    }

    static taskLowercaseGlyphs(count: number): Task {
        return new Task(
            'b5',
            'The Codex Porta mandates a sequence containing exactly {lowercaseGlyphsCount} lowercase glyphs to unlock further directives.',
            (input: string) => (input.match(/[a-z]/g) || []).length === count,
            { lowercaseGlyphsCount: count },
            '/[a-z]/g'
        );
    }

    static taskAtLeastXDigits(count: number): Task {
        return new Task(
            'b6',
            'The Codex Porta demands at least {digitCount} numerical glyphs within the sequence to authorize operations.',
            (input: string) => /\d/.test(input),
            { digitCount: count },
            '/\d/'
        );
    }

    static taskLengthDivisibleBy(divisor: number): Task {
        return new Task(
            'b7',
            'The Codex Porta requires the glyph sequence length to be divisible by {divisor} to process further.',
            (input: string) => input.length % divisor === 0,
            { divisor: divisor }
        );
    }

    static taskMinUniqueGlyphs(count: number): Task {
        return new Task(
            'b8',
            'The Codex Porta necessitates at least {minUniqueGlyphs} unique glyphs in the sequence.',
            (input: string) => {
                const uniqueGlyphs = new Set(input.split(''));
                return uniqueGlyphs.size >= count;
            },
            { minUniqueGlyphs: count }
        );
    }

    static taskFirstLastSame(): Task {
        return new Task(
            'b9',
            'The Codex Porta insists that the first and last glyphs of the sequence match.',
            (input: string) => input[0] === input[input.length - 1]
        );
    }

    static taskLengthIsPrime(): Task {
        return new Task(
            'b10',
            'The Codex Porta only accepts sequences whose length is a prime number.',
            (input: string) => {
                const n = input.length;
                if (n < 2) return false;
                for (let i = 2; i <= Math.sqrt(n); i++) {
                    if (n % i === 0) return false;
                }
                return true;
            }
        );
    }

    static taskEvenConsonants(): Task {
        return new Task(
            'b11',
            'An even number of consonant glyphs is required by the Codex Porta.',
            (input: string) => {
                const consonantsCount = (input.match(/[^aeiouAEIOU\d\s\W]/g) || []).length;
                return consonantsCount % 2 === 0;
            }
        );
    }

    static taskContainsSubstring(substring: string): Task {
        return new Task(
            'b12',
            'The Codex Porta requires the sequence to include the sacred glyph pattern "{substring}".',
            (input: string) => input.includes(substring),
            { substring: substring }
        );
    }

    static taskDigitGlyphsSumMultiple(multiple: number): Task {
        return new Task(
            'b13',
            'The total value of digit glyphs must be a multiple of {multiple}, as per Codex Porta directives.',
            (input: string) => {
                const sum = (input.match(/\d/g) || []).reduce((acc, digit) => acc + parseInt(digit, 10), 0);
                return sum % multiple === 0;
            },
            { multiple: multiple }
        );
    }

    static taskStartDigitEndSpecial(): Task {
        return new Task(
            'b14',
            'The Codex Porta mandates that the sequence begins with a numerical glyph and ends with a special glyph.',
            (input: string) => /^\d.*[!@#$%^&*(),.?":{}|<>]$/.test(input),
            {},
            '/^\\d.*[!@#$%^&*(),.?":{}|<>]$/'
        );
    }

    static taskMoreVowelsThanConsonants(): Task {
        return new Task(
            'b15',
            'The Codex Porta requires the sequence to contain more vowel glyphs than consonant glyphs.',
            (input: string) => {
                const vowelCount = (input.match(/[aeiouAEIOU]/g) || []).length;
                const consonantCount = (input.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
                return vowelCount > consonantCount;
            }
        );
    }

    static taskLengthIsPerfectSquare(): Task {
        return new Task(
            'b16',
            'The Codex Porta only accepts sequences whose length is a perfect square.',
            (input: string) => {
                const length = input.length;
                return Number.isInteger(Math.sqrt(length));
            }
        );
    }

    static taskMinDifferentSpecialGlyphs(count: number): Task {
        return new Task(
            'b17',
            'The Codex Porta requires at least {count} different special glyphs in the sequence.',
            (input: string) => {
                const specialGlyphs = input.match(/[!@#$%^&*(),.?":{}|<>]/g) || [];
                const uniqueSpecialGlyphs = new Set(specialGlyphs);
                return uniqueSpecialGlyphs.size >= count;
            },
            { count: count },
            '/[!@#$%^&*(),.?":{}|<>]/g'
        );
    }

    static taskEvenUppercaseOddDigits(): Task {
        return new Task(
            'b18',
            'The Codex Porta requires an even number of uppercase glyphs and an odd number of numerical glyphs in the sequence.',
            (input: string) => {
                const uppercaseCount = (input.match(/[A-Z]/g) || []).length;
                const digitCount = (input.match(/\d/g) || []).length;
                return uppercaseCount % 2 === 0 && digitCount % 2 === 1;
            }
        );
    }

    static taskMoreConsonantsThanVowels(): Task {
        return new Task(
            'b19',
            'The Codex Porta requires the sequence to contain more consonant glyphs than vowel glyphs.',
            (input: string) => {
                const vowelCount = (input.match(/[aeiouAEIOU]/g) || []).length;
                const consonantCount = (input.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length;
                return consonantCount > vowelCount;
            }
        );
    }

    static taskRomanNumeralSum(sum: number): Task {
        return new Task(
            'b20',
            'The Codex Porta demands the sum of the Roman numeral glyphs in the sequence to be exactly {sum}.',
            (input: string) => {
                const romanNumerals: { [key: string]: number } = {
                    'I': 1, 'V': 5, 'X': 10, 'L': 50,
                    'C': 100, 'D': 500, 'M': 1000
                };
                const numerals = input.toUpperCase().split('').filter(char => romanNumerals.hasOwnProperty(char));
                const total = numerals.reduce((acc, char) => acc + romanNumerals[char], 0);
                return total === sum;
            },
            { sum: sum }
        );
    }

    static taskLengthIsFibonacci(): Task {
        return new Task(
            'b21',
            'The Codex Porta only accepts sequences whose length is a Fibonacci number.',
            (input: string) => {
                const isFibonacci = (n: number): boolean => {
                    const isPerfectSquare = (x: number): boolean => {
                        const s = Math.sqrt(x);
                        return s === Math.floor(s);
                    };
                    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
                };
                return isFibonacci(input.length);
            }
        );
    }

    static createTasksForDifficulty(difficulty: Difficulty): Task[] {
        switch (difficulty) {
            case 'easy':
                return [
                    this.taskMinLength(3),
                    this.taskUppercaseGlyphs(1),
                    this.taskSpecialGlyphs(1),
                    this.taskDigitGlyphsSum(Math.floor(Math.random() * (25 - 10 + 1)) + 10),
                ].sort(() => Math.random() - 0.5);
            case 'medium':
                return [
                    this.taskMinLength(7),
                    this.taskUppercaseGlyphs(2),
                    this.taskSpecialGlyphs(2),
                    this.taskDigitGlyphsSum(Math.floor(Math.random() * (25 - 10 + 1)) + 10),
                ].sort(() => Math.random() - 0.5);

            case 'hard':
                return [
                    this.taskMinLength(9),
                    this.taskUppercaseGlyphs(3),
                    this.taskSpecialGlyphs(3),
                    this.taskDigitGlyphsSum(Math.floor(Math.random() * (25 - 10 + 1)) + 10),
                ].sort(() => Math.random() - 0.5);

            default:
                return [];
        }
    }
}
