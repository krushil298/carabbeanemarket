import { computeAshWednesday, expandEventsForYear } from '@/lib/events';
import { format } from 'date-fns';

describe('Events Library', () => {
  describe('computeAshWednesday', () => {
    test('computes Ash Wednesday correctly for 2024', () => {
      const ashWednesday2024 = computeAshWednesday(2024);
      expect(format(ashWednesday2024, 'yyyy-MM-dd')).toBe('2024-02-14');
    });

    test('computes Ash Wednesday correctly for 2025', () => {
      const ashWednesday2025 = computeAshWednesday(2025);
      expect(format(ashWednesday2025, 'yyyy-MM-dd')).toBe('2025-03-05');
    });
  });

  describe('expandEventsForYear', () => {
    test('expands fixed date events correctly', () => {
      const events = expandEventsForYear('BS', 2024);
      const independenceDay = events.find(e => e.id === 'bs-independence');
      
      expect(independenceDay).toBeDefined();
      expect(independenceDay?.date).toBe('2024-07-10');
    });

    test('expands RRULE events correctly', () => {
      const events = expandEventsForYear('BS', 2024);
      const emancipationDay = events.find(e => e.id === 'bs-emancipation');
      
      expect(emancipationDay).toBeDefined();
      // First Monday in August 2024 should be August 5th
      expect(emancipationDay?.date).toBe('2024-08-05');
    });

    test('expands relative events correctly', () => {
      const events = expandEventsForYear('TT', 2024);
      const carnivalMonday = events.find(e => e.id === 'tt-carnival-monday');
      const carnivalTuesday = events.find(e => e.id === 'tt-carnival-tuesday');
      
      expect(carnivalMonday).toBeDefined();
      expect(carnivalTuesday).toBeDefined();
      // Ash Wednesday 2024 is Feb 14, so Carnival Monday is Feb 12, Tuesday is Feb 13
      expect(carnivalMonday?.date).toBe('2024-02-12');
      expect(carnivalTuesday?.date).toBe('2024-02-13');
    });
  });
});