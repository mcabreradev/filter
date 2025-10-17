const products = [
  {
    id: 1,
    name: 'Laptop',
    price: 1200,
  },
  {
    id: 3,
    name: 'Desk',
    price: 350,
  },
  {
    id: 4,
    name: 'Chair',
    price: 180,
  }
];

// Test: price >= 100 AND price <= 400
console.log('Products with price between 100 and 400:');
products.forEach(p => {
  if (p.price >= 100 && p.price <= 400) {
    console.log(`  ${p.name}: $${p.price}`);
  }
});
