import { expectType } from 'tsd';
import { filter } from '../../src';

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
  };
}

const users: User[] = [];

expectType<User[]>(
  filter(users, {
    name: { $startsWith: 'John' },
  }),
);

expectType<User[]>(
  filter(users, {
    age: { $gte: 18, $lt: 65 },
  }),
);

expectType<User[]>(
  filter(users, {
    address: {
      city: { $startsWith: 'New' },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    address: {
      zipCode: { $gte: 10000, $lte: 99999 },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    address: {
      coordinates: {
        lat: { $gte: -90, $lte: 90 },
      },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    address: {
      coordinates: {
        lat: { $gte: -90, $lte: 90 },
        lng: { $gte: -180, $lte: 180 },
      },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    settings: {
      theme: { $eq: 'dark' },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    settings: {
      notifications: { $eq: true },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    settings: {
      privacy: {
        showEmail: { $eq: true },
      },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    settings: {
      privacy: {
        showEmail: { $eq: true },
        showPhone: { $eq: false },
      },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    metadata: {
      createdAt: { $gte: new Date('2024-01-01') },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    metadata: {
      tags: { $contains: 'verified' },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    name: { $startsWith: 'J' },
    age: { $gte: 25 },
    address: {
      city: { $eq: 'New York' },
      coordinates: {
        lat: { $gte: 40, $lte: 41 },
      },
    },
    settings: {
      notifications: { $eq: true },
      privacy: {
        showEmail: { $eq: true },
      },
    },
  }),
);

expectType<User[]>(
  filter(users, {
    $or: [
      {
        address: {
          city: { $eq: 'New York' },
        },
      },
      {
        address: {
          city: { $eq: 'Los Angeles' },
        },
      },
    ],
  }),
);

expectType<User[]>(
  filter(users, {
    $and: [
      {
        age: { $gte: 18 },
      },
      {
        address: {
          coordinates: {
            lat: { $gte: 0 },
          },
        },
      },
    ],
  }),
);
