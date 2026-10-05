import { NaturalComparer } from '../src/Extensions/NaturalComparer';

describe('NaturalComparer', () => {
    test('orders punctuation ordinally like the C# version', () => {
        const names = ['GroupSignals.1_1.X', 'GroupSignals.1.X', 'GroupSignals.1_2.X', 'A_b', 'A.b', 'Ab', 'A-b', 'A b'];
        names.sort((a, b) => new NaturalComparer().compare(a, b));
        expect(names).toEqual(['A b', 'A-b', 'A.b', 'Ab', 'A_b', 'GroupSignals.1.X', 'GroupSignals.1_1.X', 'GroupSignals.1_2.X']);
    });

    test('compares numbers naturally and letters case-insensitively', () => {
        const comparer = new NaturalComparer();
        expect(comparer.compare('a2', 'a10')).toBeLessThan(0);
        expect(comparer.compare('a', 'A')).toBe(0);
    });

    test('keeps characters without a single-char upper case like C# ToUpperInvariant', () => {
        const comparer = new NaturalComparer();
        expect(comparer.compare('xßy', 'xzy')).toBeGreaterThan(0);
        expect(comparer.compare('xßy', 'xÜy')).toBeGreaterThan(0);
    });
});
