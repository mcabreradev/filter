import type { RelativeTimeQuery, TimeOfDayQuery, AgeQuery } from '../types/datetime';

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function isValidTimeOfDay(query: unknown): query is TimeOfDayQuery {
  if (!query || typeof query !== 'object') return false;
  const q = query as TimeOfDayQuery;
  return (
    typeof q.start === 'number' &&
    typeof q.end === 'number' &&
    q.start >= 0 &&
    q.start <= 23 &&
    q.end >= 0 &&
    q.end <= 23
  );
}

export function isValidDayOfWeek(days: unknown): days is number[] {
  if (!Array.isArray(days) || days.length === 0) return false;
  return days.every((day) => typeof day === 'number' && day >= 0 && day <= 6);
}

export function isValidRelativeTime(query: unknown): query is RelativeTimeQuery {
  if (!query || typeof query !== 'object') return false;
  const q = query as RelativeTimeQuery;
  const hasDays = q.days !== undefined && typeof q.days === 'number' && q.days > 0;
  const hasHours = q.hours !== undefined && typeof q.hours === 'number' && q.hours > 0;
  const hasMinutes = q.minutes !== undefined && typeof q.minutes === 'number' && q.minutes > 0;
  return hasDays || hasHours || hasMinutes;
}

export function isValidAgeQuery(query: unknown): query is AgeQuery {
  if (!query || typeof query !== 'object') return false;
  const q = query as AgeQuery;
  const hasMin = q.min !== undefined && typeof q.min === 'number' && q.min >= 0;
  const hasMax = q.max !== undefined && typeof q.max === 'number' && q.max >= 0;
  const validUnit = !q.unit || ['years', 'months', 'days'].includes(q.unit);
  return (hasMin || hasMax) && validUnit;
}

export function calculateTimeDifference(date: Date, now: Date = new Date()): number {
  return now.getTime() - date.getTime();
}

export function calculateAge(
  birthDate: Date,
  unit: 'years' | 'months' | 'days' = 'years',
  now: Date = new Date(),
): number {
  const diff = calculateTimeDifference(birthDate, now);

  switch (unit) {
    case 'years':
      return diff / (365.25 * 24 * 60 * 60 * 1000);
    case 'months':
      return diff / (30.44 * 24 * 60 * 60 * 1000);
    case 'days':
      return diff / (24 * 60 * 60 * 1000);
  }
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
