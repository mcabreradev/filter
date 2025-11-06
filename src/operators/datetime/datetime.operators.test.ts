import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { filter } from '../../core/filter/filter';
import {
  isValidDate,
  isValidTimeOfDay,
  isValidDayOfWeek,
  isValidRelativeTime,
  isValidAgeQuery,
  calculateTimeDifference,
  calculateAge,
  isWeekday,
  isWeekend,
} from '../../utils/date-time';
import {
  evaluateRecent,
  evaluateUpcoming,
  evaluateDayOfWeek,
  evaluateTimeOfDay,
  evaluateAge,
  evaluateIsWeekday,
  evaluateIsWeekend,
  evaluateIsBefore,
  evaluateIsAfter,
} from './datetime.operators';

describe('DateTime Operators', () => {
  describe('Utilities', () => {
    describe('isValidDate', () => {
      it('validates correct dates', () => {
        expect(isValidDate(new Date())).toBe(true);
        expect(isValidDate(new Date('2025-01-01'))).toBe(true);
        expect(isValidDate(new Date(0))).toBe(true);
      });

      it('rejects invalid dates', () => {
        expect(isValidDate(new Date('invalid'))).toBe(false);
        expect(isValidDate(null)).toBe(false);
        expect(isValidDate(undefined)).toBe(false);
        expect(isValidDate('2025-01-01')).toBe(false);
        expect(isValidDate(1234567890)).toBe(false);
        expect(isValidDate({})).toBe(false);
      });
    });

    describe('isValidTimeOfDay', () => {
      it('validates correct time ranges', () => {
        expect(isValidTimeOfDay({ start: 0, end: 23 })).toBe(true);
        expect(isValidTimeOfDay({ start: 9, end: 17 })).toBe(true);
        expect(isValidTimeOfDay({ start: 0, end: 0 })).toBe(true);
      });

      it('rejects invalid time ranges', () => {
        expect(isValidTimeOfDay({ start: -1, end: 23 })).toBe(false);
        expect(isValidTimeOfDay({ start: 0, end: 24 })).toBe(false);
        expect(isValidTimeOfDay({ start: 'invalid', end: 17 })).toBe(false);
        expect(isValidTimeOfDay(null)).toBe(false);
        expect(isValidTimeOfDay({})).toBe(false);
      });
    });

    describe('isValidDayOfWeek', () => {
      it('validates correct day arrays', () => {
        expect(isValidDayOfWeek([0, 6])).toBe(true);
        expect(isValidDayOfWeek([1, 2, 3, 4, 5])).toBe(true);
        expect(isValidDayOfWeek([0])).toBe(true);
      });

      it('rejects invalid day arrays', () => {
        expect(isValidDayOfWeek([])).toBe(false);
        expect(isValidDayOfWeek([7])).toBe(false);
        expect(isValidDayOfWeek([-1])).toBe(false);
        expect(isValidDayOfWeek(['Monday'])).toBe(false);
        expect(isValidDayOfWeek(null)).toBe(false);
      });
    });

    describe('isValidRelativeTime', () => {
      it('validates correct queries', () => {
        expect(isValidRelativeTime({ days: 7 })).toBe(true);
        expect(isValidRelativeTime({ hours: 24 })).toBe(true);
        expect(isValidRelativeTime({ minutes: 60 })).toBe(true);
      });

      it('rejects invalid queries', () => {
        expect(isValidRelativeTime({})).toBe(false);
        expect(isValidRelativeTime({ days: -7 })).toBe(false);
        expect(isValidRelativeTime({ days: 0 })).toBe(false);
        expect(isValidRelativeTime(null)).toBe(false);
      });
    });

    describe('isValidAgeQuery', () => {
      it('validates correct queries', () => {
        expect(isValidAgeQuery({ min: 18 })).toBe(true);
        expect(isValidAgeQuery({ max: 65 })).toBe(true);
        expect(isValidAgeQuery({ min: 18, max: 65 })).toBe(true);
        expect(isValidAgeQuery({ min: 18, unit: 'years' })).toBe(true);
      });

      it('rejects invalid queries', () => {
        expect(isValidAgeQuery({})).toBe(false);
        expect(isValidAgeQuery({ min: -18 })).toBe(false);
        expect(isValidAgeQuery({ unit: 'invalid' })).toBe(false);
        expect(isValidAgeQuery(null)).toBe(false);
      });
    });

    describe('calculateTimeDifference', () => {
      it('calculates difference correctly', () => {
        const past = new Date('2025-01-01');
        const now = new Date('2025-01-08');
        const diff = calculateTimeDifference(past, now);
        expect(diff).toBe(7 * 24 * 60 * 60 * 1000);
      });

      it('returns negative for future dates', () => {
        const future = new Date('2025-12-31');
        const now = new Date('2025-01-01');
        const diff = calculateTimeDifference(future, now);
        expect(diff).toBeLessThan(0);
      });
    });

    describe('calculateAge', () => {
      it('calculates age in years', () => {
        const birthDate = new Date('2000-01-01');
        const now = new Date('2025-01-01');
        const age = calculateAge(birthDate, 'years', now);
        expect(age).toBeCloseTo(25, 0);
      });

      it('calculates age in months', () => {
        const birthDate = new Date('2024-01-01');
        const now = new Date('2025-01-01');
        const age = calculateAge(birthDate, 'months', now);
        expect(age).toBeCloseTo(12, 0);
      });

      it('calculates age in days', () => {
        const birthDate = new Date('2024-12-25');
        const now = new Date('2025-01-01');
        const age = calculateAge(birthDate, 'days', now);
        expect(age).toBeCloseTo(7, 0);
      });
    });

    describe('isWeekday', () => {
      it('identifies weekdays correctly', () => {
        // Monday - Friday (Jan 6-10, 2025)
        expect(isWeekday(new Date(2025, 0, 6))).toBe(true);
        expect(isWeekday(new Date(2025, 0, 7))).toBe(true);
        expect(isWeekday(new Date(2025, 0, 8))).toBe(true);
        expect(isWeekday(new Date(2025, 0, 9))).toBe(true);
        expect(isWeekday(new Date(2025, 0, 10))).toBe(true);
      });

      it('rejects weekends', () => {
        // Saturday and Sunday (Jan 4-5, 2025)
        expect(isWeekday(new Date(2025, 0, 4))).toBe(false);
        expect(isWeekday(new Date(2025, 0, 5))).toBe(false);
      });
    });

    describe('isWeekend', () => {
      it('identifies weekends correctly', () => {
        // Saturday and Sunday (Jan 4-5, 2025)
        expect(isWeekend(new Date(2025, 0, 4))).toBe(true);
        expect(isWeekend(new Date(2025, 0, 5))).toBe(true);
      });

      it('rejects weekdays', () => {
        // Monday and Friday (Jan 6, 10, 2025)
        expect(isWeekend(new Date(2025, 0, 6))).toBe(false);
        expect(isWeekend(new Date(2025, 0, 10))).toBe(false);
      });
    });
  });

  describe('$recent operator', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('basic filtering', () => {
      it('includes dates within days range', () => {
        const recentDate = new Date('2025-01-10T12:00:00Z');
        expect(evaluateRecent(recentDate, { days: 7 })).toBe(true);
      });

      it('excludes dates outside days range', () => {
        const oldDate = new Date('2025-01-01T12:00:00Z');
        expect(evaluateRecent(oldDate, { days: 7 })).toBe(false);
      });

      it('includes dates within hours range', () => {
        const recentDate = new Date('2025-01-15T06:00:00Z');
        expect(evaluateRecent(recentDate, { hours: 12 })).toBe(true);
      });

      it('includes dates within minutes range', () => {
        const recentDate = new Date('2025-01-15T11:45:00Z');
        expect(evaluateRecent(recentDate, { minutes: 30 })).toBe(true);
      });

      it('excludes future dates', () => {
        const futureDate = new Date('2025-01-20T12:00:00Z');
        expect(evaluateRecent(futureDate, { days: 7 })).toBe(false);
      });

      it('includes current time', () => {
        const now = new Date('2025-01-15T12:00:00Z');
        expect(evaluateRecent(now, { days: 1 })).toBe(true);
      });
    });

    describe('boundary cases', () => {
      it('includes date at exact boundary', () => {
        const exactDate = new Date('2025-01-08T12:00:00Z');
        expect(evaluateRecent(exactDate, { days: 7 })).toBe(true);
      });

      it('handles very small time ranges', () => {
        const veryRecent = new Date('2025-01-15T11:59:00Z');
        expect(evaluateRecent(veryRecent, { minutes: 1 })).toBe(true);
      });

      it('handles large time ranges', () => {
        const oldDate = new Date('2024-01-15T12:00:00Z');
        expect(evaluateRecent(oldDate, { days: 366 })).toBe(true); // 2024 is a leap year
      });
    });

    describe('invalid input handling', () => {
      it('rejects invalid dates', () => {
        expect(evaluateRecent('invalid', { days: 7 })).toBe(false);
        expect(evaluateRecent(null, { days: 7 })).toBe(false);
        expect(evaluateRecent(undefined, { days: 7 })).toBe(false);
      });

      it('rejects invalid queries', () => {
        const date = new Date('2025-01-10T12:00:00Z');
        expect(evaluateRecent(date, {})).toBe(false);
        expect(evaluateRecent(date, { days: -7 })).toBe(false);
      });
    });
  });

  describe('$upcoming operator', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('basic filtering', () => {
      it('includes dates within days range', () => {
        const upcomingDate = new Date('2025-01-20T12:00:00Z');
        expect(evaluateUpcoming(upcomingDate, { days: 7 })).toBe(true);
      });

      it('excludes dates outside days range', () => {
        const farFutureDate = new Date('2025-02-15T12:00:00Z');
        expect(evaluateUpcoming(farFutureDate, { days: 7 })).toBe(false);
      });

      it('includes dates within hours range', () => {
        const upcomingDate = new Date('2025-01-15T18:00:00Z');
        expect(evaluateUpcoming(upcomingDate, { hours: 12 })).toBe(true);
      });

      it('includes dates within minutes range', () => {
        const upcomingDate = new Date('2025-01-15T12:15:00Z');
        expect(evaluateUpcoming(upcomingDate, { minutes: 30 })).toBe(true);
      });

      it('excludes past dates', () => {
        const pastDate = new Date('2025-01-10T12:00:00Z');
        expect(evaluateUpcoming(pastDate, { days: 7 })).toBe(false);
      });
    });

    describe('boundary cases', () => {
      it('includes date at exact boundary', () => {
        const exactDate = new Date('2025-01-22T12:00:00Z');
        expect(evaluateUpcoming(exactDate, { days: 7 })).toBe(true);
      });

      it('handles very small time ranges', () => {
        const veryClose = new Date('2025-01-15T12:01:00Z');
        expect(evaluateUpcoming(veryClose, { minutes: 1 })).toBe(true);
      });
    });

    describe('invalid input handling', () => {
      it('rejects invalid dates', () => {
        expect(evaluateUpcoming('invalid', { days: 7 })).toBe(false);
        expect(evaluateUpcoming(null, { days: 7 })).toBe(false);
      });

      it('rejects invalid queries', () => {
        const date = new Date('2025-01-20T12:00:00Z');
        expect(evaluateUpcoming(date, {})).toBe(false);
        expect(evaluateUpcoming(date, { days: -7 })).toBe(false);
      });
    });
  });

  describe('$dayOfWeek operator', () => {
    describe('basic filtering', () => {
      it('includes matching days', () => {
        const monday = new Date(2025, 0, 6); // Monday
        expect(evaluateDayOfWeek(monday, [1])).toBe(true);
        expect(evaluateDayOfWeek(monday, [1, 2, 3, 4, 5])).toBe(true);
      });

      it('excludes non-matching days', () => {
        const monday = new Date(2025, 0, 6); // Monday
        expect(evaluateDayOfWeek(monday, [0, 6])).toBe(false);
      });

      it('handles all weekdays', () => {
        const weekdays = [1, 2, 3, 4, 5];
        expect(evaluateDayOfWeek(new Date(2025, 0, 6), weekdays)).toBe(true); // Monday
        expect(evaluateDayOfWeek(new Date(2025, 0, 7), weekdays)).toBe(true); // Tuesday
        expect(evaluateDayOfWeek(new Date(2025, 0, 8), weekdays)).toBe(true); // Wednesday
        expect(evaluateDayOfWeek(new Date(2025, 0, 9), weekdays)).toBe(true); // Thursday
        expect(evaluateDayOfWeek(new Date(2025, 0, 10), weekdays)).toBe(true); // Friday
      });

      it('handles weekends', () => {
        const weekends = [0, 6];
        expect(evaluateDayOfWeek(new Date(2025, 0, 4), weekends)).toBe(true); // Saturday
        expect(evaluateDayOfWeek(new Date(2025, 0, 5), weekends)).toBe(true); // Sunday
      });
    });

    describe('invalid input handling', () => {
      it('rejects invalid dates', () => {
        expect(evaluateDayOfWeek('invalid', [1])).toBe(false);
        expect(evaluateDayOfWeek(null, [1])).toBe(false);
      });

      it('rejects invalid day arrays', () => {
        const date = new Date(2025, 0, 6);
        expect(evaluateDayOfWeek(date, [])).toBe(false);
        expect(evaluateDayOfWeek(date, [7])).toBe(false);
        expect(evaluateDayOfWeek(date, ['Monday'] as unknown as number[])).toBe(false);
      });
    });
  });

  describe('$timeOfDay operator', () => {
    describe('basic filtering', () => {
      it('includes times within range', () => {
        const morning = new Date('2025-01-15T09:30:00');
        expect(evaluateTimeOfDay(morning, { start: 9, end: 17 })).toBe(true);
      });

      it('excludes times outside range', () => {
        const evening = new Date('2025-01-15T20:00:00');
        expect(evaluateTimeOfDay(evening, { start: 9, end: 17 })).toBe(false);
      });

      it('includes boundary times', () => {
        const start = new Date('2025-01-15T09:00:00');
        const end = new Date('2025-01-15T17:00:00');
        expect(evaluateTimeOfDay(start, { start: 9, end: 17 })).toBe(true);
        expect(evaluateTimeOfDay(end, { start: 9, end: 17 })).toBe(true);
      });

      it('handles midnight range', () => {
        const midnight = new Date('2025-01-15T00:00:00');
        expect(evaluateTimeOfDay(midnight, { start: 0, end: 6 })).toBe(true);
      });

      it('handles late night range', () => {
        const lateNight = new Date('2025-01-15T23:00:00');
        expect(evaluateTimeOfDay(lateNight, { start: 22, end: 23 })).toBe(true);
      });
    });

    describe('invalid input handling', () => {
      it('rejects invalid dates', () => {
        expect(evaluateTimeOfDay('invalid', { start: 9, end: 17 })).toBe(false);
        expect(evaluateTimeOfDay(null, { start: 9, end: 17 })).toBe(false);
      });

      it('rejects invalid time ranges', () => {
        const date = new Date('2025-01-15T12:00:00');
        expect(evaluateTimeOfDay(date, { start: -1, end: 17 })).toBe(false);
        expect(evaluateTimeOfDay(date, { start: 9, end: 24 })).toBe(false);
      });
    });
  });

  describe('$age operator', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('age in years', () => {
      it('includes ages within range', () => {
        const birthDate = new Date('2000-01-01');
        expect(evaluateAge(birthDate, { min: 18, max: 65 })).toBe(true);
      });

      it('excludes ages below minimum', () => {
        const birthDate = new Date('2010-01-01');
        expect(evaluateAge(birthDate, { min: 18 })).toBe(false);
      });

      it('excludes ages above maximum', () => {
        const birthDate = new Date('1950-01-01');
        expect(evaluateAge(birthDate, { max: 65 })).toBe(false);
      });

      it('includes boundary ages', () => {
        // Current time: 2025-01-01 (from beforeEach)
        // 18 years ago: 2007-01-01 (exactly 18)
        // For max: 65, we need someone born after 1960-01-01 to be <= 65
        const birthDateMin = new Date('2007-01-01');
        const birthDateMax = new Date('1960-01-02'); // 64.997 years old
        expect(evaluateAge(birthDateMin, { min: 18 })).toBe(true);
        expect(evaluateAge(birthDateMax, { max: 65 })).toBe(true);
      });
    });

    describe('age in months', () => {
      it('calculates age in months', () => {
        const birthDate = new Date('2024-07-01');
        expect(evaluateAge(birthDate, { min: 6, unit: 'months' })).toBe(true);
      });
    });

    describe('age in days', () => {
      it('calculates age in days', () => {
        const birthDate = new Date('2024-12-25');
        expect(evaluateAge(birthDate, { min: 7, unit: 'days' })).toBe(true);
      });
    });

    describe('invalid input handling', () => {
      it('rejects invalid dates', () => {
        expect(evaluateAge('invalid', { min: 18 })).toBe(false);
        expect(evaluateAge(null, { min: 18 })).toBe(false);
      });

      it('rejects invalid queries', () => {
        const date = new Date('2000-01-01');
        expect(evaluateAge(date, {})).toBe(false);
        expect(evaluateAge(date, { min: -18 })).toBe(false);
      });
    });
  });

  describe('$isWeekday operator', () => {
    it('identifies weekdays correctly', () => {
      expect(evaluateIsWeekday(new Date(2025, 0, 6), true)).toBe(true); // Monday
      expect(evaluateIsWeekday(new Date(2025, 0, 10), true)).toBe(true); // Friday
    });

    it('identifies weekends correctly with false', () => {
      expect(evaluateIsWeekday(new Date(2025, 0, 4), false)).toBe(true); // Saturday
      expect(evaluateIsWeekday(new Date(2025, 0, 5), false)).toBe(true); // Sunday
    });

    it('rejects mismatches', () => {
      expect(evaluateIsWeekday(new Date(2025, 0, 4), true)).toBe(false); // Saturday
      expect(evaluateIsWeekday(new Date(2025, 0, 6), false)).toBe(false); // Monday
    });

    it('rejects invalid dates', () => {
      expect(evaluateIsWeekday('invalid', true)).toBe(false);
      expect(evaluateIsWeekday(null, true)).toBe(false);
    });
  });

  describe('$isWeekend operator', () => {
    it('identifies weekends correctly', () => {
      expect(evaluateIsWeekend(new Date(2025, 0, 4), true)).toBe(true); // Saturday
      expect(evaluateIsWeekend(new Date(2025, 0, 5), true)).toBe(true); // Sunday
    });

    it('identifies weekdays correctly with false', () => {
      expect(evaluateIsWeekend(new Date(2025, 0, 6), false)).toBe(true); // Monday
      expect(evaluateIsWeekend(new Date(2025, 0, 10), false)).toBe(true); // Friday
    });

    it('rejects mismatches', () => {
      expect(evaluateIsWeekend(new Date(2025, 0, 6), true)).toBe(false); // Monday
      expect(evaluateIsWeekend(new Date(2025, 0, 4), false)).toBe(false); // Saturday
    });

    it('rejects invalid dates', () => {
      expect(evaluateIsWeekend('invalid', true)).toBe(false);
      expect(evaluateIsWeekend(null, true)).toBe(false);
    });
  });

  describe('$isBefore operator', () => {
    it('includes dates before target', () => {
      const target = new Date('2025-01-15');
      const before = new Date('2025-01-10');
      expect(evaluateIsBefore(before, target)).toBe(true);
    });

    it('excludes dates after target', () => {
      const target = new Date('2025-01-15');
      const after = new Date('2025-01-20');
      expect(evaluateIsBefore(after, target)).toBe(false);
    });

    it('excludes equal dates', () => {
      const target = new Date('2025-01-15');
      const same = new Date('2025-01-15');
      expect(evaluateIsBefore(same, target)).toBe(false);
    });

    it('rejects invalid dates', () => {
      const target = new Date('2025-01-15');
      expect(evaluateIsBefore('invalid', target)).toBe(false);
      expect(evaluateIsBefore(target, 'invalid' as unknown as Date)).toBe(false);
    });
  });

  describe('$isAfter operator', () => {
    it('includes dates after target', () => {
      const target = new Date('2025-01-15');
      const after = new Date('2025-01-20');
      expect(evaluateIsAfter(after, target)).toBe(true);
    });

    it('excludes dates before target', () => {
      const target = new Date('2025-01-15');
      const before = new Date('2025-01-10');
      expect(evaluateIsAfter(before, target)).toBe(false);
    });

    it('excludes equal dates', () => {
      const target = new Date('2025-01-15');
      const same = new Date('2025-01-15');
      expect(evaluateIsAfter(same, target)).toBe(false);
    });

    it('rejects invalid dates', () => {
      const target = new Date('2025-01-15');
      expect(evaluateIsAfter('invalid', target)).toBe(false);
      expect(evaluateIsAfter(target, 'invalid' as unknown as Date)).toBe(false);
    });
  });

  describe('Integration with filter()', () => {
    interface Event {
      name: string;
      date: Date;
      startTime: Date;
    }

    interface User {
      name: string;
      birthDate: Date;
      lastLogin: Date;
    }

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const events: Event[] = [
      {
        name: 'Event A',
        date: new Date('2025-01-20'),
        startTime: new Date('2025-01-20T09:00:00'),
      },
      {
        name: 'Event B',
        date: new Date('2025-01-25'),
        startTime: new Date('2025-01-25T14:00:00'),
      },
      {
        name: 'Event C',
        date: new Date('2025-02-01'),
        startTime: new Date('2025-02-01T18:00:00'),
      },
      {
        name: 'Event D',
        date: new Date('2025-01-10'),
        startTime: new Date('2025-01-10T10:00:00'),
      },
    ];

    const users: User[] = [
      { name: 'Alice', birthDate: new Date('2000-01-01'), lastLogin: new Date('2025-01-14') },
      { name: 'Bob', birthDate: new Date('2005-01-01'), lastLogin: new Date('2025-01-10') },
      { name: 'Charlie', birthDate: new Date('1990-01-01'), lastLogin: new Date('2025-01-01') },
      { name: 'Diana', birthDate: new Date('2010-01-01'), lastLogin: new Date('2025-01-15') },
    ];

    describe('$upcoming filter', () => {
      it('filters upcoming events', () => {
        const upcoming = filter(events, {
          date: { $upcoming: { days: 7 } },
        });

        expect(upcoming).toHaveLength(1);
        expect(upcoming[0].name).toBe('Event A');
      });

      it('filters upcoming events by hours', () => {
        vi.setSystemTime(new Date('2025-01-20T00:00:00Z'));
        const upcoming = filter(events, {
          startTime: { $upcoming: { hours: 12 } },
        });

        expect(upcoming).toHaveLength(1);
        expect(upcoming[0].name).toBe('Event A');
      });
    });

    describe('$recent filter', () => {
      it('filters recent events', () => {
        const recent = filter(events, {
          date: { $recent: { days: 7 } },
        });

        expect(recent).toHaveLength(1);
        expect(recent[0].name).toBe('Event D');
      });
    });

    describe('$dayOfWeek filter', () => {
      it('filters weekday events', () => {
        const weekdayEvents = filter(events, {
          date: { $dayOfWeek: [1, 2, 3, 4, 5] },
        });

        expect(weekdayEvents.length).toBeGreaterThan(0);
      });

      it('filters weekend events', () => {
        const weekendEvents = filter(events, {
          date: { $dayOfWeek: [0, 6] },
        });

        expect(weekendEvents.length).toBeGreaterThan(0);
      });
    });

    describe('$timeOfDay filter', () => {
      it('filters events during business hours', () => {
        const businessHours = filter(events, {
          startTime: { $timeOfDay: { start: 9, end: 17 } },
        });

        // Event A (9:00), B (14:00), and D (10:00) are within 9-17
        expect(businessHours).toHaveLength(3);
        expect(businessHours.map((e) => e.name)).toContain('Event A');
        expect(businessHours.map((e) => e.name)).toContain('Event B');
        expect(businessHours.map((e) => e.name)).toContain('Event D');
      });
    });

    describe('$age filter', () => {
      it('filters users by age range', () => {
        const adults = filter(users, {
          birthDate: { $age: { min: 18, max: 30 } },
        });

        expect(adults).toHaveLength(2);
        expect(adults.map((u) => u.name)).toContain('Alice');
        expect(adults.map((u) => u.name)).toContain('Bob');
      });

      it('filters minors', () => {
        const minors = filter(users, {
          birthDate: { $age: { max: 18 } },
        });

        expect(minors).toHaveLength(1);
        expect(minors[0].name).toBe('Diana');
      });
    });

    describe('$isWeekday filter', () => {
      it('filters users who logged in on weekdays', () => {
        const weekdayLogins = filter(users, {
          lastLogin: { $isWeekday: true },
        });

        expect(weekdayLogins.length).toBeGreaterThan(0);
      });
    });

    describe('combining multiple datetime operators', () => {
      it('combines $upcoming and $timeOfDay', () => {
        const result = filter(events, {
          date: { $upcoming: { days: 30 } },
          startTime: { $timeOfDay: { start: 9, end: 17 } },
        });

        expect(result.length).toBeGreaterThan(0);
      });

      it('combines $age and $recent', () => {
        const result = filter(users, {
          birthDate: { $age: { min: 18 } },
          lastLogin: { $recent: { days: 7 } },
        });

        // Alice (25yo, 1.5d ago) and Bob (20yo, 5.5d ago) match both conditions
        // Diana is too young (15yo), Charlie's login is too old (14.5d ago)
        expect(result).toHaveLength(2);
        expect(result.map((u) => u.name)).toContain('Alice');
        expect(result.map((u) => u.name)).toContain('Bob');
      });
    });

    describe('edge cases', () => {
      it('handles empty arrays', () => {
        const result = filter<Event>([], {
          date: { $upcoming: { days: 7 } },
        });

        expect(result).toEqual([]);
      });

      it('handles items without date property', () => {
        const items = [
          { name: 'A', date: new Date('2025-01-20') },
          { name: 'B' },
          { name: 'C', date: new Date('2025-01-25') },
        ];

        const result = filter(items, {
          date: { $upcoming: { days: 7 } },
        });

        expect(result.every((item) => item.date !== undefined)).toBe(true);
      });

      it('handles items with invalid dates', () => {
        const items = [
          { name: 'Valid', date: new Date('2025-01-20') },
          { name: 'Invalid', date: new Date('invalid') },
        ];

        const result = filter(items, {
          date: { $upcoming: { days: 7 } },
        });

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Valid');
      });
    });
  });
});
