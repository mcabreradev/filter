export interface Dataset {
  id: string;
  name: string;
  code: string;
  fields: string[];
}

export const datasets: Dataset[] = [
  {
    id: 'users',
    name: 'Users',
    code: `const users = [
  { name: 'Alice', age: 30, city: 'Berlin' },
  { name: 'Bob', age: 25, city: 'London' },
  { name: 'Charlie', age: 35, city: 'Berlin' }
];`,
    fields: ['name', 'age', 'city'],
  },
  {
    id: 'products',
    name: 'Products',
    code: `const products = [
  { name: 'Laptop', price: 1200, rating: 4.5, category: 'Electronics', inStock: true },
  { name: 'Mouse', price: 25, rating: 4.0, category: 'Electronics', inStock: true },
  { name: 'Monitor', price: 450, rating: 4.8, category: 'Electronics', inStock: false },
  { name: 'Desk', price: 300, rating: 4.2, category: 'Furniture', inStock: true }
];`,
    fields: ['name', 'price', 'rating', 'category', 'inStock'],
  },
  {
    id: 'emails',
    name: 'Emails',
    code: `const emails = [
  { email: 'alice@example.com', verified: true, spam: false },
  { email: 'bob@test.com', verified: false, spam: false },
  { email: 'charlie@example.com', verified: true, spam: false },
  { email: 'spam@fake.com', verified: false, spam: true }
];`,
    fields: ['email', 'verified', 'spam'],
  },
  {
    id: 'orders',
    name: 'Orders',
    code: `const orders = [
  { id: 1, amount: 1200, status: 'completed', customerId: 101 },
  { id: 2, amount: 450, status: 'pending', customerId: 102 },
  { id: 3, amount: 890, status: 'shipped', customerId: 101 },
  { id: 4, amount: 230, status: 'cancelled', customerId: 103 }
];`,
    fields: ['id', 'amount', 'status', 'customerId'],
  },
  {
    id: 'employees',
    name: 'Employees',
    code: `const employees = [
  { name: 'Alice Johnson', department: 'Engineering', salary: 95000, level: 'Senior' },
  { name: 'Bob Smith', department: 'Marketing', salary: 65000, level: 'Mid' },
  { name: 'Charlie Brown', department: 'Engineering', salary: 110000, level: 'Staff' },
  { name: 'Diana Prince', department: 'Sales', salary: 75000, level: 'Senior' }
];`,
    fields: ['name', 'department', 'salary', 'level'],
  },
];

export function getDatasetSampleFilter(datasetId: string): string {
  const samples: Record<string, string> = {
    users: `{ city: 'Berlin' }`,
    products: `{
  price: { $gte: 100, $lte: 500 },
  inStock: true
}`,
    emails: `{ verified: true }`,
    orders: `{
  status: { $in: ['completed', 'shipped'] },
  amount: { $gte: 500 }
}`,
    employees: `{
  department: 'Engineering',
  salary: { $gte: 80000 }
}`,
  };

  return samples[datasetId] || '{}';
}
