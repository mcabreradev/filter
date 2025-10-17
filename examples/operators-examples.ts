import { filter } from '../src';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
  rating: number;
  createdAt: Date;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro',
    price: 1200,
    category: 'Electronics',
    tags: ['computer', 'portable', 'gaming'],
    inStock: true,
    rating: 4.5,
    createdAt: new Date('2025-01-15')
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 25,
    category: 'Accessories',
    tags: ['computer', 'wireless'],
    inStock: true,
    rating: 4.0,
    createdAt: new Date('2025-02-20')
  },
  {
    id: 3,
    name: 'Office Desk',
    price: 350,
    category: 'Furniture',
    tags: ['office', 'large'],
    inStock: false,
    rating: 4.2,
    createdAt: new Date('2025-03-10')
  },
  {
    id: 4,
    name: 'Ergonomic Chair',
    price: 180,
    category: 'Furniture',
    tags: ['office', 'ergonomic'],
    inStock: true,
    rating: 4.8,
    createdAt: new Date('2025-01-05')
  },
  {
    id: 5,
    name: '4K Monitor',
    price: 450,
    category: 'Electronics',
    tags: ['computer', 'display', '4k'],
    inStock: true,
    rating: 4.7,
    createdAt: new Date('2025-04-12')
  }
];

console.log('=== Comparison Operators Examples ===\n');

console.log('1. Find products with price > $100:');
console.log(
  filter(products, { price: { $gt: 100 } }).map((p) => `${p.name} ($${p.price})`)
);

console.log('\n2. Find products with price between $100 and $500:');
console.log(
  filter(products, { price: { $gte: 100, $lte: 500 } }).map((p) => `${p.name} ($${p.price})`)
);

console.log('\n3. Find products not priced at $25:');
console.log(
  filter(products, { price: { $ne: 25 } }).map((p) => `${p.name} ($${p.price})`)
);

console.log('\n4. Find products created after Feb 1, 2025:');
console.log(
  filter(products, { createdAt: { $gt: new Date('2025-02-01') } }).map(
    (p) => `${p.name} (${p.createdAt.toLocaleDateString()})`
  )
);

console.log('\n=== Array Operators Examples ===\n');

console.log('5. Find Electronics or Accessories:');
console.log(
  filter(products, { category: { $in: ['Electronics', 'Accessories'] } }).map(
    (p) => `${p.name} (${p.category})`
  )
);

console.log('\n6. Find products NOT in Furniture category:');
console.log(
  filter(products, { category: { $nin: ['Furniture'] } }).map((p) => `${p.name} (${p.category})`)
);

console.log('\n7. Find products with exactly 2 tags:');
console.log(
  filter(products, { tags: { $size: 2 } }).map((p) => `${p.name} (${p.tags.length} tags)`)
);

console.log('\n8. Find products with "computer" tag:');
console.log(
  filter(products, { tags: { $contains: 'computer' } }).map((p) => `${p.name} (${p.tags.join(', ')})`)
);

console.log('\n=== String Operators Examples ===\n');

console.log('9. Find products starting with "Lap":');
console.log(filter(products, { name: { $startsWith: 'Lap' } }).map((p) => p.name));

console.log('\n10. Find products ending with "Mouse":');
console.log(filter(products, { name: { $endsWith: 'Mouse' } }).map((p) => p.name));

console.log('\n11. Find products containing "Monitor" (case-insensitive):');
console.log(filter(products, { name: { $contains: 'monitor' } }).map((p) => p.name));

console.log('\n12. Find products containing "Monitor" (case-sensitive):');
console.log(
  filter(products, { name: { $contains: 'Monitor' } }, { caseSensitive: true }).map((p) => p.name)
);

console.log('\n=== Combined Operators Examples ===\n');

console.log('13. Find affordable electronics in stock:');
console.log(
  filter(products, {
    category: { $in: ['Electronics', 'Accessories'] },
    price: { $lte: 500 },
    inStock: { $eq: true }
  }).map((p) => `${p.name} ($${p.price})`)
);

console.log('\n14. Find highly-rated products under $500:');
console.log(
  filter(products, {
    rating: { $gte: 4.5 },
    price: { $lt: 500 }
  }).map((p) => `${p.name} (★${p.rating}, $${p.price})`)
);

console.log('\n15. Find products with specific tags and price range:');
console.log(
  filter(products, {
    tags: { $contains: 'office' },
    price: { $gte: 100, $lte: 400 }
  }).map((p) => `${p.name} ($${p.price}, tags: ${p.tags.join(', ')})`)
);

console.log('\n=== Mixed Syntax Examples (Legacy + Operators) ===\n');

console.log('16. Mix simple equality with operators:');
console.log(
  filter(products, {
    category: 'Electronics',
    price: { $gte: 400 }
  }).map((p) => `${p.name} (${p.category}, $${p.price})`)
);

console.log('\n17. Mix wildcards with operators:');
console.log(
  filter(products, {
    name: '%Mouse%',
    price: { $lt: 100 }
  }).map((p) => `${p.name} ($${p.price})`)
);

console.log('\n=== Real-World Scenarios ===\n');

console.log('18. E-commerce: Find best-selling products:');
console.log(
  filter(products, {
    rating: { $gte: 4.5 },
    inStock: { $eq: true },
    price: { $lte: 1000 }
  }).map((p) => `${p.name} - ★${p.rating} - $${p.price}`)
);

console.log('\n19. Inventory management: Low stock expensive items:');
console.log(
  filter(products, {
    inStock: { $eq: false },
    price: { $gt: 200 }
  }).map((p) => `${p.name} ($${p.price}) - OUT OF STOCK`)
);

console.log('\n20. Product search: Computer accessories under $50:');
console.log(
  filter(products, {
    tags: { $contains: 'computer' },
    category: { $ne: 'Electronics' },
    price: { $lt: 50 }
  }).map((p) => `${p.name} (${p.category}, $${p.price})`)
);

