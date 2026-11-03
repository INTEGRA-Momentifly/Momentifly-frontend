import { formatLongDate, formatNumber } from './format';

describe('format', () => {
  describe('formatNumber', () => {
    it('uses the Romanian thousands separator', () => {
      expect(formatNumber(12500)).toBe('12.500');
    });

    it('rounds to whole numbers', () => {
      expect(formatNumber(1234.6)).toBe('1.235');
      expect(formatNumber(66.4)).toBe('66');
    });

    it('formats zero and negatives', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-300)).toBe('-300');
    });
  });

  describe('formatLongDate', () => {
    it('formats the date in Romanian with capitalised words', () => {
      expect(formatLongDate(new Date(2026, 10, 3))).toBe('Marți, 3 Noiembrie');
    });

    it('capitalises Romanian diacritics at the start of a word', () => {
      expect(formatLongDate(new Date(2026, 10, 7))).toBe('Sâmbătă, 7 Noiembrie');
    });
  });
});
