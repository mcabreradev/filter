import { filter, clearFilterCache, getFilterCacheStats, filterFirst } from '../src';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  rating: number;
  tags: string[];
}

const products: Product[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Product ${i}`,
  category: ['Electronics', 'Furniture', 'Clothing', 'Books'][i % 4],
  price: Math.random() * 1000,
  inStock: i % 3 !== 0,
  rating: 1 + Math.random() * 4,
  tags: ['new', 'sale', 'featured'].filter(() => Math.random() > 0.5),
}));

console.log('=== Memoization Examples ===\n');

console.log('1. Basic Result Caching');
console.log('------------------------');
console.time('First call');
const electronics1 = filter(products, { category: 'Electronics' }, { enableCache: true });
console.timeEnd('First call');

console.time('Cached call');
const electronics2 = filter(products, { category: 'Electronics' }, { enableCache: true });
console.timeEnd('Cached call');
console.log(`Results: ${electronics1.length} items (same as cached: ${electronics2.length})\n`);

console.log('2. Predicate Caching Across Arrays');
console.log('-----------------------------------');
const products1 = products.slice(0, 5000);
const products2 = products.slice(5000);
const query = { price: { $gte: 500 }, inStock: true };

console.time('First array');
filter(products1, query, { enableCache: true });
console.timeEnd('First array');

console.time('Second array (predicate cached)');
filter(products2, query, { enableCache: true });
console.timeEnd('Second array (predicate cached)');
console.log();

console.log('3. Regex Pattern Caching');
console.log('------------------------');
const regexQuery = { name: { $regex: '^Product [1-9]0' } };

console.time('First regex use');
filter(products, regexQuery);
console.timeEnd('First regex use');

console.time('Second regex use (cached)');
filter(products, regexQuery);
console.timeEnd('Second regex use (cached)');
console.log();

console.log('4. Cache Statistics');
console.log('-------------------');
const stats = getFilterCacheStats();
console.log('Predicate cache size:', stats.predicateCacheSize);
console.log('Regex cache size:', stats.regexCacheSize);
console.log();

console.log('5. Complex Query Caching');
console.log('------------------------');
const complexQuery = {
  $and: [
    { price: { $gte: 100, $lte: 500 } },
    { category: { $in: ['Electronics', 'Furniture'] } },
    { rating: { $gte: 3.5 } },
    { inStock: true },
  ],
};

console.time('Complex query (first)');
const complex1 = filter(products, complexQuery, { enableCache: true });
console.timeEnd('Complex query (first)');

console.time('Complex query (cached)');
const complex2 = filter(products, complexQuery, { enableCache: true });
console.timeEnd('Complex query (cached)');
console.log(`Results: ${complex1.length} items (same as cached: ${complex2.length})\n`);

console.log('6. Combining with Lazy Evaluation');
console.log('---------------------------------');
const lazyQuery = { rating: { $gte: 4.0 }, inStock: true };

console.time('filterFirst (first)');
const first10 = filterFirst(products, lazyQuery, 10, { enableCache: true });
console.timeEnd('filterFirst (first)');

console.time('filterFirst (cached)');
const first10Again = filterFirst(products, lazyQuery, 10, { enableCache: true });
console.timeEnd('filterFirst (cached)');
console.log(`Results: ${first10.length} items (same as cached: ${first10Again.length})\n`);

console.log('7. Cache Clearing');
console.log('-----------------');
console.log('Before clear:', getFilterCacheStats());
clearFilterCache();
console.log('After clear:', getFilterCacheStats());
console.log();

console.log('8. Performance Comparison');
console.log('-------------------------');
const iterations = 100;
const testQuery = { category: 'Electronics', price: { $gte: 200 } };

console.time('Without cache (100 iterations)');
for (let i = 0; i < iterations; i++) {
  filter(products, testQuery, { enableCache: false });
}
console.timeEnd('Without cache (100 iterations)');

clearFilterCache();

console.time('With cache (100 iterations)');
for (let i = 0; i < iterations; i++) {
  filter(products, testQuery, { enableCache: true });
}
console.timeEnd('With cache (100 iterations)');

console.log('\n=== Examples Complete ===');
