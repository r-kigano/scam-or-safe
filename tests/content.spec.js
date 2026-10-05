// Checks the question bank itself. Runs once (no browser needed).
const { test, expect } = require('@playwright/test');
const { QUESTIONS } = require('./helpers');

test.describe('question bank', () => {
  test('has 200 well-formed questions', () => {
    expect(QUESTIONS.length).toBe(200);
    for (const [i, q] of QUESTIONS.entries()) {
      expect(typeof q.text, `Q${i + 1} text`).toBe('string');
      expect(q.text.trim().length, `Q${i + 1} text`).toBeGreaterThan(15);
      expect(typeof q.isScam, `Q${i + 1} isScam`).toBe('boolean');
      expect(typeof q.tip, `Q${i + 1} tip`).toBe('string');
      expect(q.tip.trim().length, `Q${i + 1} tip`).toBeGreaterThan(10);
    }
  });

  test('has no duplicate scenarios', () => {
    const seen = new Map();
    const dupes = [];
    QUESTIONS.forEach((q, i) => {
      const key = q.text.trim().toLowerCase();
      if (seen.has(key)) dupes.push(`Q${seen.get(key) + 1} and Q${i + 1}`);
      else seen.set(key, i);
    });
    expect(dupes).toEqual([]);
  });

  test('mixes scams and safe answers reasonably', () => {
    const scams = QUESTIONS.filter(q => q.isScam).length;
    const ratio = scams / QUESTIONS.length;
    expect(ratio).toBeGreaterThan(0.3);
    expect(ratio).toBeLessThan(0.7);
  });
});
