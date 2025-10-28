import { expectType, expectError } from 'tsd';
import { filter } from '../../src/core/filter';
import type { FilterOptions } from '../../src/types';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  isActive: boolean;
}

const users: User[] = [
  { id: 1, name: 'John', age: 25, email: 'john@example.com', isActive: true },
  { id: 2, name: 'Jane', age: 30, email: 'jane@example.com', isActive: false },
];

expectType<User[]>(filter(users, 'John'));

expectType<User[]>(filter(users, { name: 'John' }));

expectType<User[]>(filter(users, (user) => user.age > 18));

expectType<User[]>(
  filter(users, {
    age: { $gt: 18, $lt: 65 },
  }),
);

expectType<User[]>(
  filter(users, {
    $and: [{ name: 'John' }, { age: { $gt: 18 } }],
  }),
);

const options: FilterOptions = {
  caseSensitive: false,
  maxDepth: 5,
};

expectType<User[]>(filter(users, 'John', options));

expectType<User[]>(filter(users, { name: 'John' }, { caseSensitive: true }));

expectError(filter('not-an-array', 'test'));

interface Product {
  name: string;
  price: number;
  category: string;
  tags: string[];
}

const products: Product[] = [
  { name: 'Laptop', price: 1000, category: 'Electronics', tags: ['tech', 'computer'] },
];

expectType<Product[]>(
  filter(products, {
    price: { $gte: 500, $lte: 2000 },
    category: { $in: ['Electronics', 'Books'] },
    tags: { $contains: 'tech' },
  }),
);

expectType<Product[]>(
  filter(products, {
    $or: [{ category: 'Electronics' }, { price: { $lt: 100 } }],
  }),
);

expectType<Product[]>(
  filter(products, {
    $not: { category: 'Books' },
  }),
);

interface NestedData {
  user: {
    profile: {
      name: string;
      age: number;
    };
  };
}

const nestedData: NestedData[] = [
  {
    user: {
      profile: {
        name: 'John',
        age: 25,
      },
    },
  },
];

expectType<NestedData[]>(filter(nestedData, { user: 'John' }));

const primitiveArray = ['apple', 'banana', 'cherry'];

expectType<string[]>(filter(primitiveArray, 'apple'));

expectType<string[]>(filter(primitiveArray, (item) => item.startsWith('a')));

const numberArray = [1, 2, 3, 4, 5];

expectType<number[]>(filter(numberArray, 3));

expectType<number[]>(filter(numberArray, (num) => num > 3));

const mixedArray: (string | number)[] = ['a', 1, 'b', 2];

expectType<(string | number)[]>(filter(mixedArray, 'a'));

expectType<(string | number)[]>(filter(mixedArray, (item) => typeof item === 'string'));
