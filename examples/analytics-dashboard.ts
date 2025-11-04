import { filter, filterCount } from '../src/index.js';

interface Order {
  id: number;
  customerId: number;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  createdAt: Date;
  items: number;
  region: string;
}

const orders: Order[] = [
  {
    id: 1,
    customerId: 101,
    amount: 1250,
    status: 'completed',
    createdAt: new Date('2024-10-01'),
    items: 3,
    region: 'US',
  },
  {
    id: 2,
    customerId: 102,
    amount: 450,
    status: 'completed',
    createdAt: new Date('2024-10-05'),
    items: 2,
    region: 'EU',
  },
  {
    id: 3,
    customerId: 103,
    amount: 2100,
    status: 'pending',
    createdAt: new Date('2024-10-10'),
    items: 5,
    region: 'US',
  },
  {
    id: 4,
    customerId: 104,
    amount: 890,
    status: 'completed',
    createdAt: new Date('2024-10-12'),
    items: 1,
    region: 'APAC',
  },
  {
    id: 5,
    customerId: 105,
    amount: 1500,
    status: 'completed',
    createdAt: new Date('2024-10-15'),
    items: 4,
    region: 'US',
  },
  {
    id: 6,
    customerId: 101,
    amount: 670,
    status: 'cancelled',
    createdAt: new Date('2024-10-20'),
    items: 2,
    region: 'US',
  },
  {
    id: 7,
    customerId: 106,
    amount: 3200,
    status: 'completed',
    createdAt: new Date('2024-10-25'),
    items: 8,
    region: 'EU',
  },
  {
    id: 8,
    customerId: 107,
    amount: 540,
    status: 'pending',
    createdAt: new Date('2024-11-01'),
    items: 1,
    region: 'APAC',
  },
  {
    id: 9,
    customerId: 108,
    amount: 1800,
    status: 'completed',
    createdAt: new Date('2024-11-03'),
    items: 6,
    region: 'US',
  },
  {
    id: 10,
    customerId: 102,
    amount: 920,
    status: 'refunded',
    createdAt: new Date('2024-11-04'),
    items: 3,
    region: 'EU',
  },
];

console.log('=== Analytics Dashboard Examples ===\n');

const now = new Date();
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

console.log('1. Revenue last 30 days:');
const recentOrders = filter(orders, {
  createdAt: { $gte: thirtyDaysAgo },
  status: 'completed',
});
const revenue = recentOrders.reduce((sum, o) => sum + o.amount, 0);
console.log(`Total orders: ${recentOrders.length}`);
console.log(`Total revenue: $${revenue.toLocaleString()}`);
console.log(`Average order value: $${(revenue / recentOrders.length).toFixed(2)}`);

console.log('\n2. High-value orders (>= $1000):');
const highValue = filter(orders, {
  amount: { $gte: 1000 },
  status: 'completed',
});
console.log(`Count: ${highValue.length}`);
console.log(`Total value: $${highValue.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}`);
console.log(highValue.map((o) => ({ id: o.id, amount: `$${o.amount}`, items: o.items })));

console.log('\n3. Order status breakdown:');
const statusCounts = {
  completed: filterCount(orders, { status: 'completed' }),
  pending: filterCount(orders, { status: 'pending' }),
  cancelled: filterCount(orders, { status: 'cancelled' }),
  refunded: filterCount(orders, { status: 'refunded' }),
};
console.log(statusCounts);
console.log(`Completion rate: ${((statusCounts.completed / orders.length) * 100).toFixed(1)}%`);

console.log('\n4. Average order value by region:');
const regions = ['US', 'EU', 'APAC'];
regions.forEach((region) => {
  const regionOrders = filter(orders, { region, status: 'completed' });
  const avgValue = regionOrders.reduce((sum, o) => sum + o.amount, 0) / regionOrders.length;
  console.log(`${region}: $${avgValue.toFixed(2)} (${regionOrders.length} orders)`);
});

console.log('\n5. Top customers by order count:');
const customerOrderCounts = orders.reduce(
  (acc, order) => {
    acc[order.customerId] = (acc[order.customerId] || 0) + 1;
    return acc;
  },
  {} as Record<number, number>,
);

const topCustomers = Object.entries(customerOrderCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3);

console.log('Top 3 customers:');
topCustomers.forEach(([customerId, count]) => {
  const customerOrders = filter(orders, { customerId: parseInt(customerId) });
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.amount, 0);
  console.log(`Customer ${customerId}: ${count} orders, $${totalSpent.toLocaleString()} total`);
});

console.log('\n6. Week-over-week comparison:');
const lastWeekOrders = filter(orders, {
  createdAt: { $gte: sevenDaysAgo },
  status: 'completed',
});
const lastWeekRevenue = lastWeekOrders.reduce((sum, o) => sum + o.amount, 0);
console.log(`Last 7 days: ${lastWeekOrders.length} orders, $${lastWeekRevenue.toLocaleString()}`);

console.log('\n7. Orders requiring attention:');
const needsAttention = filter(orders, {
  $or: [{ status: 'pending', amount: { $gte: 1000 } }, { status: 'refunded' }],
});
console.log(`${needsAttention.length} orders need attention:`);
console.log(
  needsAttention.map((o) => ({
    id: o.id,
    status: o.status,
    amount: `$${o.amount}`,
    date: o.createdAt.toISOString().split('T')[0],
  })),
);

console.log('\n8. Regional performance:');
regions.forEach((region) => {
  const regionOrders = filter(orders, { region });
  const completed = filter(regionOrders, { status: 'completed' });
  const revenue = completed.reduce((sum, o) => sum + o.amount, 0);
  console.log(
    `${region}: ${regionOrders.length} orders, ${completed.length} completed, $${revenue.toLocaleString()} revenue`,
  );
});

console.log('\n9. Large orders (>= 5 items):');
const largeOrders = filter(orders, {
  items: { $gte: 5 },
  status: 'completed',
});
console.log(`Found ${largeOrders.length} large orders:`);
console.log(
  largeOrders.map((o) => ({
    id: o.id,
    items: o.items,
    amount: `$${o.amount}`,
    avgPerItem: `$${(o.amount / o.items).toFixed(2)}`,
  })),
);

console.log('\n10. Problem orders (cancelled + refunded):');
const problemOrders = filter(orders, {
  status: { $in: ['cancelled', 'refunded'] },
});
const lostRevenue = problemOrders.reduce((sum, o) => sum + o.amount, 0);
console.log(`Total problem orders: ${problemOrders.length}`);
console.log(`Lost revenue: $${lostRevenue.toLocaleString()}`);
console.log(`Problem rate: ${((problemOrders.length / orders.length) * 100).toFixed(1)}%`);
