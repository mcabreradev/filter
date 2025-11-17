# Datetime Operators Guide

Complete guide to date and time filtering with `@mcabreradev/filter`.

## Overview

Datetime operators provide powerful filtering capabilities for temporal data. Filter by relative time ranges, specific days of the week, time of day, age calculations, and more.

**Available in:** v5.6.0+ (current: v5.8.2)

## Quick Start

```typescript
import { filter } from '@mcabreradev/filter';

const events = [
  { name: 'Meeting', date: new Date('2025-01-20') },
  { name: 'Conference', date: new Date('2025-02-15') },
];

// Events in next 7 days
filter(events, {
  date: { $upcoming: { days: 7 } }
});
// → [{ name: 'Meeting', ... }]
```

## Available Operators

| Operator | Purpose | Type | Priority |
|----------|---------|------|----------|
| [`$recent`](#recent) | Last N days/hours/minutes | `RelativeTimeQuery` | HIGH |
| [`$upcoming`](#upcoming) | Next N days/hours/minutes | `RelativeTimeQuery` | HIGH |
| [`$dayOfWeek`](#dayofweek) | Specific days (0-6) | `number[]` | HIGH |
| [`$timeOfDay`](#timeofday) | Hour range (0-23) | `TimeOfDayQuery` | MEDIUM |
| [`$age`](#age) | Calculate age | `AgeQuery` | MEDIUM |
| [`$isWeekday`](#isweekday) | Weekday check | `boolean` | LOW |
| [`$isWeekend`](#isweekend) | Weekend check | `boolean` | LOW |
| [`$isBefore`](#isbefore) | Before date | `Date` | OPTIONAL* |
| [`$isAfter`](#isafter) | After date | `Date` | OPTIONAL* |

\* `$isBefore` and `$isAfter` are optional as `$lt` and `$gt` already work with dates.

---

## Operator Reference

### $recent

Filter by dates within the last N days, hours, or minutes from now.

**Type:** `RelativeTimeQuery`

```typescript
interface RelativeTimeQuery {
  days?: number;
  hours?: number;
  minutes?: number;
}
```

**Examples:**

```typescript
// Events in last 7 days
filter(events, {
  date: { $recent: { days: 7 } }
});

// Activities in last 24 hours
filter(activities, {
  timestamp: { $recent: { hours: 24 } }
});

// Recent notifications (last 30 minutes)
filter(notifications, {
  createdAt: { $recent: { minutes: 30 } }
});

// Users who logged in within last week
filter(users, {
  lastLogin: { $recent: { days: 7 } }
});
```

**Behavior:**
- Includes dates from the past up to N time units ago
- Excludes future dates
- Includes current moment
- Only one time unit per query (days OR hours OR minutes)

**Use Cases:**
- Recent activity feeds
- Active user filtering
- Time-based notifications
- Analytics dashboards

---

### $upcoming

Filter by dates within the next N days, hours, or minutes from now.

**Type:** `RelativeTimeQuery`

```typescript
interface RelativeTimeQuery {
  days?: number;
  hours?: number;
  minutes?: number;
}
```

**Examples:**

```typescript
// Events in next 7 days
filter(events, {
  date: { $upcoming: { days: 7 } }
});

// Meetings in next 2 hours
filter(meetings, {
  startTime: { $upcoming: { hours: 2 } }
});

// Reminders in next 15 minutes
filter(reminders, {
  scheduledAt: { $upcoming: { minutes: 15 } }
});

// Subscriptions expiring in next 30 days
filter(subscriptions, {
  expiresAt: { $upcoming: { days: 30 } }
});
```

**Behavior:**
- Includes dates from now up to N time units in the future
- Excludes past dates
- Excludes dates beyond the specified range
- Only one time unit per query

**Use Cases:**
- Upcoming events calendar
- Expiration warnings
- Scheduled tasks
- Future appointments

---

### $dayOfWeek

Filter by specific days of the week.

**Type:** `number[]` (0 = Sunday, 6 = Saturday)

**Day Numbers:**
- `0` - Sunday
- `1` - Monday
- `2` - Tuesday
- `3` - Wednesday
- `4` - Thursday
- `5` - Friday
- `6` - Saturday

**Examples:**

```typescript
// Weekday events (Monday-Friday)
filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
});

// Weekend events
filter(events, {
  date: { $dayOfWeek: [0, 6] }
});

// Monday meetings
filter(meetings, {
  scheduledAt: { $dayOfWeek: [1] }
});

// Mid-week appointments (Wed, Thu)
filter(appointments, {
  date: { $dayOfWeek: [3, 4] }
});
```

**Behavior:**
- Accepts array of day numbers (0-6)
- Empty array matches nothing
- Invalid day numbers (< 0 or > 6) are rejected

**Use Cases:**
- Business hours filtering
- Weekend/weekday segmentation
- Recurring schedules
- Work/leisure categorization

---

### $timeOfDay

Filter by hour range within a day.

**Type:** `TimeOfDayQuery`

```typescript
interface TimeOfDayQuery {
  start: number;  // 0-23
  end: number;    // 0-23
}
```

**Examples:**

```typescript
// Business hours (9 AM - 5 PM)
filter(appointments, {
  scheduledAt: { $timeOfDay: { start: 9, end: 17 } }
});

// Morning events (6 AM - 12 PM)
filter(events, {
  startTime: { $timeOfDay: { start: 6, end: 12 } }
});

// Evening activities (6 PM - 11 PM)
filter(activities, {
  time: { $timeOfDay: { start: 18, end: 23 } }
});

// Night shift (10 PM - 6 AM requires two filters)
filter(shifts, {
  startTime: { $timeOfDay: { start: 22, end: 23 } }
});
filter(shifts, {
  startTime: { $timeOfDay: { start: 0, end: 6 } }
});
```

**Behavior:**
- Uses 24-hour format (0-23)
- Inclusive of start and end hours
- Does not support crossing midnight (use two separate filters)
- Ignores minutes and seconds

**Use Cases:**
- Business hours filtering
- Time-based scheduling
- Peak/off-peak analysis
- Shift management

---

### $age

Calculate and filter by age from a birth/start date.

**Type:** `AgeQuery`

```typescript
interface AgeQuery {
  min?: number;
  max?: number;
  unit?: 'years' | 'months' | 'days';
}
```

**Examples:**

```typescript
// Adults (18-65 years old)
filter(users, {
  birthDate: { $age: { min: 18, max: 65 } }
});

// Minors (under 18)
filter(users, {
  birthDate: { $age: { max: 18 } }
});

// Seniors (65+)
filter(users, {
  birthDate: { $age: { min: 65 } }
});

// Young adults (18-25)
filter(users, {
  birthDate: { $age: { min: 18, max: 25 } }
});

// Accounts older than 6 months
filter(accounts, {
  createdAt: { $age: { min: 6, unit: 'months' } }
});

// Items in inventory for more than 90 days
filter(inventory, {
  receivedDate: { $age: { min: 90, unit: 'days' } }
});
```

**Behavior:**
- Default unit is `'years'`
- Calculates from current date
- Supports `min`, `max`, or both
- Fractional ages are allowed
- Age calculation accounts for leap years

**Use Cases:**
- Age verification
- User segmentation
- Account lifecycle management
- Inventory aging
- Data retention policies

---

### $isWeekday

Filter by weekday status (Monday-Friday).

**Type:** `boolean`

**Examples:**

```typescript
// Events on weekdays
filter(events, {
  date: { $isWeekday: true }
});

// Weekend events
filter(events, {
  date: { $isWeekday: false }
});

// Users who logged in on weekdays
filter(users, {
  lastLogin: { $isWeekday: true }
});
```

**Behavior:**
- `true` matches Monday-Friday (days 1-5)
- `false` matches Saturday-Sunday (days 0, 6)
- Equivalent to `$dayOfWeek: [1,2,3,4,5]` when true

**Use Cases:**
- Business day filtering
- Work pattern analysis
- Weekday-only schedules

---

### $isWeekend

Filter by weekend status (Saturday-Sunday).

**Type:** `boolean`

**Examples:**

```typescript
// Weekend events
filter(events, {
  date: { $isWeekend: true }
});

// Weekday events
filter(events, {
  date: { $isWeekend: false }
});

// Orders placed on weekends
filter(orders, {
  createdAt: { $isWeekend: true }
});
```

**Behavior:**
- `true` matches Saturday-Sunday (days 0, 6)
- `false` matches Monday-Friday (days 1-5)
- Equivalent to `$dayOfWeek: [0,6]` when true

**Use Cases:**
- Weekend activity analysis
- Leisure event filtering
- Weekend-specific promotions

---

### $isBefore

Filter dates before a specific date.

**Type:** `Date`

**Examples:**

```typescript
// Events before year end
filter(events, {
  date: { $isBefore: new Date('2025-12-31') }
});

// Users registered before launch
filter(users, {
  registeredAt: { $isBefore: new Date('2024-01-01') }
});
```

**Note:** This is equivalent to using `$lt` with dates:
```typescript
// These are equivalent:
filter(events, { date: { $isBefore: new Date('2025-12-31') } });
filter(events, { date: { $lt: new Date('2025-12-31') } });
```

---

### $isAfter

Filter dates after a specific date.

**Type:** `Date`

**Examples:**

```typescript
// Events after today
filter(events, {
  date: { $isAfter: new Date() }
});

// Recent signups (after Jan 1)
filter(users, {
  registeredAt: { $isAfter: new Date('2025-01-01') }
});
```

**Note:** This is equivalent to using `$gt` with dates:
```typescript
// These are equivalent:
filter(events, { date: { $isAfter: new Date() } });
filter(events, { date: { $gt: new Date() } });
```

---

## Real-World Use Cases

### Event Management

```typescript
interface Event {
  name: string;
  date: Date;
  startTime: Date;
  duration: number;
}

const events: Event[] = [...];

// This week's events
filter(events, {
  date: { $upcoming: { days: 7 } }
});

// Weekday morning events
filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] },
  startTime: { $timeOfDay: { start: 6, end: 12 } }
});

// Events starting in next 2 hours
filter(events, {
  startTime: { $upcoming: { hours: 2 } }
});

// Past events (for archive)
filter(events, {
  date: { $isBefore: new Date() }
});
```

### User Management

```typescript
interface User {
  name: string;
  email: string;
  birthDate: Date;
  lastLogin: Date;
  registeredAt: Date;
}

const users: User[] = [...];

// Active adult users
filter(users, {
  birthDate: { $age: { min: 18, max: 65 } },
  lastLogin: { $recent: { days: 30 } }
});

// Inactive users (no login in 90 days)
filter(users, {
  lastLogin: { $age: { min: 90, unit: 'days' } }
});

// New registrations this week
filter(users, {
  registeredAt: { $recent: { days: 7 } }
});

// Minors requiring parental consent
filter(users, {
  birthDate: { $age: { max: 13 } }
});

// Users who logged in on weekdays during business hours
filter(users, {
  lastLogin: {
    $isWeekday: true,
    $timeOfDay: { start: 9, end: 17 }
  }
});
```

### E-commerce & Flash Sales

```typescript
interface Product {
  name: string;
  saleStart: Date;
  saleEnd: Date;
  price: number;
}

const products: Product[] = [...];

// Active sales (started in last 24h, ending in next 48h)
filter(products, {
  saleStart: { $recent: { hours: 24 } },
  saleEnd: { $upcoming: { hours: 48 } }
});

// Sales ending soon (next 6 hours)
filter(products, {
  saleEnd: { $upcoming: { hours: 6 } }
});

// Weekend-only sales
filter(products, {
  saleStart: { $isWeekend: true }
});

// Flash sales (started recently)
filter(products, {
  saleStart: { $recent: { hours: 2 } }
});
```

### Appointment Scheduling

```typescript
interface Appointment {
  patientName: string;
  scheduledAt: Date;
  duration: number;
  status: string;
}

const appointments: Appointment[] = [...];

// Upcoming appointments (next 7 days)
filter(appointments, {
  scheduledAt: { $upcoming: { days: 7 } }
});

// Today's appointments
filter(appointments, {
  scheduledAt: { $upcoming: { hours: 24 } }
});

// Business hours appointments (weekdays 9-5)
filter(appointments, {
  scheduledAt: {
    $dayOfWeek: [1, 2, 3, 4, 5],
    $timeOfDay: { start: 9, end: 17 }
  }
});

// Morning appointments (next week)
filter(appointments, {
  scheduledAt: {
    $upcoming: { days: 7 },
    $timeOfDay: { start: 8, end: 12 }
  }
});

// Weekend appointments
filter(appointments, {
  scheduledAt: { $isWeekend: true }
});
```

### Analytics & Reporting

```typescript
interface Order {
  id: string;
  createdAt: Date;
  completedAt: Date | null;
  amount: number;
}

const orders: Order[] = [...];

// Last 7 days orders
filter(orders, {
  createdAt: { $recent: { days: 7 } }
});

// Recently completed orders (last 3 days)
filter(orders, {
  completedAt: { $recent: { days: 3 } }
});

// Pending orders (created but not completed)
filter(orders, {
  createdAt: { $recent: { days: 30 } },
  completedAt: null
});

// Weekend orders
filter(orders, {
  createdAt: { $isWeekend: true }
});

// Business hours orders
filter(orders, {
  createdAt: {
    $isWeekday: true,
    $timeOfDay: { start: 9, end: 17 }
  }
});
```

### Notification System

```typescript
interface Notification {
  title: string;
  createdAt: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const notifications: Notification[] = [...];

// Recent unread notifications (last hour)
filter(notifications, {
  createdAt: { $recent: { hours: 1 } },
  read: false
});

// Today's notifications
filter(notifications, {
  createdAt: { $recent: { hours: 24 } }
});

// High priority notifications (last 30 minutes)
filter(notifications, {
  createdAt: { $recent: { minutes: 30 } },
  priority: 'high'
});
```

### Subscription Management

```typescript
interface Subscription {
  userId: string;
  startDate: Date;
  expiresAt: Date;
  plan: string;
}

const subscriptions: Subscription[] = [...];

// Expiring soon (next 7 days)
filter(subscriptions, {
  expiresAt: { $upcoming: { days: 7 } }
});

// New subscriptions (last 30 days)
filter(subscriptions, {
  startDate: { $recent: { days: 30 } }
});

// Long-term subscribers (1+ year)
filter(subscriptions, {
  startDate: { $age: { min: 1, unit: 'years' } }
});

// Expired subscriptions
filter(subscriptions, {
  expiresAt: { $isBefore: new Date() }
});
```

### Content Moderation

```typescript
interface Post {
  id: string;
  content: string;
  createdAt: Date;
  flagged: boolean;
  reviewedAt: Date | null;
}

const posts: Post[] = [...];

// Recently flagged posts (last 24h)
filter(posts, {
  createdAt: { $recent: { hours: 24 } },
  flagged: true
});

// Pending review (flagged but not reviewed)
filter(posts, {
  flagged: true,
  reviewedAt: null
});

// Old pending posts (flagged > 3 days ago)
filter(posts, {
  flagged: true,
  reviewedAt: null,
  createdAt: { $age: { min: 3, unit: 'days' } }
});
```

---

## Combining Operators

Datetime operators can be combined with each other and with other filter operators:

### Multiple Datetime Conditions (AND logic)

```typescript
// Upcoming weekday morning events
filter(events, {
  date: {
    $upcoming: { days: 7 },
    $dayOfWeek: [1, 2, 3, 4, 5]
  },
  startTime: {
    $timeOfDay: { start: 9, end: 12 }
  }
});

// Active adult users who logged in recently
filter(users, {
  birthDate: { $age: { min: 18, max: 65 } },
  lastLogin: {
    $recent: { days: 7 },
    $isWeekday: true
  }
});
```

### With Logical Operators

```typescript
// Events either this week OR high priority
filter(events, {
  $or: [
    { date: { $upcoming: { days: 7 } } },
    { priority: 'high' }
  ]
});

// Users NOT active in last 90 days
filter(users, {
  $not: {
    lastLogin: { $recent: { days: 90 } }
  }
});
```

### With Other Operators

```typescript
// Premium products on active sales
filter(products, {
  saleStart: { $recent: { hours: 24 } },
  saleEnd: { $upcoming: { hours: 48 } },
  price: { $gte: 100 }
});

// Recent high-value orders
filter(orders, {
  createdAt: { $recent: { days: 7 } },
  amount: { $gte: 500 },
  status: { $in: ['completed', 'shipped'] }
});
```

---

## TypeScript Integration

Full TypeScript support with intelligent autocomplete:

```typescript
interface Event {
  name: string;
  date: Date;
  attendees: number;
}

// IDE will autocomplete datetime operators for Date properties
filter<Event>(events, {
  date: {
    // Autocomplete suggests:
    // $recent, $upcoming, $dayOfWeek, $timeOfDay, $age,
    // $isWeekday, $isWeekend, $isBefore, $isAfter,
    // $gt, $gte, $lt, $lte, $eq, $ne, $in, $nin
  }
});

// Type-safe queries
const query: Expression<Event> = {
  date: {
    $upcoming: { days: 7 },
    $dayOfWeek: [1, 2, 3, 4, 5]
  }
};

filter(events, query);
```

---

## Performance Considerations

### Best Practices

**✅ Good:**

```typescript
// Single relative time filter
filter(events, { date: { $recent: { days: 7 } } });

// Combine related filters
filter(events, {
  date: { $upcoming: { days: 30 } },
  startTime: { $timeOfDay: { start: 9, end: 17 } }
});
```

**⚠️ Less Efficient:**

```typescript
// Multiple separate filters
const recent = filter(events, { date: { $recent: { days: 7 } } });
const weekday = filter(recent, { date: { $isWeekday: true } });
// Better: Combine in one filter
```

### Optimization Tips

1. **Use specific time ranges** - Smaller ranges filter faster
2. **Combine conditions** - Single filter call is faster than chaining
3. **Cache results** - Enable caching for repeated queries
4. **Use lazy evaluation** - For large datasets, use `filterLazy`

```typescript
// Cached filtering for repeated queries
filter(events, expression, { enableCache: true });

// Lazy evaluation for large datasets
import { filterFirst } from '@mcabreradev/filter';
const next10 = filterFirst(events, { date: { $upcoming: { days: 30 } } }, 10);
```

---

## Comparison with Existing Operators

Datetime operators complement existing comparison operators:

| Scenario | Datetime Operator | Standard Operator |
|----------|------------------|-------------------|
| Last 7 days | `{ $recent: { days: 7 } }` | `{ $gte: sevenDaysAgo }` |
| After date | `{ $isAfter: date }` | `{ $gt: date }` |
| Before date | `{ $isBefore: date }` | `{ $lt: date }` |
| Weekdays | `{ $dayOfWeek: [1,2,3,4,5] }` | *Not possible* |
| Business hours | `{ $timeOfDay: { start: 9, end: 17 } }` | *Complex logic* |
| Age calculation | `{ $age: { min: 18 } }` | *Manual calculation* |

**When to use datetime operators:**
- ✅ Relative time filtering (recent, upcoming)
- ✅ Day of week filtering
- ✅ Time of day filtering
- ✅ Age calculations

**When to use standard operators:**
- ✅ Absolute date comparisons
- ✅ Date ranges with specific dates
- ✅ Combining with non-date conditions

---

## Timezone Considerations

⚠️ **Important:** All datetime operators use the system's local timezone.

```typescript
// Current time is used for relative operators
filter(events, { date: { $recent: { days: 7 } } });
// Uses new Date() internally

// Dates are interpreted in local timezone
const date = new Date('2025-01-15');
// May be different times in different timezones

// For UTC consistency, use explicit Date constructors
const utcDate = new Date(Date.UTC(2025, 0, 15, 0, 0, 0));
filter(events, { date: { $isAfter: utcDate } });
```

---

## Migration from v5.6.x

Datetime operators are **fully backward compatible**. All existing code continues to work:

```typescript
// ✅ Still works (v5.6.x and earlier)
filter(events, {
  date: { $gte: new Date('2025-01-01') }
});

// ✅ New in v5.6.0
filter(events, {
  date: { $upcoming: { days: 30 } }
});

// ✅ Can combine old and new
filter(events, {
  date: {
    $gte: new Date('2025-01-01'),  // Standard operator
    $upcoming: { days: 30 }         // New operator
  }
});
```

---

## API Reference

### Type Definitions

```typescript
interface RelativeTimeQuery {
  days?: number;
  hours?: number;
  minutes?: number;
}

interface TimeOfDayQuery {
  start: number;  // 0-23
  end: number;    // 0-23
}

interface AgeQuery {
  min?: number;
  max?: number;
  unit?: 'years' | 'months' | 'days';
}

interface DateTimeOperators {
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
```

### Utility Functions

```typescript
// Validation
isValidDate(date: unknown): date is Date
isValidTimeOfDay(query: unknown): query is TimeOfDayQuery
isValidDayOfWeek(days: unknown): days is number[]
isValidRelativeTime(query: unknown): query is RelativeTimeQuery
isValidAgeQuery(query: unknown): query is AgeQuery

// Calculations
calculateTimeDifference(date: Date, now?: Date): number
calculateAge(birthDate: Date, unit?: 'years' | 'months' | 'days', now?: Date): number
isWeekday(date: Date): boolean
isWeekend(date: Date): boolean

// Operators
evaluateRecent(date: unknown, query: RelativeTimeQuery): boolean
evaluateUpcoming(date: unknown, query: RelativeTimeQuery): boolean
evaluateDayOfWeek(date: unknown, days: number[]): boolean
evaluateTimeOfDay(date: unknown, query: TimeOfDayQuery): boolean
evaluateAge(date: unknown, query: AgeQuery): boolean
evaluateIsWeekday(date: unknown, expected: boolean): boolean
evaluateIsWeekend(date: unknown, expected: boolean): boolean
evaluateIsBefore(date: unknown, beforeDate: Date): boolean
evaluateIsAfter(date: unknown, afterDate: Date): boolean
```

---

## FAQ

**Q: Can I filter by time ranges that cross midnight?**

A: Not directly. Use two separate filters or logical OR:

```typescript
filter(shifts, {
  $or: [
    { startTime: { $timeOfDay: { start: 22, end: 23 } } },
    { startTime: { $timeOfDay: { start: 0, end: 6 } } }
  ]
});
```

**Q: How do I filter by "today"?**

A: Use `$recent` with hours:

```typescript
filter(events, {
  date: { $recent: { hours: 24 } }
});
```

**Q: Can I combine multiple time units in one query?**

A: No, use only one unit per query:

```typescript
// ❌ Not supported
{ $recent: { days: 7, hours: 12 } }

// ✅ Use single unit
{ $recent: { hours: 180 } }  // 7.5 days in hours
```

**Q: Are datetime operators timezone-aware?**

A: They use the system's local timezone. For UTC, construct dates explicitly:

```typescript
const utc = new Date(Date.UTC(2025, 0, 15));
filter(events, { date: { $isAfter: utc } });
```

**Q: How accurate is age calculation?**

A: Age calculation accounts for leap years:
- Years: Uses 365.25 days
- Months: Uses 30.44 days (average)
- Days: Exact calculation

---

## Examples Repository

Complete working examples are available in the `examples/` directory:

- [`examples/datetime-examples.ts`](../../examples/datetime-examples.ts) - All use cases
- [`src/operators/datetime/datetime.operators.test.ts`](../../src/operators/datetime/datetime.operators.test.ts) - 90+ test cases

---

## Related Documentation

- [**Operators Guide**](./operators.md) - All available operators
- [**Geospatial Operators**](./geospatial-operators.md) - Location-based filtering
- [**Logical Operators**](./logical-operators.md) - Complex query logic
- [**API Reference**](../api/reference.md) - Complete API documentation
- [**Performance Guide**](../advanced/performance-benchmarks.md) - Optimization tips

---

## Support

- 📖 [Complete Documentation](../advanced/wiki.md)
- 💬 [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)
- 🐛 [Issue Tracker](https://github.com/mcabreradev/filter/issues)
- ⭐ [Star on GitHub](https://github.com/mcabreradev/filter)

---

<p align="center">
  <strong>Made with ❤️ for the JavaScript/TypeScript community</strong>
</p>
