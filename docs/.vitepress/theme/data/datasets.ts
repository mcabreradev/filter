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
  { name: 'Laptop', price: 1200, rating: 4.5, category: 'Electronics', inStock: true, stock: 15 },
  { name: 'Mouse', price: 25, rating: 4.0, category: 'Electronics', inStock: true, stock: 150 },
  { name: 'Monitor', price: 450, rating: 4.8, category: 'Electronics', inStock: false, stock: 0 },
  { name: 'Desk', price: 300, rating: 4.2, category: 'Furniture', inStock: true, stock: 25 }
];`,
    fields: ['name', 'price', 'rating', 'category', 'inStock', 'stock'],
  },
  {
    id: 'files',
    name: 'Files',
    code: `const files = [
  { filename: 'report_2025.pdf', size: 1024, type: 'document', path: 'docs/reports/' },
  { filename: 'image_001.png', size: 2048, type: 'image', path: 'assets/images/' },
  { filename: 'data.json', size: 256, type: 'data', path: 'data/' },
  { filename: 'report_draft.pdf', size: 512, type: 'document', path: 'docs/drafts/' }
];`,
    fields: ['filename', 'size', 'type', 'path'],
  },
  {
    id: 'tasks',
    name: 'Tasks',
    code: `const tasks = [
  { title: 'Review PR', status: 'completed', priority: 'high', assignee: 'Alice' },
  { title: 'Fix bug', status: 'in-progress', priority: 'urgent', assignee: 'Bob' },
  { title: 'Write docs', status: 'pending', priority: 'low', assignee: 'Charlie' },
  { title: 'Deploy', status: 'completed', priority: 'high', assignee: 'Alice' }
];`,
    fields: ['title', 'status', 'priority', 'assignee'],
  },
  {
    id: 'ordersData',
    name: 'Orders',
    code: `const ordersData = [
  { id: 1, status: 'shipped', amount: 250, express: true, customer: 'premium' },
  { id: 2, status: 'pending', amount: 1500, express: false, customer: 'regular' },
  { id: 3, status: 'delivered', amount: 800, express: true, customer: 'premium' },
  { id: 4, status: 'cancelled', amount: 120, express: false, customer: 'regular' }
];`,
    fields: ['id', 'status', 'amount', 'express', 'customer'],
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
  {
    id: 'restaurants',
    name: 'Restaurants',
    code: `const restaurants = [
  { name: 'Berlin Bistro', location: { lat: 52.52, lng: 13.405 }, rating: 4.5, cuisine: 'German', priceLevel: 2 },
  { name: 'Pasta Paradise', location: { lat: 52.521, lng: 13.406 }, rating: 4.8, cuisine: 'Italian', priceLevel: 3 },
  { name: 'Sushi Spot', location: { lat: 52.53, lng: 13.42 }, rating: 4.6, cuisine: 'Japanese', priceLevel: 4 },
  { name: 'Burger House', location: { lat: 52.525, lng: 13.415 }, rating: 3.9, cuisine: 'American', priceLevel: 1 },
  { name: 'Taco Time', location: { lat: 52.55, lng: 13.45 }, rating: 4.2, cuisine: 'Mexican', priceLevel: 2 }
];`,
    fields: ['name', 'location', 'rating', 'cuisine', 'priceLevel'],
  },
  {
    id: 'stores',
    name: 'Stores',
    code: `const stores = [
  { name: 'Downtown Store', location: { lat: 52.52, lng: 13.405 }, type: 'flagship', inventory: 1500 },
  { name: 'East Store', location: { lat: 52.53, lng: 13.45 }, type: 'outlet', inventory: 800 },
  { name: 'West Store', location: { lat: 52.51, lng: 13.35 }, type: 'standard', inventory: 1000 },
  { name: 'Central Store', location: { lat: 52.525, lng: 13.41 }, type: 'standard', inventory: 1200 },
  { name: 'North Store', location: { lat: 52.55, lng: 13.40 }, type: 'outlet', inventory: 600 }
];`,
    fields: ['name', 'location', 'type', 'inventory'],
  },
  {
    id: 'properties',
    name: 'Properties',
    code: `const properties = [
  { address: '123 Main St', location: { lat: 51.507, lng: -0.128 }, price: 500000, bedrooms: 2, sqft: 850 },
  { address: '456 Park Ave', location: { lat: 51.510, lng: -0.125 }, price: 750000, bedrooms: 3, sqft: 1200 },
  { address: '789 King Rd', location: { lat: 51.505, lng: -0.130 }, price: 600000, bedrooms: 2, sqft: 950 },
  { address: '321 Queen St', location: { lat: 51.515, lng: -0.120 }, price: 900000, bedrooms: 4, sqft: 1500 },
  { address: '654 Oak Ln', location: { lat: 51.503, lng: -0.135 }, price: 450000, bedrooms: 1, sqft: 600 }
];`,
    fields: ['address', 'location', 'price', 'bedrooms', 'sqft'],
  },
  {
    id: 'customers',
    name: 'Customers',
    code: `const customers = [
  { name: 'Alice', address: { lat: 40.7589, lng: -73.9851 }, orderValue: 45, premium: true },
  { name: 'Bob', address: { lat: 40.7614, lng: -73.9776 }, orderValue: 120, premium: false },
  { name: 'Charlie', address: { lat: 40.7489, lng: -73.9680 }, orderValue: 85, premium: true },
  { name: 'Diana', address: { lat: 40.7128, lng: -74.0060 }, orderValue: 30, premium: false },
  { name: 'Eve', address: { lat: 40.7580, lng: -73.9855 }, orderValue: 95, premium: true }
];`,
    fields: ['name', 'address', 'orderValue', 'premium'],
  },
  {
    id: 'serviceAreas',
    name: 'Service Areas',
    code: `const serviceAreas = [
  { zone: 'Zone A', location: { lat: 52.520, lng: 13.405 }, basePrice: 50, surcharge: 0, coverage: 'Full' },
  { zone: 'Zone B', location: { lat: 52.525, lng: 13.410 }, basePrice: 50, surcharge: 5, coverage: 'Full' },
  { zone: 'Zone C', location: { lat: 52.535, lng: 13.425 }, basePrice: 50, surcharge: 10, coverage: 'Limited' },
  { zone: 'Zone D', location: { lat: 52.510, lng: 13.395 }, basePrice: 50, surcharge: 0, coverage: 'Full' },
  { zone: 'Zone E', location: { lat: 52.545, lng: 13.445 }, basePrice: 50, surcharge: 15, coverage: 'Limited' }
];`,
    fields: ['zone', 'location', 'basePrice', 'surcharge', 'coverage'],
  },
  {
    id: 'events',
    name: 'Events',
    code: `const events = [
  { name: 'Team Meeting', date: new Date(2025, 10, 5), startTime: new Date(2025, 10, 5, 9, 0), duration: 60, location: 'Office' },
  { name: 'Product Launch', date: new Date(2025, 10, 15), startTime: new Date(2025, 10, 15, 14, 0), duration: 120, location: 'Conference Center' },
  { name: 'Weekend Workshop', date: new Date(2025, 10, 8), startTime: new Date(2025, 10, 8, 10, 0), duration: 480, location: 'Remote' },
  { name: 'Client Call', date: new Date(2025, 10, 3), startTime: new Date(2025, 10, 3, 15, 0), duration: 30, location: 'Video Call' }
];`,
    fields: ['name', 'date', 'startTime', 'duration', 'location'],
  },
  {
    id: 'usersWithDates',
    name: 'Users with Dates',
    code: `const usersWithDates = [
  { name: 'Alice', birthDate: new Date(2000, 0, 1), lastLogin: new Date(2025, 10, 1, 10, 30), premium: true },
  { name: 'Bob', birthDate: new Date(2005, 4, 15), lastLogin: new Date(2025, 9, 25, 8, 0), premium: false },
  { name: 'Charlie', birthDate: new Date(1990, 7, 22), lastLogin: new Date(2025, 9, 15, 14, 15), premium: true },
  { name: 'Diana', birthDate: new Date(2010, 11, 5), lastLogin: new Date(2025, 10, 1, 16, 45), premium: false }
];`,
    fields: ['name', 'birthDate', 'lastLogin', 'premium'],
  },
  {
    id: 'appointments',
    name: 'Appointments',
    code: `const appointments = [
  { client: 'Alice', time: new Date(2025, 10, 1, 9, 0), duration: 60, type: 'consultation' },
  { client: 'Bob', time: new Date(2025, 10, 1, 14, 30), duration: 30, type: 'follow-up' },
  { client: 'Charlie', time: new Date(2025, 10, 1, 18, 0), duration: 45, type: 'initial' },
  { client: 'Diana', time: new Date(2025, 10, 2, 10, 0), duration: 90, type: 'consultation' }
];`,
    fields: ['client', 'time', 'duration', 'type'],
  },
];

export function getDatasetSampleFilter(datasetId: string): string {
  const samples: Record<string, string> = {
    users: `{ city: 'Berlin' }`,
    products: `{
  price: { $gte: 100, $lte: 500 },
  inStock: true,
  rating: { $gte: 4.5 }
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
    files: `{
  filename: { $startsWith: 'report' },
  type: 'document'
}`,
    tasks: `{
  $and: [
    { $not: { status: 'completed' } },
    { priority: { $in: ['high', 'urgent'] } }
  ]
}`,
    ordersData: `{
  $and: [
    { status: { $in: ['shipped', 'delivered'] } },
    { amount: { $gte: 200 } }
  ]
}`,
    restaurants: `{
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 2000
    }
  },
  rating: { $gte: 4.5 }
}`,
    stores: `{
  location: {
    $geoBox: {
      southwest: { lat: 52.51, lng: 13.40 },
      northeast: { lat: 52.53, lng: 13.42 }
    }
  }
}`,
    properties: `{
  location: {
    $geoPolygon: {
      points: [
        { lat: 51.506, lng: -0.130 },
        { lat: 51.512, lng: -0.120 },
        { lat: 51.508, lng: -0.125 }
      ]
    }
  },
  price: { $lte: 700000 }
}`,
    customers: `{
  address: {
    $near: {
      center: { lat: 40.7580, lng: -73.9855 },
      maxDistanceMeters: 5000
    }
  },
  premium: true
}`,
    serviceAreas: `{
  location: {
    $geoBox: {
      southwest: { lat: 52.518, lng: 13.400 },
      northeast: { lat: 52.528, lng: 13.415 }
    }
  },
  surcharge: { $lte: 5 }
}`,
    events: `{
  date: { $upcoming: { days: 7 } }
}`,
    usersWithDates: `{
  birthDate: { $age: { min: 18 } },
  lastLogin: { $recent: { days: 7 } }
}`,
    appointments: `{
  time: { $timeOfDay: { start: 9, end: 17 } }
}`,
  };

  return samples[datasetId] || '{}';
}
