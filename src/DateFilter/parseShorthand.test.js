import { describe, it, expect } from 'vitest';
import { parseShorthand } from './parseShorthand.js';

const NOW = new Date('2026-04-15T12:00:00.000Z');

describe('parseShorthand', () => {
  it('parses minutes', () => {
    const r = parseShorthand('10min', NOW);
    expect(r.to).toBe(NOW.toISOString());
    expect(new Date(r.from).getTime()).toBe(NOW.getTime() - 10 * 60 * 1000);
  });
  it('parses 1h', () => {
    const r = parseShorthand('1h', NOW);
    expect(new Date(r.from).getTime()).toBe(NOW.getTime() - 3600 * 1000);
  });
  it('is case insensitive', () => {
    const r = parseShorthand('2H', NOW);
    expect(new Date(r.from).getTime()).toBe(NOW.getTime() - 2 * 3600 * 1000);
  });
  it('parses days', () => {
    const r = parseShorthand('3d', NOW);
    expect(new Date(r.from).getTime()).toBe(NOW.getTime() - 3 * 86400 * 1000);
  });
  it('parses weeks', () => {
    const r = parseShorthand('1w', NOW);
    expect(new Date(r.from).getTime()).toBe(NOW.getTime() - 7 * 86400 * 1000);
  });
  it('rejects empty', () => {
    expect(parseShorthand('')).toBeNull();
  });
  it('rejects garbage', () => {
    expect(parseShorthand('abc')).toBeNull();
  });
});
