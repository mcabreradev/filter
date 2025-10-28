import { expectType, expectAssignable, expectNotAssignable } from 'tsd';
import type {
  ComparisonOperators,
  ArrayOperators,
  StringOperators,
  LogicalOperators,
  OperatorExpression,
  ExtendedObjectExpression,
} from '../../src/types';

const comparisonOps: ComparisonOperators = {
  $gt: 10,
  $gte: 5,
  $lt: 100,
  $lte: 50,
  $eq: 'test',
  $ne: null,
};

expectType<ComparisonOperators>(comparisonOps);

const dateComparison: ComparisonOperators = {
  $gt: new Date('2023-01-01'),
  $lte: new Date('2024-12-31'),
};

expectType<ComparisonOperators>(dateComparison);

const arrayOps: ArrayOperators = {
  $in: ['a', 'b', 'c'],
  $nin: [1, 2, 3],
  $contains: 'test',
  $size: 5,
};

expectType<ArrayOperators>(arrayOps);

const stringOps: StringOperators = {
  $startsWith: 'prefix',
  $endsWith: 'suffix',
  $contains: 'middle',
  $regex: /pattern/,
  $match: 'pattern',
};

expectType<StringOperators>(stringOps);

const regexString: StringOperators = {
  $regex: 'pattern-string',
};

expectType<StringOperators>(regexString);

interface Product {
  name: string;
  price: number;
  category: string;
}

const logicalOps: LogicalOperators<Product> = {
  $and: [{ name: 'Laptop' }, { price: 1000 }],
  $or: ['Electronics', (p) => p.price > 500],
  $not: { category: 'Books' },
};

expectType<LogicalOperators<Product>>(logicalOps);

const andOperator: LogicalOperators<Product> = {
  $and: [{ name: 'Phone' }, (p) => p.price < 1000, 'Electronics'],
};

expectType<LogicalOperators<Product>>(andOperator);

const orOperator: LogicalOperators<Product> = {
  $or: [{ category: 'Electronics' }, { category: 'Books' }],
};

expectType<LogicalOperators<Product>>(orOperator);

const notOperator: LogicalOperators<Product> = {
  $not: (p) => p.price > 1000,
};

expectType<LogicalOperators<Product>>(notOperator);

const combinedOps: OperatorExpression = {
  $gt: 10,
  $in: [1, 2, 3],
  $startsWith: 'test',
};

expectAssignable<OperatorExpression>(combinedOps);

interface User {
  name: string;
  age: number;
  email: string;
}

const extendedExpr: ExtendedObjectExpression<User> = {
  name: 'John',
  age: { $gt: 18, $lt: 65 },
  email: { $endsWith: '@example.com' },
};

expectType<ExtendedObjectExpression<User>>(extendedExpr);

const extendedWithLogical: ExtendedObjectExpression<User> = {
  $and: [{ name: 'John' }, { age: { $gt: 18 } }],
  $or: [{ email: { $endsWith: '@example.com' } }, { email: { $endsWith: '@test.com' } }],
};

expectType<ExtendedObjectExpression<User>>(extendedWithLogical);

const complexExpression: ExtendedObjectExpression<User> = {
  name: { $startsWith: 'J' },
  age: { $gte: 18, $lte: 65 },
  $and: [{ email: { $contains: '@' } }, (u) => u.name.length > 3],
  $not: { age: { $lt: 18 } },
};

expectType<ExtendedObjectExpression<User>>(complexExpression);

expectNotAssignable<ComparisonOperators>({
  $gt: 'not-a-number',
});

expectNotAssignable<ArrayOperators>({
  $size: 'not-a-number',
});

expectNotAssignable<StringOperators>({
  $startsWith: 123,
});
