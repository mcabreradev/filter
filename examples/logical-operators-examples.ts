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
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 25,
    category: 'Accessories',
    tags: ['computer', 'wireless'],
    inStock: true,
    rating: 4.0,
    createdAt: new Date('2025-02-20'),
  },
  {
    id: 3,
    name: 'Office Desk',
    price: 350,
    category: 'Furniture',
    tags: ['office', 'large'],
    inStock: false,
    rating: 4.2,
    createdAt: new Date('2025-03-10'),
  },
  {
    id: 4,
    name: 'Ergonomic Chair',
    price: 180,
    category: 'Furniture',
    tags: ['office', 'ergonomic'],
    inStock: true,
    rating: 4.8,
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 5,
    name: '4K Monitor',
    price: 450,
    category: 'Electronics',
    tags: ['computer', 'display', '4k'],
    inStock: true,
    rating: 4.7,
    createdAt: new Date('2025-04-12'),
  },
  {
    id: 6,
    name: 'USB Cable',
    price: 8,
    category: 'Accessories',
    tags: ['computer', 'cable'],
    inStock: true,
    rating: 3.8,
    createdAt: new Date('2025-03-01'),
  },
];

console.log('=== $and Operator Examples ===\n');

console.log('1. Products that are Electronics AND in stock:');
console.log(
  filter(products, {
    $and: [{ category: 'Electronics' }, { inStock: true }],
  }).map((p) => `${p.name} (${p.category})`),
);

console.log('\n2. Products with price > $100 AND rating >= 4.5:');
console.log(
  filter(products, {
    $and: [{ price: { $gt: 100 } }, { rating: { $gte: 4.5 } }],
  }).map((p) => `${p.name} ($${p.price}, ★${p.rating})`),
);

console.log('\n3. In-stock products with price between $100 and $500:');
console.log(
  filter(products, {
    $and: [{ inStock: true }, { price: { $gte: 100 } }, { price: { $lte: 500 } }],
  }).map((p) => `${p.name} ($${p.price})`),
);

console.log('\n=== $or Operator Examples ===\n');

console.log('4. Products that are Electronics OR Furniture:');
console.log(
  filter(products, {
    $or: [{ category: 'Electronics' }, { category: 'Furniture' }],
  }).map((p) => `${p.name} (${p.category})`),
);

console.log('\n5. Products with price < $50 OR rating >= 4.7:');
console.log(
  filter(products, {
    $or: [{ price: { $lt: 50 } }, { rating: { $gte: 4.7 } }],
  }).map((p) => `${p.name} ($${p.price}, ★${p.rating})`),
);

console.log('\n6. Out of stock OR very cheap products:');
console.log(
  filter(products, {
    $or: [{ inStock: false }, { price: { $lt: 20 } }],
  }).map((p) => `${p.name} ($${p.price}, inStock: ${p.inStock})`),
);

console.log('\n=== $not Operator Examples ===\n');

console.log('7. Products NOT in Electronics category:');
console.log(
  filter(products, {
    $not: { category: 'Electronics' },
  }).map((p) => `${p.name} (${p.category})`),
);

console.log('\n8. Products NOT priced above $500:');
console.log(
  filter(products, {
    $not: { price: { $gt: 500 } },
  }).map((p) => `${p.name} ($${p.price})`),
);

console.log('\n9. Products NOT out of stock:');
console.log(
  filter(products, {
    $not: { inStock: false },
  }).map((p) => `${p.name} (inStock: ${p.inStock})`),
);

console.log('\n=== Complex Nested Examples ===\n');

console.log('10. (Electronics OR Accessories) AND in stock:');
console.log(
  filter(products, {
    $and: [{ $or: [{ category: 'Electronics' }, { category: 'Accessories' }] }, { inStock: true }],
  }).map((p) => `${p.name} (${p.category})`),
);

console.log('\n11. NOT (out of stock AND expensive):');
console.log(
  filter(products, {
    $not: {
      $and: [{ inStock: false }, { price: { $gt: 200 } }],
    },
  }).map((p) => `${p.name} ($${p.price}, inStock: ${p.inStock})`),
);

console.log('\n12. (High rating AND affordable) OR (Furniture AND in stock):');
console.log(
  filter(products, {
    $or: [
      { $and: [{ rating: { $gte: 4.5 } }, { price: { $lte: 500 } }] },
      { $and: [{ category: 'Furniture' }, { inStock: true }] },
    ],
  }).map((p) => `${p.name} (${p.category}, $${p.price}, ★${p.rating})`),
);

console.log('\n13. Premium products: (Electronics with rating > 4.5) OR (price > $400):');
console.log(
  filter(products, {
    $or: [
      { $and: [{ category: 'Electronics' }, { rating: { $gt: 4.5 } }] },
      { price: { $gt: 400 } },
    ],
  }).map((p) => `${p.name} (${p.category}, $${p.price}, ★${p.rating})`),
);

console.log('\n=== Real-World E-commerce Scenarios ===\n');

console.log('14. Featured products: In stock AND (highly rated OR new arrivals):');
console.log(
  filter(products, {
    $and: [
      { inStock: true },
      {
        $or: [{ rating: { $gte: 4.5 } }, { createdAt: { $gte: new Date('2025-03-01') } }],
      },
    ],
  }).map((p) => `${p.name} (★${p.rating}, ${p.createdAt.toLocaleDateString()})`),
);

console.log('\n15. Budget-friendly: (Accessories OR cheap Electronics) AND in stock:');
console.log(
  filter(products, {
    $and: [
      {
        $or: [
          { category: 'Accessories' },
          { $and: [{ category: 'Electronics' }, { price: { $lt: 500 } }] },
        ],
      },
      { inStock: true },
    ],
  }).map((p) => `${p.name} (${p.category}, $${p.price})`),
);

console.log('\n16. Clearance candidates: NOT (high rating OR recently added):');
console.log(
  filter(products, {
    $not: {
      $or: [{ rating: { $gte: 4.5 } }, { createdAt: { $gte: new Date('2025-03-01') } }],
    },
  }).map((p) => `${p.name} (★${p.rating}, ${p.createdAt.toLocaleDateString()})`),
);

console.log('\n17. Best sellers: In stock AND highly rated AND NOT expensive:');
console.log(
  filter(products, {
    $and: [{ inStock: true }, { rating: { $gte: 4.5 } }, { $not: { price: { $gt: 500 } } }],
  }).map((p) => `${p.name} ($${p.price}, ★${p.rating})`),
);

console.log('\n=== Combining Logical with Other Operators ===\n');

console.log('18. Computer accessories: Has "computer" tag AND (cheap OR highly rated):');
console.log(
  filter(products, {
    $and: [
      { tags: { $contains: 'computer' } },
      { $or: [{ price: { $lt: 50 } }, { rating: { $gte: 4.5 } }] },
    ],
  }).map((p) => `${p.name} ($${p.price}, ★${p.rating}, tags: ${p.tags.join(', ')})`),
);

console.log('\n19. Office furniture: Category Furniture AND has "office" tag AND in stock:');
console.log(
  filter(products, {
    $and: [{ category: 'Furniture' }, { tags: { $contains: 'office' } }, { inStock: true }],
  }).map((p) => `${p.name} (tags: ${p.tags.join(', ')})`),
);

console.log(
  '\n20. Premium electronics: Electronics AND (name starts with specific letters OR high price):',
);
console.log(
  filter(products, {
    $and: [
      { category: 'Electronics' },
      {
        $or: [
          { name: { $startsWith: 'Lap' } },
          { name: { $startsWith: '4K' } },
          { price: { $gt: 400 } },
        ],
      },
    ],
  }).map((p) => `${p.name} ($${p.price})`),
);

console.log('\n=== Mixed with Field-Level Conditions ===\n');

console.log('21. Active category filter with logical operators:');
console.log(
  filter(products, {
    category: 'Electronics',
    $and: [{ inStock: true }, { price: { $gte: 400 } }],
  }).map((p) => `${p.name} ($${p.price})`),
);

console.log('\n22. Multiple field conditions with $or:');
console.log(
  filter(products, {
    inStock: true,
    $or: [{ price: { $lt: 30 } }, { rating: { $gte: 4.7 } }],
  }).map((p) => `${p.name} ($${p.price}, ★${p.rating})`),
);

console.log('\n23. Complex mixed query:');
console.log(
  filter(products, {
    inStock: true,
    $and: [
      { $or: [{ category: 'Electronics' }, { category: 'Accessories' }] },
      { $not: { price: { $lt: 50 } } },
      { rating: { $gte: 4.0 } },
    ],
  }).map((p) => `${p.name} (${p.category}, $${p.price}, ★${p.rating})`),
);
