import { filter } from '../src';

const users = [
  { name: 'Alice', email: 'alice@example.com', age: 30, city: 'Berlin', role: 'admin' },
  { name: 'Bob', email: 'bob@example.com', age: 25, city: 'London', role: 'user' },
  { name: 'Charlie', email: 'charlie@example.com', age: 35, city: 'Berlin', role: 'moderator' },
  { name: 'David', email: 'david@example.com', age: 30, city: 'Paris', role: 'user' },
  { name: 'Eve', email: 'eve@example.com', age: 28, city: 'Madrid', role: 'admin' },
];

console.log('=== Array OR Syntax Examples (v5.4.0) ===\n');

console.log('1. Basic Array Syntax (OR logic):');
console.log('   filter(users, { city: ["Berlin", "London"] })');
const result1 = filter(users, { city: ['Berlin', 'London'] });
console.log('   →', result1.map((u) => `${u.name} (${u.city})`).join(', '));
console.log('   Logic: city === "Berlin" OR city === "London"\n');

console.log('2. Equivalent to explicit $in operator:');
console.log('   filter(users, { city: { $in: ["Berlin", "London"] } })');
const result2 = filter(users, { city: { $in: ['Berlin', 'London'] } });
console.log('   →', result2.map((u) => `${u.name} (${u.city})`).join(', '));
console.log('   Result is identical to example 1\n');

console.log('3. Combining Array OR with AND conditions:');
console.log('   filter(users, { city: ["Berlin", "London"], age: 30 })');
const result3 = filter(users, { city: ['Berlin', 'London'], age: 30 });
console.log('   →', result3.map((u) => `${u.name} (${u.city}, age ${u.age})`).join(', '));
console.log('   Logic: (city === "Berlin" OR city === "London") AND age === 30\n');

console.log('4. Multiple array properties (independent OR logic):');
console.log('   filter(users, { city: ["Berlin", "Paris"], age: [30, 35] })');
const result4 = filter(users, { city: ['Berlin', 'Paris'], age: [30, 35] });
console.log('   →', result4.map((u) => `${u.name} (${u.city}, age ${u.age})`).join(', '));
console.log('   Logic: (city === "Berlin" OR city === "Paris") AND (age === 30 OR age === 35)\n');

console.log('5. Array syntax with wildcards:');
console.log('   filter(users, { city: ["%erlin", "%aris"] })');
const result5 = filter(users, { city: ['%erlin', '%aris'] });
console.log('   →', result5.map((u) => `${u.name} (${u.city})`).join(', '));
console.log('   Matches: Berlin (ends with "erlin") and Paris (ends with "aris")\n');

console.log('6. Number arrays:');
console.log('   filter(users, { age: [25, 30] })');
const result6 = filter(users, { age: [25, 30] });
console.log('   →', result6.map((u) => `${u.name} (age ${u.age})`).join(', '));
console.log('   Matches: users aged 25 OR 30\n');

console.log('7. String arrays with exact matches:');
console.log('   filter(users, { role: ["admin", "moderator"] })');
const result7 = filter(users, { role: ['admin', 'moderator'] });
console.log('   →', result7.map((u) => `${u.name} (${u.role})`).join(', '));
console.log('   Matches: admins OR moderators\n');

console.log('8. Complex multi-condition filtering:');
console.log('   filter(users, { city: ["Berlin", "Paris"], age: 30, role: ["admin", "user"] })');
const result8 = filter(users, {
  city: ['Berlin', 'Paris'],
  age: 30,
  role: ['admin', 'user'],
});
console.log(
  '   →',
  result8.map((u) => `${u.name} (${u.city}, ${u.role}, age ${u.age})`).join(', '),
);
console.log(
  '   Logic: (city === "Berlin" OR city === "Paris") AND age === 30 AND (role === "admin" OR role === "user")\n',
);

console.log('9. Empty array (matches nothing):');
console.log('   filter(users, { city: [] })');
const result9 = filter(users, { city: [] });
console.log('   →', result9.length === 0 ? 'No results' : result9.map((u) => u.name).join(', '));
console.log('   Empty array matches no items\n');

console.log('10. Single-element array:');
console.log('   filter(users, { city: ["Berlin"] })');
const result10 = filter(users, { city: ['Berlin'] });
console.log('   →', result10.map((u) => `${u.name} (${u.city})`).join(', '));
console.log('   Same as: { city: "Berlin" }\n');

console.log('=== Key Takeaways ===');
console.log('✓ Array syntax is syntactic sugar for $in operator');
console.log('✓ Provides clean, intuitive OR logic for property values');
console.log('✓ Works with strings, numbers, booleans, and other primitives');
console.log('✓ Supports wildcards (%, _) within array values');
console.log('✓ Combines with other properties using AND logic');
console.log('✓ Explicit operators always take precedence');
console.log('✓ 100% backward compatible with existing syntax\n');
