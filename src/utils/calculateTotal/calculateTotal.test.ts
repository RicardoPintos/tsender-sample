import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('should calculate total for newline-separated numbers', () => {
    const input = '100\n100\n100';
    expect(calculateTotal(input)).toBe(300);
  });

  it('should calculate total for comma-separated numbers', () => {
    const input = '100, 100, 100';
    expect(calculateTotal(input)).toBe(300);
  });

  it('should handle mixed newline and comma separators', () => {
    const input = '100, 200\n300';
    expect(calculateTotal(input)).toBe(600);
  });

  it('should handle decimal numbers', () => {
    const input = '10.5\n20.5\n30';
    expect(calculateTotal(input)).toBe(61);
  });

  it('should handle numbers with extra whitespace', () => {
    const input = '  100  \n  200  \n  300  ';
    expect(calculateTotal(input)).toBe(600);
  });

  it('should ignore invalid numbers', () => {
    const input = '100\nabc\n200\nxyz\n300';
    expect(calculateTotal(input)).toBe(600);
  });

  it('should return 0 for empty string', () => {
    expect(calculateTotal('')).toBe(0);
  });

  it('should return 0 for whitespace-only string', () => {
    expect(calculateTotal('   \n  \n  ')).toBe(0);
  });

  it('should handle single number', () => {
    expect(calculateTotal('42')).toBe(42);
  });

  it('should handle negative numbers', () => {
    const input = '100\n-50\n200';
    expect(calculateTotal(input)).toBe(250);
  });

  it('should handle zero values', () => {
    const input = '0\n100\n0\n200';
    expect(calculateTotal(input)).toBe(300);
  });

  it('should handle large numbers', () => {
    const input = '1000000\n2000000\n3000000';
    expect(calculateTotal(input)).toBe(6000000);
  });

  it('should handle mixed comma and newline with invalid values', () => {
    const input = '100, abc\n200, def, 300';
    expect(calculateTotal(input)).toBe(600);
  });

  it('should handle trailing commas and newlines', () => {
    const input = '100,\n200,\n300,';
    expect(calculateTotal(input)).toBe(600);
  });
});