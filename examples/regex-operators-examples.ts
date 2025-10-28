import { filter } from '../src';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  username: string;
  zipCode: string;
}

const users: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1-555-0101',
    username: 'alice123',
    zipCode: '12345',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@test.org',
    phone: '+1-555-0202',
    username: 'bob_user',
    zipCode: '67890',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '+44-555-0303',
    username: 'charlie99',
    zipCode: 'AB123',
  },
  {
    id: 4,
    name: 'Diana Prince',
    email: 'diana@example.org',
    phone: '+1-555-0404',
    username: 'diana_wp',
    zipCode: '54321',
  },
  {
    id: 5,
    name: 'Eve Adams',
    email: 'eve.adams@test.com',
    phone: '+44-555-0505',
    username: 'eve2024',
    zipCode: 'CD456',
  },
];

console.log('=== $regex Operator Examples ===\n');

console.log('1. Find emails ending with .com:');
console.log(filter(users, { email: { $regex: '\\.com$' } }).map((u) => `${u.name}: ${u.email}`));

console.log('\n2. Find usernames with numbers at the end:');
console.log(
  filter(users, { username: { $regex: '\\d+$' } }).map((u) => `${u.name}: ${u.username}`),
);

console.log('\n3. Find US phone numbers (+1):');
console.log(filter(users, { phone: { $regex: '^\\+1-' } }).map((u) => `${u.name}: ${u.phone}`));

console.log('\n4. Find numeric-only zip codes:');
console.log(filter(users, { zipCode: { $regex: '^\\d+$' } }).map((u) => `${u.name}: ${u.zipCode}`));

console.log('\n5. Using RegExp object for email validation:');
console.log(
  filter(users, { email: { $regex: /^[a-z]+@[a-z]+\.(com|org)$/ } }).map(
    (u) => `${u.name}: ${u.email}`,
  ),
);

console.log('\n6. Find names with two words:');
console.log(filter(users, { name: { $regex: '^[A-Z][a-z]+ [A-Z][a-z]+$' } }).map((u) => u.name));

console.log('\n7. Find usernames with underscores:');
console.log(filter(users, { username: { $regex: '_' } }).map((u) => `${u.name}: ${u.username}`));

console.log('\n=== $match Operator Examples (alias of $regex) ===\n');

console.log('8. Find names starting with vowels:');
console.log(filter(users, { name: { $match: '^[AEIOU]' } }).map((u) => u.name));

console.log('\n9. Find emails with dots in the local part:');
console.log(
  filter(users, { email: { $match: '^[a-z]+\\.[a-z]+@' } }).map((u) => `${u.name}: ${u.email}`),
);

console.log('\n10. Find UK phone numbers (+44):');
console.log(filter(users, { phone: { $match: '^\\+44-' } }).map((u) => `${u.name}: ${u.phone}`));

console.log('\n=== Complex Regex Patterns ===\n');

console.log('11. Email validation pattern:');
console.log(
  filter(users, {
    email: { $regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
  }).map((u) => `${u.name}: ${u.email}`),
);

console.log('\n12. Phone number validation (US format):');
console.log(
  filter(users, { phone: { $regex: /^\+1-\d{3}-\d{4}$/ } }).map((u) => `${u.name}: ${u.phone}`),
);

console.log('\n13. Username with letters and numbers only:');
console.log(
  filter(users, { username: { $regex: '^[a-z]+\\d+$' } }).map((u) => `${u.name}: ${u.username}`),
);

console.log('\n=== Combining $regex with Other Operators ===\n');

console.log('14. US users with .com emails:');
console.log(
  filter(users, {
    phone: { $regex: '^\\+1-' },
    email: { $endsWith: '.com' },
  }).map((u) => `${u.name}: ${u.email}, ${u.phone}`),
);

console.log('\n15. Users with numeric usernames and numeric zip codes:');
console.log(
  filter(users, {
    username: { $regex: '\\d+$' },
    zipCode: { $regex: '^\\d+$' },
  }).map((u) => `${u.name}: ${u.username}, ${u.zipCode}`),
);

console.log('\n16. Names starting with specific letters AND example.com domain:');
console.log(
  filter(users, {
    name: { $regex: '^[ABC]' },
    email: { $regex: '@example\\.com$' },
  }).map((u) => `${u.name}: ${u.email}`),
);

console.log('\n=== Real-World Use Cases ===\n');

console.log('17. Find users with valid email format:');
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(filter(users, { email: { $regex: emailPattern } }).map((u) => `${u.name}: ${u.email}`));

console.log('\n18. Find users with international phone numbers (non-US):');
console.log(filter(users, { phone: { $regex: '^\\+(?!1-)' } }).map((u) => `${u.name}: ${u.phone}`));

console.log('\n19. Find users with alphanumeric zip codes (UK style):');
console.log(
  filter(users, { zipCode: { $regex: '^[A-Z]{2}\\d{3}$' } }).map((u) => `${u.name}: ${u.zipCode}`),
);

console.log('\n20. Case-insensitive name search:');
console.log(filter(users, { name: { $regex: /brown/i } }).map((u) => u.name));

console.log('\n=== Advanced Patterns ===\n');

console.log('21. Find usernames with specific format (letters_letters or letters+numbers):');
console.log(
  filter(users, { username: { $regex: '^[a-z]+(_[a-z]+|\\d+)$' } }).map(
    (u) => `${u.name}: ${u.username}`,
  ),
);

console.log('\n22. Find emails from specific domains:');
console.log(
  filter(users, { email: { $regex: '@(example|test)\\.(com|org)$' } }).map(
    (u) => `${u.name}: ${u.email}`,
  ),
);

console.log('\n23. Validate phone numbers with country code:');
console.log(
  filter(users, { phone: { $regex: '^\\+\\d{1,3}-\\d{3}-\\d{4}$' } }).map(
    (u) => `${u.name}: ${u.phone}`,
  ),
);
