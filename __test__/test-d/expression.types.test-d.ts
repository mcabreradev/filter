import { expectType, expectAssignable } from 'tsd';
import type {
  PrimitiveExpression,
  PredicateFunction,
  ObjectExpression,
  Expression,
} from '../../src/types';

expectAssignable<PrimitiveExpression>('test');
expectAssignable<PrimitiveExpression>(123);
expectAssignable<PrimitiveExpression>(true);
expectAssignable<PrimitiveExpression>(null);

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

expectAssignable<Expression<User>>('test');
expectAssignable<Expression<User>>(123);
expectAssignable<Expression<User>>(predicateFn);
expectAssignable<Expression<User>>(objectExpr);

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
