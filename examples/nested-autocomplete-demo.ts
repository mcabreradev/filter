import { filter } from '../src';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  address: {
    street: string;
    city: string;
    zipCode: number;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  settings: {
    theme: string;
    notifications: boolean;
    language: string;
    privacy: {
      showEmail: boolean;
      showPhone: boolean;
      allowMessages: boolean;
    };
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    stats: {
      loginCount: number;
      lastLoginDays: number;
    };
  };
}

const users: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 28,
    address: {
      street: '123 Main St',
      city: 'New York',
      zipCode: 10001,
      country: 'USA',
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
    },
    settings: {
      theme: 'dark',
      notifications: true,
      language: 'en',
      privacy: {
        showEmail: true,
        showPhone: false,
        allowMessages: true,
      },
    },
    metadata: {
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-12-01'),
      tags: ['premium', 'verified', 'active'],
      stats: {
        loginCount: 245,
        lastLoginDays: 2,
      },
    },
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@company.com',
    age: 35,
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      zipCode: 90001,
      country: 'USA',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
    },
    settings: {
      theme: 'light',
      notifications: false,
      language: 'en',
      privacy: {
        showEmail: false,
        showPhone: false,
        allowMessages: false,
      },
    },
    metadata: {
      createdAt: new Date('2022-06-20'),
      updatedAt: new Date('2024-11-28'),
      tags: ['user', 'active'],
      stats: {
        loginCount: 89,
        lastLoginDays: 5,
      },
    },
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    age: 42,
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      zipCode: 60601,
      country: 'USA',
      coordinates: {
        lat: 41.8781,
        lng: -87.6298,
      },
    },
    settings: {
      theme: 'dark',
      notifications: true,
      language: 'en',
      privacy: {
        showEmail: true,
        showPhone: true,
        allowMessages: true,
      },
    },
    metadata: {
      createdAt: new Date('2021-11-10'),
      updatedAt: new Date('2024-12-05'),
      tags: ['premium', 'verified'],
      stats: {
        loginCount: 512,
        lastLoginDays: 1,
      },
    },
  },
];

console.log('=== Nested Object Autocomplete Demo ===\n');

console.log('1. Level 1: Filter by root properties');
const youngUsers = filter(users, {
  age: { $gte: 25, $lt: 40 },
});
console.log(youngUsers.map((u) => `${u.name} (${u.age})`));

console.log('\n2. Level 2: Filter by nested address.city');
const newYorkUsers = filter(users, {
  address: {
    city: { $eq: 'New York' },
  },
});
console.log(newYorkUsers.map((u) => `${u.name} - ${u.address.city}`));

console.log('\n3. Level 2: Filter by nested address.zipCode');
const highZipCodes = filter(users, {
  address: {
    zipCode: { $gte: 60000 },
  },
});
console.log(highZipCodes.map((u) => `${u.name} - ZIP: ${u.address.zipCode}`));

console.log('\n4. Level 3: Filter by deeply nested coordinates');
const northernUsers = filter(users, {
  address: {
    coordinates: {
      lat: { $gte: 40 },
    },
  },
});
console.log(northernUsers.map((u) => `${u.name} - Lat: ${u.address.coordinates.lat}`));

console.log('\n5. Level 3: Filter by coordinate range');
const westCoastUsers = filter(users, {
  address: {
    coordinates: {
      lng: { $lte: -100 },
    },
  },
});
console.log(
  westCoastUsers.map((u) => `${u.name} - ${u.address.city} (${u.address.coordinates.lng})`),
);

console.log('\n6. Level 2: Filter by settings.theme');
const darkThemeUsers = filter(users, {
  settings: {
    theme: { $eq: 'dark' },
  },
});
console.log(darkThemeUsers.map((u) => `${u.name} - Theme: ${u.settings.theme}`));

console.log('\n7. Level 3: Filter by privacy settings');
const publicEmailUsers = filter(users, {
  settings: {
    privacy: {
      showEmail: { $eq: true },
    },
  },
});
console.log(
  publicEmailUsers.map((u) => `${u.name} - Public email: ${u.settings.privacy.showEmail}`),
);

console.log('\n8. Level 3: Multiple privacy filters');
const openPrivacyUsers = filter(users, {
  settings: {
    privacy: {
      showEmail: { $eq: true },
      allowMessages: { $eq: true },
    },
  },
});
console.log(openPrivacyUsers.map((u) => `${u.name} - Open privacy settings`));

console.log('\n9. Level 2: Filter by metadata.createdAt');
const recentUsers = filter(users, {
  metadata: {
    createdAt: { $gte: new Date('2023-01-01') },
  },
});
console.log(
  recentUsers.map((u) => `${u.name} - Joined: ${u.metadata.createdAt.toLocaleDateString()}`),
);

console.log('\n10. Level 2: Filter by metadata.tags');
const verifiedUsers = filter(users, {
  metadata: {
    tags: { $contains: 'verified' },
  },
});
console.log(verifiedUsers.map((u) => `${u.name} - Tags: ${u.metadata.tags.join(', ')}`));

console.log('\n11. Level 4: Filter by deeply nested stats');
const activeLoginUsers = filter(users, {
  metadata: {
    stats: {
      loginCount: { $gte: 100 },
    },
  },
});
console.log(activeLoginUsers.map((u) => `${u.name} - Logins: ${u.metadata.stats.loginCount}`));

console.log('\n12. Level 4: Filter by recent activity');
const recentlyActiveUsers = filter(users, {
  metadata: {
    stats: {
      lastLoginDays: { $lte: 3 },
    },
  },
});
console.log(
  recentlyActiveUsers.map(
    (u) => `${u.name} - Last login: ${u.metadata.stats.lastLoginDays} days ago`,
  ),
);

console.log('\n13. Complex: Multiple nested levels combined');
const complexQuery = filter(users, {
  age: { $gte: 30 },
  address: {
    coordinates: {
      lat: { $gte: 40 },
    },
  },
  settings: {
    theme: { $eq: 'dark' },
    privacy: {
      showEmail: { $eq: true },
    },
  },
  metadata: {
    tags: { $contains: 'premium' },
  },
});
console.log(complexQuery.map((u) => `${u.name} - Complex match`));

console.log('\n14. Logical operators with nested objects');
const logicalQuery = filter(users, {
  $or: [
    {
      address: {
        city: { $eq: 'New York' },
      },
    },
    {
      address: {
        city: { $eq: 'Chicago' },
      },
    },
  ],
  settings: {
    notifications: { $eq: true },
  },
});
console.log(logicalQuery.map((u) => `${u.name} - ${u.address.city}`));

console.log('\n15. Mixed direct values and operators');
const mixedQuery = filter(users, {
  address: {
    country: 'USA',
    city: { $startsWith: 'New' },
  },
  settings: {
    notifications: true,
  },
});
console.log(mixedQuery.map((u) => `${u.name} - ${u.address.city}`));

console.log('\n=== Try these in your editor with Ctrl+Space! ===');
console.log('TypeScript will autocomplete operators at ANY nesting level.');
console.log('Supports up to 4 levels of nesting with intelligent suggestions.');
