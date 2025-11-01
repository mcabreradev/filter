import { filter } from '../src';

interface Event {
  name: string;
  date: Date;
  startTime: Date;
  duration: number;
}

interface User {
  name: string;
  email: string;
  birthDate: Date;
  lastLogin: Date;
  registeredAt: Date;
}

interface Product {
  name: string;
  saleStart: Date;
  saleEnd: Date;
  price: number;
}

interface Appointment {
  patientName: string;
  scheduledAt: Date;
  duration: number;
  status: string;
}

interface Order {
  id: string;
  createdAt: Date;
  completedAt: Date | null;
  amount: number;
}

const events: Event[] = [
  {
    name: 'Team Meeting',
    date: new Date('2025-01-20'),
    startTime: new Date('2025-01-20T09:00:00'),
    duration: 60,
  },
  {
    name: 'Conference',
    date: new Date('2025-02-15'),
    startTime: new Date('2025-02-15T14:00:00'),
    duration: 180,
  },
  {
    name: 'Workshop',
    date: new Date('2025-01-18'),
    startTime: new Date('2025-01-18T10:00:00'),
    duration: 120,
  },
  {
    name: 'Webinar',
    date: new Date('2025-01-25'),
    startTime: new Date('2025-01-25T18:00:00'),
    duration: 90,
  },
];

const users: User[] = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    birthDate: new Date('1995-03-15'),
    lastLogin: new Date('2025-01-14T10:30:00'),
    registeredAt: new Date('2024-06-01'),
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    birthDate: new Date('2005-07-20'),
    lastLogin: new Date('2025-01-10T15:20:00'),
    registeredAt: new Date('2024-08-15'),
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    birthDate: new Date('1988-11-30'),
    lastLogin: new Date('2024-12-28T09:00:00'),
    registeredAt: new Date('2023-01-10'),
  },
  {
    name: 'Diana Prince',
    email: 'diana@example.com',
    birthDate: new Date('2010-05-10'),
    lastLogin: new Date('2025-01-15T14:45:00'),
    registeredAt: new Date('2024-12-01'),
  },
];

const products: Product[] = [
  {
    name: 'Laptop Pro',
    saleStart: new Date('2025-01-14T00:00:00'),
    saleEnd: new Date('2025-01-17T23:59:59'),
    price: 1299,
  },
  {
    name: 'Wireless Mouse',
    saleStart: new Date('2025-01-10T00:00:00'),
    saleEnd: new Date('2025-01-20T23:59:59'),
    price: 49,
  },
  {
    name: 'Monitor 4K',
    saleStart: new Date('2025-02-01T00:00:00'),
    saleEnd: new Date('2025-02-07T23:59:59'),
    price: 599,
  },
];

const appointments: Appointment[] = [
  {
    patientName: 'John Doe',
    scheduledAt: new Date('2025-01-20T09:00:00'),
    duration: 30,
    status: 'confirmed',
  },
  {
    patientName: 'Jane Smith',
    scheduledAt: new Date('2025-01-20T14:30:00'),
    duration: 45,
    status: 'confirmed',
  },
  {
    patientName: 'Mike Johnson',
    scheduledAt: new Date('2025-01-18T10:00:00'),
    duration: 60,
    status: 'completed',
  },
  {
    patientName: 'Sarah Williams',
    scheduledAt: new Date('2025-01-22T16:00:00'),
    duration: 30,
    status: 'pending',
  },
];

const orders: Order[] = [
  {
    id: 'ORD001',
    createdAt: new Date('2025-01-14T10:00:00'),
    completedAt: new Date('2025-01-14T15:00:00'),
    amount: 150,
  },
  {
    id: 'ORD002',
    createdAt: new Date('2025-01-10T09:00:00'),
    completedAt: new Date('2025-01-12T11:00:00'),
    amount: 320,
  },
  {
    id: 'ORD003',
    createdAt: new Date('2025-01-15T14:00:00'),
    completedAt: null,
    amount: 85,
  },
  {
    id: 'ORD004',
    createdAt: new Date('2025-01-08T16:00:00'),
    completedAt: new Date('2025-01-09T10:00:00'),
    amount: 200,
  },
];

console.log('=== Event Management Examples ===\n');

filter(events, {
  date: { $upcoming: { days: 7 } },
});

filter(events, {
  date: { $dayOfWeek: [1, 2, 3, 4, 5] },
});

filter(events, {
  startTime: { $timeOfDay: { start: 9, end: 17 } },
});

filter(events, {
  date: { $upcoming: { days: 30 } },
  startTime: { $timeOfDay: { start: 9, end: 17 } },
});

console.log('\n=== User Management Examples ===\n');

filter(users, {
  birthDate: { $age: { min: 18, max: 65 } },
});

filter(users, {
  lastLogin: { $recent: { days: 7 } },
});

filter(users, {
  birthDate: { $age: { min: 18 } },
  lastLogin: { $recent: { days: 30 } },
});

filter(users, {
  birthDate: { $age: { max: 18 } },
});

filter(users, {
  registeredAt: { $recent: { days: 180 } },
});

console.log('\n=== E-commerce Flash Sales Examples ===\n');

filter(products, {
  saleStart: { $recent: { days: 7 } },
  saleEnd: { $upcoming: { days: 7 } },
});

filter(products, {
  saleEnd: { $upcoming: { hours: 24 } },
});

filter(products, {
  saleStart: { $recent: { hours: 48 } },
});

console.log('\n=== Appointment Scheduling Examples ===\n');

filter(appointments, {
  scheduledAt: {
    $dayOfWeek: [1, 2, 3, 4, 5],
    $timeOfDay: { start: 9, end: 17 },
  },
});

filter(appointments, {
  scheduledAt: { $upcoming: { days: 7 } },
});

filter(appointments, {
  scheduledAt: {
    $upcoming: { days: 7 },
    $timeOfDay: { start: 14, end: 18 },
  },
});

console.log('\n=== Analytics & Reporting Examples ===\n');

filter(orders, {
  createdAt: { $recent: { days: 7 } },
});

filter(orders, {
  completedAt: { $recent: { days: 3 } },
});

filter(orders, {
  createdAt: { $recent: { days: 7 } },
  completedAt: { $recent: { days: 3 } },
});

console.log('\n=== Advanced Filtering Scenarios ===\n');

filter(users, {
  lastLogin: {
    $recent: { days: 30 },
    $isWeekday: true,
    $timeOfDay: { start: 9, end: 17 },
  },
});

filter(appointments, {
  scheduledAt: {
    $upcoming: { days: 7 },
    $dayOfWeek: [1, 2, 3, 4, 5],
    $timeOfDay: { start: 9, end: 17 },
  },
});

filter(events, {
  date: { $upcoming: { days: 14 } },
  startTime: {
    $dayOfWeek: [1, 2, 3, 4, 5],
    $timeOfDay: { start: 10, end: 16 },
  },
});

console.log('\n=== Comparison with Existing Operators ===\n');

filter(events, {
  date: { $gt: new Date('2025-01-15') },
});

filter(events, {
  date: { $isAfter: new Date('2025-01-15') },
});

filter(orders, {
  createdAt: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-01-31'),
  },
});

console.log('\n=== Real-world Use Cases ===\n');

filter(users, {
  birthDate: { $age: { min: 13 } },
  lastLogin: { $recent: { days: 90 } },
});

filter(products, {
  saleStart: { $recent: { hours: 24 } },
  saleEnd: { $upcoming: { hours: 48 } },
});

filter(appointments, {
  scheduledAt: {
    $upcoming: { hours: 24 },
    $timeOfDay: { start: 9, end: 12 },
  },
});

filter(orders, {
  createdAt: { $recent: { days: 30 } },
  completedAt: null,
});

filter(users, {
  birthDate: { $age: { min: 18, max: 25 } },
  registeredAt: { $recent: { days: 30 } },
});
