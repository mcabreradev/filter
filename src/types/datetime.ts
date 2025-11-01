export interface RelativeTimeQuery {
  readonly days?: number;
  readonly hours?: number;
  readonly minutes?: number;
}

export interface TimeOfDayQuery {
  readonly start: number;
  readonly end: number;
}

export interface AgeQuery {
  readonly min?: number;
  readonly max?: number;
  readonly unit?: 'years' | 'months' | 'days';
}

export interface DateTimeOperators {
  $recent?: RelativeTimeQuery;
  $upcoming?: RelativeTimeQuery;
  $dayOfWeek?: number[];
  $timeOfDay?: TimeOfDayQuery;
  $age?: AgeQuery;
  $isWeekday?: boolean;
  $isWeekend?: boolean;
  $isBefore?: Date;
  $isAfter?: Date;
}
