import { filter } from '../src';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  score: number;
}

const users: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 28,
    tags: ['admin', 'verified'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    score: 95,
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@company.com',
    age: 35,
    tags: ['user', 'premium'],
    isActive: true,
    createdAt: new Date('2023-06-20'),
    score: 87,
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    age: 42,
    tags: ['user'],
    isActive: false,
    createdAt: new Date('2022-11-10'),
    score: 72,
  },
];

console.log('=== Autocomplete Demo Examples ===\n');

console.log('1. Number operators (age):');
const youngAdults = filter(users, {
  age: {
    $gte: 25,
    $lt: 40,
  },
});
console.log(youngAdults.map((u) => `${u.name} (${u.age})`));

console.log('\n2. String operators (name):');
const namesStartingWithA = filter(users, {
  name: {
    $startsWith: 'A',
  },
});
console.log(namesStartingWithA.map((u) => u.name));

console.log('\n3. String operators with regex (email):');
const companyEmails = filter(users, {
  email: {
    $regex: /@company\.com$/,
  },
});
console.log(companyEmails.map((u) => u.email));

console.log('\n4. Array operators (tags):');
const verifiedUsers = filter(users, {
  tags: {
    $contains: 'verified',
  },
});
console.log(verifiedUsers.map((u) => `${u.name} - tags: ${u.tags.join(', ')}`));

console.log('\n5. Boolean operators (isActive):');
const activeUsers = filter(users, {
  isActive: {
    $eq: true,
  },
});
console.log(activeUsers.map((u) => `${u.name} - Active: ${u.isActive}`));

console.log('\n6. Date operators (createdAt):');
const recentUsers = filter(users, {
  createdAt: {
    $gte: new Date('2024-01-01'),
  },
});
console.log(recentUsers.map((u) => `${u.name} - Joined: ${u.createdAt.toLocaleDateString()}`));

console.log('\n7. Combined operators:');
const premiumActiveUsers = filter(users, {
  age: { $gte: 30 },
  tags: { $contains: 'premium' },
  isActive: { $eq: true },
  score: { $gt: 80 },
});
console.log(premiumActiveUsers.map((u) => `${u.name} - Score: ${u.score}`));

console.log('\n8. Logical operators with autocomplete:');
const specialUsers = filter(users, {
  $or: [{ age: { $lt: 30 } }, { score: { $gte: 90 } }],
  isActive: { $eq: true },
});
console.log(specialUsers.map((u) => `${u.name} - Age: ${u.age}, Score: ${u.score}`));

console.log('\n=== Try these in your editor with Ctrl+Space! ===');
console.log('TypeScript will suggest only valid operators for each property type.');
