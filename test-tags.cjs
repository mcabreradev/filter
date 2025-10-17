const products = [
  {
    name: 'Mouse',
    price: 25,
    tags: ['computer', 'accessory'],
  },
  {
    name: 'Desk',
    price: 350,
    tags: ['office', 'large'],
  },
  {
    name: 'Chair',
    price: 180,
    tags: ['office', 'ergonomic'],
  },
  {
    name: 'Monitor',
    price: 450,
    tags: ['computer', 'display'],
  }
];

// Test: price > 50 AND price < 500 AND tags.length === 2
console.log('Products with price between 50 and 500, and exactly 2 tags:');
products.forEach(p => {
  if (p.price > 50 && p.price < 500 && p.tags.length === 2) {
    console.log(`  ${p.name}: $${p.price}, tags: ${p.tags.length}`);
  }
});
