/**
 * Type-Safe Filter Function
 *
 * Provides maximum type safety for dot notation filtering
 */

import { filter } from '../../core/filter';
import type { Expression, FilterOptions } from '../../types';
import type { NestedKeyOf } from '../../types/helpers';

/**
 * Type-safe filter function with dot notation support
 *
 * Ensures that dot notation paths are valid for the given type
 *
 * @example
 * ```typescript
 * interface User {
 *   profile: {
 *     age: number;
 *     address: {
 *       city: string;
 *     };
 *   };
 * }
 *
 * const users: User[] = [...];
 *
 * // ✅ Type-safe with autocomplete
 * typedFilter(users, {
 *   'profile.age': { $gte: 18 },
 *   'profile.address.city': 'Berlin'
 * });
 *
 * // ❌ TypeScript error
 * typedFilter(users, {
 *   'profile.invalid': true // Property does not exist
 * });
 * ```
 */
export function typedFilter<T>(
  array: T[],
  expression: Partial<Record<NestedKeyOf<T>, unknown>>,
  options?: FilterOptions,
): T[] {
  return filter(array, expression as Expression<T>, options);
}

/**
 * Create a typed filter function with optional default options
 *
 * @param defaultOptions - Default options to apply to all filter calls
 * @returns Typed filter function
 *
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   address: { city: string };
 * }
 *
 * const filterUsers = createTypedFilter<User>({ caseSensitive: false });
 * const results = filterUsers(users, { 'address.city': 'Berlin' });
 * ```
 */
export function createTypedFilter<T>(defaultOptions?: FilterOptions) {
  return (
    array: T[],
    expression: Partial<Record<NestedKeyOf<T>, unknown>>,
    options?: FilterOptions,
  ): T[] => {
    return typedFilter(array, expression, { ...defaultOptions, ...options });
  };
}

/**
 * Type-safe filter builder class
 *
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   profile: {
 *     age: number;
 *     address: {
 *       city: string;
 *     };
 *   };
 * }
 *
 * const filtered = new TypedFilterBuilder<User>()
 *   .where('name', { $startsWith: 'A' })
 *   .whereNested('profile.age', { $gte: 18 })
 *   .whereNested('profile.address.city', 'Berlin')
 *   .execute(users);
 * ```
 */
export class TypedFilterBuilder<T> {
  private expression: Partial<Record<NestedKeyOf<T>, unknown>> = {};
  private options?: FilterOptions;

  /**
   * Add a filter condition for a top-level property
   */
  where<K extends keyof T>(key: K, value: unknown): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.expression as any)[key] = value;
    return this;
  }

  /**
   * Add a filter condition for a nested property using dot notation
   */
  whereNested<P extends NestedKeyOf<T>>(path: P, value: unknown): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.expression as any)[path] = value;
    return this;
  }

  /**
   * Set filter options
   */
  withOptions(options: FilterOptions): this {
    this.options = options;
    return this;
  }

  /**
   * Build the expression without executing
   */
  build(): Expression<T> {
    return this.expression as Expression<T>;
  }

  /**
   * Execute the filter on the provided data
   */
  execute(data: T[]): T[] {
    return typedFilter(data, this.expression, this.options);
  }

  /**
   * Reset the builder to empty state
   */
  reset(): this {
    this.expression = {};
    this.options = undefined;
    return this;
  }
}
