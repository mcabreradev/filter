import { filterDebug } from '../src';

interface User {
  id: number;
  name: string;
  age: number;
  city: string;
  premium: boolean;
  tags: string[];
  registeredAt: Date;
}

const users: User[] = [
  {
    id: 1,
    name: 'Alice',
    age: 25,
    city: 'Berlin',
    premium: true,
    tags: ['developer', 'senior'],
    registeredAt: new Date('2023-01-15'),
  },
  {
    id: 2,
    name: 'Bob',
    age: 30,
    city: 'Berlin',
    premium: false,
    tags: ['designer'],
    registeredAt: new Date('2023-03-20'),
  },
  {
    id: 3,
    name: 'Charlie',
    age: 28,
    city: 'Paris',
    premium: true,
    tags: ['developer'],
    registeredAt: new Date('2023-02-10'),
  },
  {
    id: 4,
    name: 'Diana',
    age: 22,
    city: 'Berlin',
    premium: false,
    tags: ['developer', 'junior'],
    registeredAt: new Date('2023-05-01'),
  },
  {
    id: 5,
    name: 'Eve',
    age: 35,
    city: 'London',
    premium: true,
    tags: ['manager'],
    registeredAt: new Date('2023-01-05'),
  },
  {
    id: 6,
    name: 'Frank',
    age: 27,
    city: 'Berlin',
    premium: true,
    tags: ['developer', 'senior'],
    registeredAt: new Date('2023-04-12'),
  },
];

console.log('=== Example 1: Basic Debug Usage ===\n');

const result1 = filterDebug(users, { city: 'Berlin' });
result1.print();

console.log('\n=== Example 2: Complex Nested Expression ===\n');

const result2 = filterDebug(users, {
  $and: [{ city: 'Berlin' }, { $or: [{ age: { $lt: 30 } }, { premium: true }] }],
});
result2.print();

console.log('\n=== Example 3: Verbose Mode ===\n');

const result3 = filterDebug(
  users,
  {
    $and: [{ city: 'Berlin' }, { tags: { $contains: 'developer' } }],
  },
  { verbose: true, showTimings: true },
);
result3.print();

console.log('\n=== Example 4: Colorized Output ===\n');

const result4 = filterDebug(
  users,
  {
    $or: [{ premium: true }, { age: { $lt: 25 } }],
  },
  { colorize: true, showTimings: true },
);
result4.print();

console.log('\n=== Example 5: Programmatic Access to Stats ===\n');

const result5 = filterDebug(users, { age: { $gte: 30 } });
console.log(
  'Matched users:',
  result5.items.map((u) => u.name),
);
console.log('Match count:', result5.stats.matched);
console.log('Total count:', result5.stats.total);
console.log('Percentage:', result5.stats.percentage.toFixed(1) + '%');
console.log('Execution time:', result5.stats.executionTime.toFixed(2) + 'ms');
console.log('Conditions evaluated:', result5.stats.conditionsEvaluated);

console.log('\n=== Example 6: E-commerce Scenario ===\n');

const result6 = filterDebug(users, {
  $and: [
    { premium: true },
    {
      $or: [
        { city: 'Berlin' },
        { $and: [{ age: { $gte: 30 } }, { tags: { $contains: 'manager' } }] },
      ],
    },
  ],
});
result6.print();

console.log('\n=== Example 7: Multiple Comparison Operators ===\n');

const result7 = filterDebug(users, {
  age: { $gte: 25, $lte: 30 },
  city: 'Berlin',
});
result7.print();

console.log('\n=== Example 8: Array OR Syntax ===\n');

const result8 = filterDebug(users, {
  city: ['Berlin', 'Paris', 'London'],
  premium: true,
});
result8.print();

console.log('\n=== Example 9: NOT Operator ===\n');

const result9 = filterDebug(users, {
  $not: {
    $or: [{ city: 'Berlin' }, { age: { $lt: 25 } }],
  },
});
result9.print();

console.log('\n=== Example 10: Custom Predicate Function ===\n');

const result10 = filterDebug(users, (user) => user.name.startsWith('A') || user.age > 30);
result10.print();

console.log('\n=== Example 11: Date Comparison ===\n');

const result11 = filterDebug(users, {
  registeredAt: { $gte: new Date('2023-03-01') },
  premium: true,
});
result11.print();

console.log('\n=== Example 12: Complex Real-World Query ===\n');

const result12 = filterDebug(users, {
  $and: [
    {
      $or: [{ city: 'Berlin' }, { city: 'Paris' }],
    },
    {
      $or: [{ premium: true }, { age: { $lt: 28 } }],
    },
    { tags: { $contains: 'developer' } },
  ],
});
result12.print();

console.log('\n=== Accessing Debug Tree Structure ===\n');
console.log('Tree type:', result12.tree.type);
console.log('Tree operator:', result12.tree.operator);
console.log('Number of children:', result12.tree.children?.length);
