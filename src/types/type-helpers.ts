/**
 * Type Helpers for Dot Notation and Type-Safe Filtering
 *
 * Provides utility types for type-safe dot notation paths,
 * nested key access, and filter expressions.
 */

/**
 * Primitive types that don't need further traversal
 */
export type Primitive = string | number | boolean | Date | null | undefined;

/**
 * Extract nested keys from an object type using dot notation
 *
 * @example
 * ```typescript
 * interface User {
 *   profile: {
 *     address: {
 *       city: string;
 *     };
 *   };
 * }
 *
 * type Paths = NestedKeyOf<User>;
 * // "profile" | "profile.address" | "profile.address.city"
 * ```
 */
export type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends Primitive
    ? `${K}`
    : T[K] extends Array<infer U>
      ? `${K}` | `${K}.${NestedKeyOf<U>}`
      : T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
}[keyof T & (string | number)];

/**
 * Get the value type at a specific nested path
 *
 * @example
 * ```typescript
 * interface User {
 *   profile: {
 *     age: number;
 *   };
 * }
 *
 * type Age = PathValue<User, 'profile.age'>; // number
 * ```
 */
export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * Make all properties optional recursively
 *
 * @example
 * ```typescript
 * interface User {
 *   profile: {
 *     name: string;
 *   };
 * }
 *
 * type PartialUser = DeepPartial<User>;
 * // { profile?: { name?: string } }
 * ```
 */
export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends object
      ? {
          [P in keyof T]?: DeepPartial<T[P]>;
        }
      : T;

/**
 * Extract only the keys that point to primitive values
 *
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   age: number;
 *   address: { city: string };
 * }
 *
 * type PrimitiveKeys = PrimitiveKeys<User>; // "name" | "age"
 * ```
 */
export type PrimitiveKeys<T> = {
  [K in keyof T]: T[K] extends Primitive ? K : never;
}[keyof T];

/**
 * Extract only the keys that point to object values
 *
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   address: { city: string };
 * }
 *
 * type ObjectKeys = ObjectKeys<User>; // "address"
 * ```
 */
export type ObjectKeys<T> = {
  [K in keyof T]: T[K] extends Primitive ? never : T[K] extends Array<unknown> ? never : K;
}[keyof T];

/**
 * Create a union of all possible nested paths up to a specific depth
 *
 * @example
 * ```typescript
 * interface User {
 *   profile: {
 *     address: {
 *       city: string;
 *     };
 *   };
 * }
 *
 * type Paths = NestedPaths<User, 2>;
 * // "profile" | "profile.address"
 * ```
 */
export type NestedPaths<T, Depth extends number = 3> = Depth extends 0
  ? never
  : {
      [K in keyof T & string]: T[K] extends Primitive
        ? K
        : T[K] extends Array<infer U>
          ? K | `${K}.${NestedPaths<U, Prev[Depth]>}`
          : T[K] extends object
            ? K | `${K}.${NestedPaths<T[K], Prev[Depth]>}`
            : K;
    }[keyof T & string];

/**
 * Helper type for depth calculation
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Type guard to check if a value is a primitive
 */
export function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  );
}

/**
 * Type guard to check if a value is a plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  // Check for built-in objects
  if (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Map ||
    value instanceof Set
  ) {
    return false;
  }

  // Check for plain objects (including Object.create(null))
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Get a value from a nested object using a dot notation path
 *
 * @example
 * ```typescript
 * const user = { profile: { address: { city: 'Berlin' } } };
 * const city = getNestedValue(user, 'profile.address.city');
 * // "Berlin"
 * ```
 */
export function getNestedValue<T, P extends string>(obj: T, path: P): PathValue<T, P> | undefined {
  if (!path || path === '') {
    return obj as PathValue<T, P>;
  }

  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Set a value in a nested object using a dot notation path
 *
 * @example
 * ```typescript
 * const user = { profile: { address: {} } };
 * setNestedValue(user, 'profile.address.city', 'Berlin');
 * // user.profile.address.city === 'Berlin'
 * ```
 */
export function setNestedValue<T>(obj: T, path: string, value: unknown): void {
  if (!obj || typeof obj !== 'object' || !path || path === '') {
    return;
  }

  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!isPlainObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Check if a path exists in an object
 *
 * @example
 * ```typescript
 * const user = { profile: { age: 30 } };
 * hasNestedPath(user, 'profile.age'); // true
 * hasNestedPath(user, 'profile.name'); // false
 * ```
 */
export function hasNestedPath<T>(obj: T, path: string): boolean {
  if (!path || path === '') {
    return true;
  }

  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (const key of keys) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object' ||
      !(key in current)
    ) {
      return false;
    }
    current = current[key];
  }

  return true;
}

/**
 * Validate that a path is a valid NestedKeyOf<T>
 *
 * @example
 * ```typescript
 * interface User {
 *   profile: {
 *     age: number;
 *   };
 * }
 *
 * isValidPath<User>('profile.age'); // true (at runtime)
 * ```
 */
export function isValidPath<T>(obj: T, path: string): path is NestedKeyOf<T> {
  return hasNestedPath(obj, path);
}

/**
 * Get all nested keys from an object at runtime
 *
 * @example
 * ```typescript
 * const user = { profile: { address: { city: 'Berlin' } } };
 * getAllNestedKeys(user);
 * // ["profile", "profile.address", "profile.address.city"]
 * ```
 */
export function getAllNestedKeys<T extends object>(
  obj: T,
  prefix: string = '',
  maxDepth: number = 10,
  currentDepth: number = 0,
): string[] {
  // Handle primitives and invalid inputs
  if (!obj || typeof obj !== 'object' || isPrimitive(obj)) {
    return [];
  }

  if (currentDepth >= maxDepth) {
    return [];
  }

  const keys: string[] = [];

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue;
    }

    const fullPath = prefix ? `${prefix}.${key}` : key;
    keys.push(fullPath);

    const value = obj[key];
    if (isPlainObject(value)) {
      const nestedKeys = getAllNestedKeys(value, fullPath, maxDepth, currentDepth + 1);
      keys.push(...nestedKeys);
    }
  }

  return keys;
}
