import type { RelativeTimeQuery, TimeOfDayQuery, AgeQuery } from '../types/datetime';
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
} from '../utils/date-time';

export function evaluateRecent(date: unknown, query: RelativeTimeQuery): boolean {
  if (!isValidDate(date) || !isValidRelativeTime(query)) return false;

  const now = new Date();
  const diff = calculateTimeDifference(date, now);

  if (diff < 0) return false;

  if (query.days !== undefined) {
    return diff <= query.days * 24 * 60 * 60 * 1000;
  }

  if (query.hours !== undefined) {
    return diff <= query.hours * 60 * 60 * 1000;
  }

  if (query.minutes !== undefined) {
    return diff <= query.minutes * 60 * 1000;
  }

  return false;
}

export function evaluateUpcoming(date: unknown, query: RelativeTimeQuery): boolean {
  if (!isValidDate(date) || !isValidRelativeTime(query)) return false;

  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) return false;

  if (query.days !== undefined) {
    return diff <= query.days * 24 * 60 * 60 * 1000;
  }

  if (query.hours !== undefined) {
    return diff <= query.hours * 60 * 60 * 1000;
  }

  if (query.minutes !== undefined) {
    return diff <= query.minutes * 60 * 1000;
  }

  return false;
}

export function evaluateDayOfWeek(date: unknown, days: number[]): boolean {
  if (!isValidDate(date) || !isValidDayOfWeek(days)) return false;
  return days.includes(date.getDay());
}

export function evaluateTimeOfDay(date: unknown, query: TimeOfDayQuery): boolean {
  if (!isValidDate(date) || !isValidTimeOfDay(query)) return false;

  const hour = date.getHours();
  return hour >= query.start && hour <= query.end;
}

export function evaluateAge(date: unknown, query: AgeQuery): boolean {
  if (!isValidDate(date) || !isValidAgeQuery(query)) return false;

  const age = calculateAge(date, query.unit || 'years');

  if (query.min !== undefined && age < query.min) return false;
  if (query.max !== undefined && age > query.max) return false;

  return true;
}

export function evaluateIsWeekday(date: unknown, expected: boolean): boolean {
  if (!isValidDate(date) || typeof expected !== 'boolean') return false;
  return isWeekday(date) === expected;
}

export function evaluateIsWeekend(date: unknown, expected: boolean): boolean {
  if (!isValidDate(date) || typeof expected !== 'boolean') return false;
  return isWeekend(date) === expected;
}

export function evaluateIsBefore(date: unknown, beforeDate: Date): boolean {
  if (!isValidDate(date) || !isValidDate(beforeDate)) return false;
  return date.getTime() < beforeDate.getTime();
}

export function evaluateIsAfter(date: unknown, afterDate: Date): boolean {
  if (!isValidDate(date) || !isValidDate(afterDate)) return false;
  return date.getTime() > afterDate.getTime();
}
