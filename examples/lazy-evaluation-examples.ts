import {
  filter,
  filterLazy,
  filterLazyAsync,
  filterFirst,
  filterExists,
  filterCount,
  filterChunked,
  filterLazyChunked,
  take,
  skip,
  map,
  toArray,
} from '../src/index';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  active: boolean;
  premium: boolean;
  role: string;
}

const users: User[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
    city: 'Berlin',
    active: true,
    premium: true,
    role: 'admin',
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
    age: 25,
    city: 'London',
    active: true,
    premium: false,
    role: 'user',
  },
  {
    id: 3,
    name: 'Charlie',
    email: 'charlie@example.com',
    age: 35,
    city: 'Berlin',
    active: false,
    premium: true,
    role: 'user',
  },
  {
    id: 4,
    name: 'David',
    email: 'david@example.com',
    age: 28,
    city: 'Paris',
    active: true,
    premium: false,
    role: 'user',
  },
  {
    id: 5,
    name: 'Eve',
    email: 'eve@example.com',
    age: 32,
    city: 'Berlin',
    active: true,
    premium: true,
    role: 'moderator',
  },
];

console.log('=== Lazy Evaluation Examples ===\n');

console.log('1. Basic Lazy Filtering');
const lazyFiltered = filterLazy(users, { city: 'Berlin' });
console.log('Lazy iterator created (not executed yet)');
const berlinUsers = toArray(lazyFiltered);
console.log(
  'Berlin users:',
  berlinUsers.map((u) => u.name),
);
console.log();

console.log('2. Early Exit with filterFirst');
console.log('Standard filter would process all 5 users');
const standardResult = filter(users, { active: true });
console.log('Standard result:', standardResult.length, 'users');

console.log('filterFirst stops after finding 2 matches');
const firstTwo = filterFirst(users, { active: true }, 2);
console.log(
  'First 2 active users:',
  firstTwo.map((u) => u.name),
);
console.log();

console.log('3. Existence Check with filterExists');
const hasAdmin = filterExists(users, { role: 'admin' });
console.log('Has admin?', hasAdmin);

const hasGuest = filterExists(users, { role: 'guest' });
console.log('Has guest?', hasGuest);
console.log();

console.log('4. Count Matches with filterCount');
const activeCount = filterCount(users, { active: true });
console.log('Active users count:', activeCount);

const premiumCount = filterCount(users, { premium: true });
console.log('Premium users count:', premiumCount);
console.log();

console.log('5. Chunked Processing');
const chunks = filterChunked(users, { active: true }, 2);
console.log('Chunks:', chunks.length);
chunks.forEach((chunk, i) => {
  console.log(
    `  Chunk ${i + 1}:`,
    chunk.map((u) => u.name),
  );
});
console.log();

console.log('6. Lazy Chunked Processing');
console.log('Processing chunks lazily...');
for (const chunk of filterLazyChunked(users, { active: true }, 2)) {
  console.log(
    '  Processing chunk:',
    chunk.map((u) => u.name),
  );
}
console.log();

console.log('7. Composing Lazy Operations');
const result = toArray(
  take(
    map(skip(filterLazy(users, { active: true }), 1), (u) => ({ id: u.id, name: u.name })),
    2,
  ),
);
console.log('Composed result (skip 1, map, take 2):', result);
console.log();

console.log('8. Pagination Example');
function paginate<T>(data: T[], expression: unknown, page: number, pageSize: number) {
  return toArray(take(skip(filterLazy(data, expression), page * pageSize), pageSize));
}

const page1 = paginate(users, { active: true }, 0, 2);
console.log(
  'Page 1 (2 items):',
  page1.map((u) => u.name),
);

const page2 = paginate(users, { active: true }, 1, 2);
console.log(
  'Page 2 (2 items):',
  page2.map((u) => u.name),
);
console.log();

console.log('9. Async Lazy Filtering');
async function* asyncUsers(): AsyncGenerator<User, void, undefined> {
  for (const user of users) {
    await new Promise((resolve) => setTimeout(resolve, 10));
    yield user;
  }
}

(async () => {
  console.log('Filtering async stream...');
  const asyncFiltered = filterLazyAsync(asyncUsers(), { city: 'Berlin' });
  const asyncResult: User[] = [];

  for await (const user of asyncFiltered) {
    asyncResult.push(user);
  }

  console.log(
    'Async result:',
    asyncResult.map((u) => u.name),
  );
  console.log();

  console.log('10. Performance Comparison');
  const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    age: 20 + (i % 50),
    city: i % 3 === 0 ? 'Berlin' : i % 3 === 1 ? 'London' : 'Paris',
    active: i % 2 === 0,
    premium: i % 5 === 0,
    role: i % 10 === 0 ? 'admin' : 'user',
  }));

  console.log(`Dataset size: ${largeDataset.length.toLocaleString()} records`);

  console.time('Standard filter (all results)');
  const standardAll = filter(largeDataset, { city: 'Berlin' });
  console.timeEnd('Standard filter (all results)');
  console.log(`  Found: ${standardAll.length.toLocaleString()} results`);

  console.time('filterFirst (first 10)');
  const first10 = filterFirst(largeDataset, { city: 'Berlin' }, 10);
  console.timeEnd('filterFirst (first 10)');
  console.log(`  Found: ${first10.length} results`);

  console.time('filterExists (existence check)');
  const exists = filterExists(largeDataset, { role: 'admin' });
  console.timeEnd('filterExists (existence check)');
  console.log(`  Exists: ${exists}`);

  console.time('filterCount (count all)');
  const count = filterCount(largeDataset, { city: 'Berlin' });
  console.timeEnd('filterCount (count all)');
  console.log(`  Count: ${count.toLocaleString()}`);

  console.log('\n11. Memory Efficiency');
  console.log('Standard filter creates array with all results in memory');
  console.log('Lazy filter processes items one at a time');

  let processedCount = 0;
  const lazyResult = filterLazy(largeDataset, (item) => {
    processedCount++;
    return item.city === 'Berlin';
  });

  console.log('Lazy iterator created, items processed:', processedCount);

  const iterator = lazyResult[Symbol.iterator]();
  iterator.next();
  iterator.next();
  iterator.next();

  console.log('After consuming 3 items, total processed:', processedCount);
  console.log('(Standard filter would have processed all 100,000 items)');

  console.log('\n=== All Examples Completed ===');
})();
