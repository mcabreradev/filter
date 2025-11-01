export interface Example {
  id: string;
  name: string;
  code: string;
}

export const examples: Example[] = [
  {
    id: 'basic',
    name: 'Basic Filtering',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', age: 30, city: 'Berlin' },
  { name: 'Bob', age: 25, city: 'London' },
  { name: 'Charlie', age: 35, city: 'Berlin' }
];

filter(users, { city: 'Berlin' });`,
  },
  {
    id: 'operators',
    name: 'MongoDB Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', price: 1200, rating: 4.5 },
  { name: 'Mouse', price: 25, rating: 4.0 },
  { name: 'Monitor', price: 450, rating: 4.8 }
];

filter(products, {
  price: { $gte: 100, $lte: 500 },
  rating: { $gte: 4.5 }
});`,
  },
  {
    id: 'wildcards',
    name: 'Wildcard Patterns',
    code: `import { filter } from '@mcabreradev/filter';

const emails = [
  { email: 'alice@example.com', verified: true },
  { email: 'bob@test.com', verified: false },
  { email: 'charlie@example.com', verified: true }
];

filter(emails, '%@example.com%');`,
  },
  {
    id: 'logical',
    name: 'Logical Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', category: 'Electronics', price: 1200, inStock: true },
  { name: 'Desk', category: 'Furniture', price: 300, inStock: false },
  { name: 'Mouse', category: 'Electronics', price: 25, inStock: true }
];

filter(products, {
  $and: [
    { inStock: true },
    { $or: [
      { category: 'Electronics' },
      { price: { $lt: 50 } }
    ]}
  ]
});`,
  },
  {
    id: 'geospatial',
    name: 'Geospatial Operators',
    code: `import { filter } from '@mcabreradev/filter';

const restaurants = [
  { name: 'Berlin Bistro', location: { lat: 52.52, lng: 13.405 }, rating: 4.5 },
  { name: 'Pasta Paradise', location: { lat: 52.521, lng: 13.406 }, rating: 4.8 },
  { name: 'Sushi Spot', location: { lat: 52.53, lng: 13.42 }, rating: 4.6 },
  { name: 'Taco Time', location: { lat: 52.55, lng: 13.45 }, rating: 4.2 }
];

const userLocation = { lat: 52.52, lng: 13.405 };

// Find restaurants within 2km radius
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 2000
    }
  }
});`,
  },
  {
    id: 'datetime-recent',
    name: 'Datetime - Recent Activity',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', lastLogin: new Date(2025, 10, 1, 10, 30) }, // Nov 1, 2025
  { name: 'Bob', lastLogin: new Date(2025, 9, 25, 8, 0) },      // Oct 25, 2025
  { name: 'Charlie', lastLogin: new Date(2025, 9, 15, 14, 15) }, // Oct 15, 2025
  { name: 'Diana', lastLogin: new Date(2025, 10, 1, 16, 45) }   // Nov 1, 2025
];

filter(users, {
  lastLogin: { $recent: { days: 7 } }
});`,
  },
  {
    id: 'datetime-upcoming',
    name: 'Datetime - Upcoming Events',
    code: `import { filter } from '@mcabreradev/filter';

const events = [
  { name: 'Team Meeting', date: new Date(2025, 10, 5) },     // Nov 5, 2025
  { name: 'Product Launch', date: new Date(2025, 10, 15) },  // Nov 15, 2025
  { name: 'Holiday Party', date: new Date(2025, 11, 1) },    // Dec 1, 2025
  { name: 'Client Call', date: new Date(2025, 10, 3) }       // Nov 3, 2025
];

filter(events, {
  date: { $upcoming: { days: 7 } }
});`,
  },
  {
    id: 'datetime-business-hours',
    name: 'Datetime - Business Hours',
    code: `import { filter } from '@mcabreradev/filter';

const appointments = [
  { client: 'Alice', time: new Date(2025, 10, 1, 9, 0) },   // 9:00 AM
  { client: 'Bob', time: new Date(2025, 10, 1, 14, 30) },   // 2:30 PM
  { client: 'Charlie', time: new Date(2025, 10, 1, 18, 0) }, // 6:00 PM
  { client: 'Diana', time: new Date(2025, 10, 1, 10, 0) }   // 10:00 AM
];

filter(appointments, {
  time: { $timeOfDay: { start: 9, end: 17 } }
});`,
  },
  {
    id: 'datetime-weekday',
    name: 'Datetime - Weekday Events',
    code: `import { filter } from '@mcabreradev/filter';

const events = [
  { name: 'Monday Meeting', date: new Date(2025, 10, 3) },    // Nov 3 (Mon)
  { name: 'Saturday Workshop', date: new Date(2025, 10, 8) }, // Nov 8 (Sat)
  { name: 'Friday Talk', date: new Date(2025, 10, 7) },       // Nov 7 (Fri)
  { name: 'Sunday Event', date: new Date(2025, 10, 9) }       // Nov 9 (Sun)
];

filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
});`,
  },
  {
    id: 'datetime-age',
    name: 'Datetime - Age Filtering',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', birthDate: new Date(2000, 0, 1) },  // 25 years old
  { name: 'Bob', birthDate: new Date(2005, 4, 15) },   // 20 years old
  { name: 'Charlie', birthDate: new Date(1990, 7, 22) }, // 35 years old
  { name: 'Diana', birthDate: new Date(2010, 11, 5) }   // 14 years old
];

filter(users, {
  birthDate: { $age: { min: 18, max: 65 } }
});`,
  },
  {
    id: 'datetime-combined',
    name: 'Datetime - Combined Filters',
    code: `import { filter } from '@mcabreradev/filter';

const events = [
  { 
    name: 'Team Meeting', 
    date: new Date(2025, 10, 5),           // Nov 5 (Tue)
    startTime: new Date(2025, 10, 5, 9, 0) // 9:00 AM
  },
  { 
    name: 'Weekend Workshop', 
    date: new Date(2025, 10, 8),            // Nov 8 (Sat)
    startTime: new Date(2025, 10, 8, 10, 0) // 10:00 AM
  },
  { 
    name: 'Client Call', 
    date: new Date(2025, 10, 7),             // Nov 7 (Fri)
    startTime: new Date(2025, 10, 7, 15, 0)  // 3:00 PM
  }
];

filter(events, {
  date: { 
    $upcoming: { days: 7 },
    $dayOfWeek: [1, 2, 3, 4, 5]
  },
  startTime: { $timeOfDay: { start: 9, end: 17 } }
});`,
  },
  {
    id: 'datetime-upcoming',
    name: 'Datetime - Upcoming Events',
    code: `import { filter } from '@mcabreradev/filter';

const events = [
  { name: 'Team Meeting', date: new Date('2025-01-20') },
  { name: 'Product Launch', date: new Date('2025-01-25') },
  { name: 'Workshop', date: new Date('2025-02-01') }
];

// Events in next 7 days
filter(events, {
  date: { $upcoming: { days: 7 } }
});`,
  },
  {
    id: 'datetime-business-hours',
    name: 'Datetime - Business Hours',
    code: `import { filter } from '@mcabreradev/filter';

const appointments = [
  { client: 'Alice', time: new Date('2025-01-20T09:00:00') },
  { client: 'Bob', time: new Date('2025-01-20T14:30:00') },
  { client: 'Charlie', time: new Date('2025-01-20T18:00:00') }
];

// Appointments during business hours (9 AM - 5 PM)
filter(appointments, {
  time: { $timeOfDay: { start: 9, end: 17 } }
});`,
  },
  {
    id: 'datetime-weekday',
    name: 'Datetime - Weekday Events',
    code: `import { filter } from '@mcabreradev/filter';

const events = [
  { name: 'Monday Meeting', date: new Date('2025-01-20') },
  { name: 'Saturday Party', date: new Date('2025-01-25') },
  { name: 'Wednesday Workshop', date: new Date('2025-01-22') }
];

// Weekday events only (Monday-Friday)
filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] }
});`,
  },
  {
    id: 'datetime-age',
    name: 'Datetime - Age Filtering',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', birthDate: new Date('2000-01-01') },
  { name: 'Bob', birthDate: new Date('2005-05-15') },
  { name: 'Charlie', birthDate: new Date('1990-08-22') },
  { name: 'Diana', birthDate: new Date('2010-12-05') }
];

// Adults (18-65 years old)
filter(users, {
  birthDate: { $age: { min: 18, max: 65 } }
});`,
  },
  {
    id: 'datetime-combined',
    name: 'Datetime - Combined Filters',
    code: `import { filter } from '@mcabreradev/filter';

const events = [
  { 
    name: 'Team Meeting', 
    date: new Date('2025-01-20'),
    startTime: new Date('2025-01-20T09:00:00')
  },
  { 
    name: 'Weekend Workshop', 
    date: new Date('2025-01-25'),
    startTime: new Date('2025-01-25T10:00:00')
  },
  { 
    name: 'Evening Event', 
    date: new Date('2025-01-22'),
    startTime: new Date('2025-01-22T18:00:00')
  }
];

// Upcoming weekday events during business hours
filter(events, {
  date: {
    $upcoming: { days: 30 },
    $dayOfWeek: [1, 2, 3, 4, 5]
  },
  startTime: {
    $timeOfDay: { start: 9, end: 17 }
  }
});`,
  },
];
