
import { describe, it, expect } from 'vitest';
import { formatNumber } from './helpers';

describe('formatNumber', () => {
  it('formats a number with commas for thousands (en-US)', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(9876543.21)).toBe('9,876,543.21');
    expect(formatNumber(0)).toBe('0');
  });

  it('formats negative numbers correctly', () => {
    expect(formatNumber(-1234567)).toBe('-1,234,567');
    expect(formatNumber(-9876.543)).toBe('-9,876.543');
  });
});
