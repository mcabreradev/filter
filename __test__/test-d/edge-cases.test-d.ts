import { expectType } from 'tsd';
import { filter } from '../../src/core/filter';

interface EmptyInterface {}

const emptyArray: EmptyInterface[] = [];

expectType<ChainableArray<EmptyInterface>>(filter(emptyArray, {}));

interface OptionalFields {
  required: string;
  optional?: number;
}

const optionalData: OptionalFields[] = [{ required: 'test' }, { required: 'test2', optional: 42 }];

expectType<ChainableArray<OptionalFields>>(filter(optionalData, { required: 'test' }));

expectType<ChainableArray<OptionalFields>>(filter(optionalData, { optional: 42 }));

interface ReadonlyData {
  readonly id: number;
  readonly name: string;
}

const readonlyArray: readonly ReadonlyData[] = [{ id: 1, name: 'Test' }];

expectType<ChainableArray<ReadonlyData>>(filter([...readonlyArray], { id: 1 }));

interface UnionType {
  type: 'a' | 'b' | 'c';
  value: string;
}

const unionData: UnionType[] = [{ type: 'a', value: 'test' }];

expectType<ChainableArray<UnionType>>(filter(unionData, { type: 'a' }));

interface GenericContainer<T> {
  data: T;
  metadata: string;
}

const genericData: GenericContainer<number>[] = [{ data: 42, metadata: 'test' }];

expectType<GenericContainer<number>[]>(filter(genericData, { data: 42 }));

type NullableUser = {
  name: string | null;
  age: number | undefined;
};

const nullableData: NullableUser[] = [
  { name: 'John', age: 25 },
  { name: null, age: undefined },
];

expectType<ChainableArray<NullableUser>>(filter(nullableData, { name: null }));

expectType<ChainableArray<NullableUser>>(filter(nullableData, (item) => item.name !== null));

interface RecursiveType {
  name: string;
  children?: RecursiveType[];
}

const recursiveData: RecursiveType[] = [{ name: 'parent', children: [{ name: 'child' }] }];

expectType<ChainableArray<RecursiveType>>(filter(recursiveData, { name: 'parent' }));

type ComplexUnion = string | number | { value: string } | ((x: number) => boolean);

const complexUnionArray: { data: ComplexUnion }[] = [
  { data: 'string' },
  { data: 42 },
  { data: { value: 'test' } },
];

expectType<ChainableArray<{ data: ComplexUnion }>>(
  filter(complexUnionArray, (item) => typeof item.data === 'string'),
);

interface IntersectionType {
  a: string;
}

interface IntersectionType2 {
  b: number;
}

type Combined = IntersectionType & IntersectionType2;

const intersectionData: Combined[] = [{ a: 'test', b: 42 }];

expectType<ChainableArray<Combined>>(filter(intersectionData, { a: 'test', b: 42 }));

const tupleArray: [string, number, boolean][] = [['test', 42, true]];

expectType<ChainableArray<[string, number, boolean]>>(
  filter(tupleArray, (item) => item[0] === 'test'),
);

type LiteralType = 'success' | 'error' | 'pending';

const literalData: { status: LiteralType }[] = [{ status: 'success' }];

expectType<ChainableArray<{ status: LiteralType }>>(filter(literalData, { status: 'success' }));

interface WithSymbol {
  [key: symbol]: string;
  name: string;
}

const symbolKey = Symbol('test');
const symbolData: WithSymbol[] = [{ [symbolKey]: 'value', name: 'test' }];

expectType<ChainableArray<WithSymbol>>(filter(symbolData, { name: 'test' }));
