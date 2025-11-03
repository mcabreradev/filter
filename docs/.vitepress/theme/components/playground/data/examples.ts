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
    id: 'operators-comparison',
    name: 'MongoDB - Comparison Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', price: 1200, rating: 4.5, stock: 15 },
  { name: 'Mouse', price: 25, rating: 4.0, stock: 150 },
  { name: 'Monitor', price: 450, rating: 4.8, stock: 30 },
  { name: 'Keyboard', price: 75, rating: 4.3, stock: 80 }
];

// Price range: $100-$500, rating >= 4.5
filter(products, {
  price: { $gte: 100, $lte: 500 },
  rating: { $gte: 4.5 }
});`,
  },
  {
    id: 'operators-array',
    name: 'MongoDB - Array Operators',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', role: 'admin', tags: ['vip', 'premium', 'verified'] },
  { name: 'Bob', role: 'user', tags: ['new', 'trial'] },
  { name: 'Charlie', role: 'moderator', tags: ['staff', 'verified'] },
  { name: 'Diana', role: 'user', tags: ['premium', 'verified'] }
];

// Users with admin or moderator roles
filter(users, {
  role: { $in: ['admin', 'moderator'] }
});`,
  },
  {
    id: 'operators-string',
    name: 'MongoDB - String Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop Pro 15', category: 'Electronics', sku: 'ELEC-LAP-001' },
  { name: 'Gaming Mouse', category: 'Electronics', sku: 'ELEC-MOU-002' },
  { name: 'Office Desk', category: 'Furniture', sku: 'FURN-DSK-001' },
  { name: 'Laptop Stand', category: 'Accessories', sku: 'ACCE-STD-003' }
];

// Products starting with "Laptop"
filter(products, {
  name: { $startsWith: 'Laptop' }
});`,
  },
  {
    id: 'operators-regex',
    name: 'MongoDB - Regex Operators',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { username: 'alice123', email: 'alice@example.com', phone: '+1-555-1234' },
  { username: 'bob_smith', email: 'bob@test.com', phone: '+1-555-5678' },
  { username: 'charlie99', email: 'charlie@example.com', phone: '+44-20-1234' },
  { username: 'diana_w', email: 'diana@example.org', phone: '+1-555-9012' }
];

// Users with numeric usernames
filter(users, {
  username: { $regex: '^[a-z]+[0-9]+$' }
});`,
  },
  {
    id: 'operators-combined',
    name: 'MongoDB - Combined Operators',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Pro Laptop 15', price: 1200, rating: 4.7, tags: ['electronics', 'premium'] },
  { name: 'Wireless Mouse', price: 25, rating: 4.0, tags: ['electronics', 'budget'] },
  { name: 'Pro Monitor 27', price: 450, rating: 4.8, tags: ['electronics', 'premium'] },
  { name: 'Basic Keyboard', price: 30, rating: 3.5, tags: ['electronics', 'budget'] }
];

// Premium electronics, well-rated, reasonable price
filter(products, {
  name: { $startsWith: 'Pro' },
  price: { $gte: 100, $lte: 600 },
  rating: { $gte: 4.5 },
  tags: { $contains: 'premium' }
});`,
  },
  {
    id: 'wildcard-contains',
    name: 'Wildcard - Contains Pattern',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'MacBook Pro 15', category: 'Laptops' },
  { name: 'iPad Pro', category: 'Tablets' },
  { name: 'iPhone 15 Pro', category: 'Phones' },
  { name: 'Mac Mini', category: 'Desktops' }
];

// All "Pro" products
filter(products, '%Pro%');`,
  },
  {
    id: 'wildcard-startswith',
    name: 'Wildcard - Starts With Pattern',
    code: `import { filter } from '@mcabreradev/filter';

const files = [
  { filename: 'report_2025.pdf', size: 1024, type: 'document' },
  { filename: 'image_001.png', size: 2048, type: 'image' },
  { filename: 'report_draft.pdf', size: 512, type: 'document' },
  { filename: 'data.json', size: 256, type: 'data' }
];

// All files starting with "report"
filter(files, 'report%');`,
  },
  {
    id: 'wildcard-endswith',
    name: 'Wildcard - Ends With Pattern',
    code: `import { filter } from '@mcabreradev/filter';

const emails = [
  { email: 'alice@example.com', domain: 'example.com', verified: true },
  { email: 'bob@test.com', domain: 'test.com', verified: false },
  { email: 'charlie@example.com', domain: 'example.com', verified: true },
  { email: 'diana@company.org', domain: 'company.org', verified: true }
];

// All @example.com emails
filter(emails, '%@example.com');`,
  },
  {
    id: 'wildcard-negation',
    name: 'Wildcard - Negation Pattern',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', role: 'admin', status: 'active' },
  { name: 'Bob', role: 'user', status: 'active' },
  { name: 'Charlie', role: 'admin', status: 'inactive' },
  { name: 'Diana', role: 'moderator', status: 'active' }
];

// All non-admin users
filter(users, '!admin');`,
  },
  {
    id: 'wildcard-single-char',
    name: 'Wildcard - Single Character (_)',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { code: 'A1', name: 'Product A1', category: 'Type 1' },
  { code: 'A2', name: 'Product A2', category: 'Type 2' },
  { code: 'B1', name: 'Product B1', category: 'Type 1' },
  { code: 'AB1', name: 'Product AB1', category: 'Type 1' }
];

// Codes with exactly 2 characters
filter(products, '__');`,
  },
  {
    id: 'wildcard-complex',
    name: 'Wildcard - Complex Patterns',
    code: `import { filter } from '@mcabreradev/filter';

const files = [
  { path: 'src/components/Button.tsx', type: 'component' },
  { path: 'src/components/Input.tsx', type: 'component' },
  { path: 'src/utils/helpers.ts', type: 'utility' },
  { path: 'tests/Button.test.tsx', type: 'test' },
  { path: 'src/pages/Home.tsx', type: 'page' }
];

// All TypeScript React components in src
filter(files, 'src/components/%.tsx');`,
  },
  {
    id: 'logical-and',
    name: 'Logical - $and Operator',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop', category: 'Electronics', price: 1200, inStock: true, rating: 4.5 },
  { name: 'Desk', category: 'Furniture', price: 300, inStock: false, rating: 4.2 },
  { name: 'Mouse', category: 'Electronics', price: 25, inStock: true, rating: 4.0 },
  { name: 'Chair', category: 'Furniture', price: 200, inStock: true, rating: 4.7 }
];

// Electronics AND in stock AND well-rated
filter(products, {
  $and: [
    { category: 'Electronics' },
    { inStock: true },
    { rating: { $gte: 4.5 } }
  ]
});`,
  },
  {
    id: 'logical-or',
    name: 'Logical - $or Operator',
    code: `import { filter } from '@mcabreradev/filter';

const users = [
  { name: 'Alice', role: 'admin', premium: true, verified: true },
  { name: 'Bob', role: 'user', premium: false, verified: true },
  { name: 'Charlie', role: 'moderator', premium: false, verified: false },
  { name: 'Diana', role: 'user', premium: true, verified: false }
];

// Admin OR premium OR verified users
filter(users, {
  $or: [
    { role: 'admin' },
    { premium: true },
    { verified: true }
  ]
});`,
  },
  {
    id: 'logical-not',
    name: 'Logical - $not Operator',
    code: `import { filter } from '@mcabreradev/filter';

const tasks = [
  { title: 'Review PR', status: 'completed', priority: 'high' },
  { title: 'Fix bug', status: 'in-progress', priority: 'urgent' },
  { title: 'Write docs', status: 'pending', priority: 'low' },
  { title: 'Deploy', status: 'completed', priority: 'high' }
];

// All non-completed tasks
filter(tasks, {
  $not: { status: 'completed' }
});`,
  },
  {
    id: 'logical-nested',
    name: 'Logical - Nested Conditions',
    code: `import { filter } from '@mcabreradev/filter';

const products = [
  { name: 'Laptop Pro', category: 'Electronics', price: 1200, inStock: true, rating: 4.8, onSale: false },
  { name: 'Mouse RGB', category: 'Electronics', price: 45, inStock: true, rating: 4.2, onSale: true },
  { name: 'Monitor 4K', category: 'Electronics', price: 450, inStock: false, rating: 4.9, onSale: false },
  { name: 'Desk Lamp', category: 'Furniture', price: 35, inStock: true, rating: 4.5, onSale: true }
];

// (High-rated OR on-sale) AND in-stock AND affordable
filter(products, {
  $and: [
    { inStock: true },
    { price: { $lte: 500 } },
    {
      $or: [
        { rating: { $gte: 4.5 } },
        { onSale: true }
      ]
    }
  ]
});`,
  },
  {
    id: 'logical-complex',
    name: 'Logical - Complex Multi-Level',
    code: `import { filter } from '@mcabreradev/filter';

const orders = [
  { id: 1, status: 'shipped', amount: 250, express: true, customer: 'premium' },
  { id: 2, status: 'pending', amount: 1500, express: false, customer: 'regular' },
  { id: 3, status: 'delivered', amount: 800, express: true, customer: 'premium' },
  { id: 4, status: 'cancelled', amount: 120, express: false, customer: 'regular' }
];

// Complex business logic
filter(orders, {
  $and: [
    { $not: { status: 'cancelled' } },
    {
      $or: [
        { amount: { $gte: 1000 } },
        {
          $and: [
            { express: true },
            { customer: 'premium' }
          ]
        }
      ]
    }
  ]
});`,
  },
  {
    id: 'geospatial-near',
    name: 'Geospatial - $near (Proximity)',
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
    id: 'geospatial-geobox',
    name: 'Geospatial - $geoBox (Bounding Box)',
    code: `import { filter } from '@mcabreradev/filter';

const stores = [
  { name: 'Downtown Store', location: { lat: 52.52, lng: 13.405 }, type: 'flagship' },
  { name: 'East Store', location: { lat: 52.53, lng: 13.45 }, type: 'outlet' },
  { name: 'West Store', location: { lat: 52.51, lng: 13.35 }, type: 'standard' },
  { name: 'Central Store', location: { lat: 52.525, lng: 13.41 }, type: 'standard' }
];

// Find stores within a bounding box (Berlin city center area)
filter(stores, {
  location: {
    $geoBox: {
      southwest: { lat: 52.51, lng: 13.40 },
      northeast: { lat: 52.53, lng: 13.42 }
    }
  }
});`,
  },
  {
    id: 'geospatial-geopolygon',
    name: 'Geospatial - $geoPolygon (Custom Area)',
    code: `import { filter } from '@mcabreradev/filter';

const properties = [
  { address: '123 Main St', location: { lat: 51.507, lng: -0.128 }, price: 500000 },
  { address: '456 Park Ave', location: { lat: 51.510, lng: -0.125 }, price: 750000 },
  { address: '789 King Rd', location: { lat: 51.505, lng: -0.130 }, price: 600000 },
  { address: '321 Queen St', location: { lat: 51.515, lng: -0.120 }, price: 900000 }
];

// Find properties within a custom polygon (specific neighborhood)
filter(properties, {
  location: {
    $geoPolygon: {
      points: [
        { lat: 51.506, lng: -0.130 },
        { lat: 51.512, lng: -0.120 },
        { lat: 51.508, lng: -0.125 },
        { lat: 51.504, lng: -0.127 }
      ]
    }
  }
});`,
  },
  {
    id: 'geospatial-combined',
    name: 'Geospatial - Combined with Filters',
    code: `import { filter } from '@mcabreradev/filter';

const restaurants = [
  { name: 'Berlin Bistro', location: { lat: 52.52, lng: 13.405 }, rating: 4.5, priceLevel: 2, cuisine: 'German' },
  { name: 'Pasta Paradise', location: { lat: 52.521, lng: 13.406 }, rating: 4.8, priceLevel: 3, cuisine: 'Italian' },
  { name: 'Sushi Spot', location: { lat: 52.53, lng: 13.42 }, rating: 4.6, priceLevel: 4, cuisine: 'Japanese' },
  { name: 'Burger House', location: { lat: 52.525, lng: 13.415 }, rating: 3.9, priceLevel: 1, cuisine: 'American' }
];

const userLocation = { lat: 52.52, lng: 13.405 };

// Find nearby, highly-rated, affordable restaurants
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 3000
    }
  },
  rating: { $gte: 4.5 },
  priceLevel: { $lte: 3 }
});`,
  },
  {
    id: 'geospatial-delivery',
    name: 'Geospatial - Delivery Zone',
    code: `import { filter } from '@mcabreradev/filter';

const customers = [
  { name: 'Alice', address: { lat: 40.7589, lng: -73.9851 }, orderValue: 45 },
  { name: 'Bob', address: { lat: 40.7614, lng: -73.9776 }, orderValue: 120 },
  { name: 'Charlie', address: { lat: 40.7489, lng: -73.9680 }, orderValue: 85 },
  { name: 'Diana', address: { lat: 40.7128, lng: -74.0060 }, orderValue: 30 }
];

const storeLocation = { lat: 40.7580, lng: -73.9855 };

// Find customers within delivery radius (5km)
filter(customers, {
  address: {
    $near: {
      center: storeLocation,
      maxDistanceMeters: 5000
    }
  }
});`,
  },
  {
    id: 'geospatial-zone-pricing',
    name: 'Geospatial - Zone-Based Pricing',
    code: `import { filter } from '@mcabreradev/filter';

const serviceAreas = [
  { zone: 'Zone A', location: { lat: 52.520, lng: 13.405 }, basePrice: 50, surcharge: 0 },
  { zone: 'Zone B', location: { lat: 52.525, lng: 13.410 }, basePrice: 50, surcharge: 5 },
  { zone: 'Zone C', location: { lat: 52.535, lng: 13.425 }, basePrice: 50, surcharge: 10 },
  { zone: 'Zone D', location: { lat: 52.510, lng: 13.395 }, basePrice: 50, surcharge: 0 }
];

// Define premium zone bounding box
filter(serviceAreas, {
  location: {
    $geoBox: {
      southwest: { lat: 52.518, lng: 13.400 },
      northeast: { lat: 52.528, lng: 13.415 }
    }
  },
  surcharge: { $lte: 5 }
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
