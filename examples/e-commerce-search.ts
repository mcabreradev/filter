import { filter } from '../src/index.js';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  tags: string[];
  images: string[];
  createdAt: Date;
}

const products: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    price: 2499,
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.8,
    inStock: true,
    tags: ['laptop', 'professional', 'sale'],
    images: ['macbook1.jpg', 'macbook2.jpg'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    name: 'Dell XPS 15',
    price: 1899,
    category: 'Electronics',
    brand: 'Dell',
    rating: 4.6,
    inStock: true,
    tags: ['laptop', 'business'],
    images: ['dell1.jpg'],
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 3,
    name: 'iPhone 15 Pro',
    price: 999,
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.9,
    inStock: false,
    tags: ['smartphone', 'premium'],
    images: ['iphone1.jpg', 'iphone2.jpg'],
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 4,
    name: 'Samsung Galaxy S24',
    price: 899,
    category: 'Electronics',
    brand: 'Samsung',
    rating: 4.7,
    inStock: true,
    tags: ['smartphone', 'android'],
    images: ['samsung1.jpg'],
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 5,
    name: 'Sony WH-1000XM5',
    price: 399,
    category: 'Audio',
    brand: 'Sony',
    rating: 4.8,
    inStock: true,
    tags: ['headphones', 'noise-cancelling', 'sale'],
    images: ['sony1.jpg'],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 6,
    name: 'AirPods Pro',
    price: 249,
    category: 'Audio',
    brand: 'Apple',
    rating: 4.6,
    inStock: true,
    tags: ['earbuds', 'wireless'],
    images: ['airpods1.jpg'],
    createdAt: new Date('2024-02-01'),
  },
];

console.log('=== E-commerce Search Examples ===\n');

console.log('1. Search by keyword (contains):');
const laptopSearch = filter(products, { name: { $contains: 'MacBook' } });
console.log(`Found ${laptopSearch.length} products matching "MacBook"`);
console.log(laptopSearch.map((p) => ({ name: p.name, price: p.price })));

console.log('\n2. Filter by price range:');
const midRange = filter(products, {
  price: { $gte: 500, $lte: 1500 },
});
console.log(`Found ${midRange.length} products in $500-$1500 range:`);
console.log(midRange.map((p) => ({ name: p.name, price: p.price })));

console.log('\n3. Multi-criteria search (Premium Electronics):');
const premiumElectronics = filter(products, {
  category: 'Electronics',
  price: { $gte: 1000 },
  rating: { $gte: 4.5 },
  inStock: true,
});
console.log(`Found ${premiumElectronics.length} premium electronics in stock:`);
console.log(premiumElectronics.map((p) => ({ name: p.name, price: p.price, rating: p.rating })));

console.log('\n4. Brand filtering:');
const appleProducts = filter(products, {
  brand: { $in: ['Apple', 'Samsung'] },
});
console.log(`Found ${appleProducts.length} Apple or Samsung products:`);
console.log(appleProducts.map((p) => ({ name: p.name, brand: p.brand })));

console.log('\n5. Tag-based search (Sale items):');
const saleItems = filter(products, {
  tags: { $contains: 'sale' },
});
console.log(`Found ${saleItems.length} items on sale:`);
console.log(saleItems.map((p) => ({ name: p.name, price: p.price, tags: p.tags })));

console.log('\n6. Complex query with logical operators:');
const complexSearch = filter(products, {
  $and: [
    { inStock: true },
    {
      $or: [{ category: 'Audio' }, { brand: 'Apple' }],
    },
    { price: { $lte: 1000 } },
  ],
});
console.log(`Found ${complexSearch.length} products (in stock, Audio OR Apple, under $1000):`);
console.log(
  complexSearch.map((p) => ({
    name: p.name,
    category: p.category,
    brand: p.brand,
    price: p.price,
  })),
);

console.log('\n7. High-rated, affordable products:');
const bestValue = filter(products, {
  rating: { $gte: 4.7 },
  price: { $lte: 500 },
  inStock: true,
});
console.log(`Found ${bestValue.length} best value products:`);
console.log(bestValue.map((p) => ({ name: p.name, rating: p.rating, price: p.price })));

console.log('\n8. Recently added products (last 60 days):');
const sixtyDaysAgo = new Date();
sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

const recentProducts = filter(products, {
  createdAt: { $gte: sixtyDaysAgo },
});
console.log(`Found ${recentProducts.length} products added in last 60 days:`);
console.log(
  recentProducts.map((p) => ({ name: p.name, createdAt: p.createdAt.toISOString().split('T')[0] })),
);

console.log('\n9. Out of stock premium items:');
const outOfStockPremium = filter(products, {
  inStock: false,
  price: { $gte: 500 },
});
console.log(`Found ${outOfStockPremium.length} out of stock premium items:`);
console.log(outOfStockPremium.map((p) => ({ name: p.name, price: p.price })));

console.log('\n10. Category-based filtering:');
const audioProducts = filter(products, { category: 'Audio' });
console.log(`Found ${audioProducts.length} audio products:`);
console.log(audioProducts.map((p) => ({ name: p.name, brand: p.brand, price: p.price })));
