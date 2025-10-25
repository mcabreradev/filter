import { expectType, expectAssignable } from 'tsd';
import type {
  PrimitiveExpression,
  PredicateFunction,
  ObjectExpression,
  Expression,
} from '../../src/types';

expectType<PrimitiveExpression>('test');
expectType<PrimitiveExpression>(123);
expectType<PrimitiveExpression>(true);
expectType<PrimitiveExpression>(null);

interface User {
  name: string;
  age: number;
  email: string;
}

const predicateFn: PredicateFunction<User> = (user) => user.age > 18;

expectType<PredicateFunction<User>>(predicateFn);
expectType<boolean>(predicateFn({ name: 'John', age: 25, email: 'john@example.com' }));

const objectExpr: ObjectExpression<User> = {
  name: 'John',
  age: 25,
};

expectAssignable<ObjectExpression<User>>(objectExpr);

const partialObjectExpr: ObjectExpression<User> = {
  name: 'Jane',
};

expectAssignable<ObjectExpression<User>>(partialObjectExpr);

const emptyObjectExpr: ObjectExpression<User> = {};

expectAssignable<ObjectExpression<User>>(emptyObjectExpr);

expectType<Expression<User>>('test');
expectType<Expression<User>>(123);
expectType<Expression<User>>(predicateFn);
expectType<Expression<User>>(objectExpr);

interface NestedUser {
  profile: {
    bio: string;
    avatar: string;
  };
  settings: {
    theme: string;
  };
}

const nestedExpr: ObjectExpression<NestedUser> = {
  profile: {
    bio: 'Developer',
    avatar: 'avatar.png',
  },
};

expectAssignable<ObjectExpression<NestedUser>>(nestedExpr);

const nestedStringExpr: ObjectExpression<NestedUser> = {
  profile: 'Developer',
};

expectAssignable<ObjectExpression<NestedUser>>(nestedStringExpr);
