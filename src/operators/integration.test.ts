import { describe, it, expect } from 'vitest';
import { filter } from '../core/filter';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
  createdAt: Date;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 1200,
    category: 'Electronics',
    tags: ['computer', 'portable'],
    inStock: true,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 2,
    name: 'Mouse',
    price: 25,
    category: 'Electronics',
    tags: ['computer', 'accessory'],
    inStock: true,
    createdAt: new Date('2025-02-20'),
  },
  {
    id: 3,
    name: 'Desk',
    price: 350,
    category: 'Furniture',
    tags: ['office', 'large'],
    inStock: false,
    createdAt: new Date('2025-03-10'),
  },
  {
    id: 4,
    name: 'Chair',
    price: 180,
    category: 'Furniture',
    tags: ['office', 'ergonomic'],
    inStock: true,
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 5,
    name: 'Monitor',
    price: 450,
    category: 'Electronics',
    tags: ['computer', 'display'],
    inStock: true,
    createdAt: new Date('2025-04-12'),
  },
];

describe('operator integration tests', () => {
  describe('real-world scenarios', () => {
    it('filters products by price range', () => {
      const result = filter(products, { price: { $gte: 100, $lte: 400 } });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(['Desk', 'Chair']);
    });

    it('filters products by price and category', () => {
      const result = filter(products, {
        price: { $gte: 100 },
        category: 'Electronics',
      });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(['Laptop', 'Monitor']);
    });

    it('filters products with tags containing specific value', () => {
      const result = filter(products, (item) => {
        return item.tags.includes('computer');
      });
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.name)).toEqual(['Laptop', 'Mouse', 'Monitor']);
    });

    it('filters products by date range', () => {
      const result = filter(products, {
        createdAt: {
          $gte: new Date('2025-02-01'),
          $lte: new Date('2025-03-31'),
        },
      });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(['Mouse', 'Desk']);
    });

    it('filters out specific categories', () => {
      const result = filter(products, {
        category: { $ne: 'Furniture' },
      });
      expect(result).toHaveLength(3);
      expect(result.every((p) => p.category === 'Electronics')).toBe(true);
    });

    it('filters by multiple conditions with operators', () => {
      const result = filter(products, {
        price: { $lt: 500 },
        inStock: { $eq: true },
        category: { $in: ['Electronics', 'Furniture'] },
      });
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.name)).toEqual(['Mouse', 'Chair', 'Monitor']);
    });

    it('filters products by name pattern and price', () => {
      const result = filter(products, {
        name: { $startsWith: 'M' },
        price: { $gt: 20 },
      });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(['Mouse', 'Monitor']);
    });

    it('filters products not in specific ids', () => {
      const result = filter(products, {
        id: { $nin: [1, 2, 3] },
      });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(['Chair', 'Monitor']);
    });

    it('combines operators with array size check', () => {
      const result = filter(products, {
        tags: { $size: 2 },
        inStock: { $eq: true },
      });
      expect(result).toHaveLength(4);
    });
  });

  describe('mixing operators with legacy syntax', () => {
    it('combines operator with simple equality', () => {
      const result = filter(products, {
        category: 'Electronics',
        price: { $gte: 400 },
      });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(['Laptop', 'Monitor']);
    });

    it('combines operator with wildcard pattern', () => {
      const result = filter(products, {
        name: 'M%',
        price: { $lt: 100 },
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Mouse');
    });

    it('combines operator with negation', () => {
      const result = filter(products, {
        category: '!Furniture',
        price: { $gte: 100, $lte: 500 },
      });
      expect(result).toHaveLength(1);
      expect(result.every((p) => p.category === 'Electronics')).toBe(true);
    });
  });

  describe('complex multi-operator queries', () => {
    it('filters with comparison, array, and string operators', () => {
      const result = filter(products, {
        price: { $gte: 100, $lte: 500 },
        category: { $in: ['Electronics', 'Furniture'] },
        name: { $startsWith: 'M' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Monitor');
    });

    it('handles multiple operator types on different properties', () => {
      const result = filter(products, {
        price: { $gt: 50, $lt: 500 },
        tags: { $size: 2 },
      });
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.name)).toEqual(['Desk', 'Chair', 'Monitor']);
    });

    it('filters with date, number, and boolean operators', () => {
      const result = filter(products, {
        createdAt: { $gte: new Date('2025-01-01') },
        price: { $lt: 300 },
        inStock: { $eq: true },
      });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.name)).toEqual(['Mouse', 'Chair']);
    });
  });

  describe('edge cases and error handling', () => {
    it('handles empty arrays', () => {
      const result = filter([] as typeof products, { price: { $gt: 100 } });
      expect(result).toEqual([]);
    });

    it('handles no matching results', () => {
      const result = filter(products, {
        price: { $gt: 10000 },
      });
      expect(result).toEqual([]);
    });

    it('handles all items matching', () => {
      const result = filter(products, {
        price: { $gt: 0 },
      });
      expect(result).toHaveLength(5);
    });

    it('handles multiple operators that create impossible condition', () => {
      const result = filter(products, {
        price: { $gt: 500, $lt: 100 },
      });
      expect(result).toEqual([]);
    });

    it('handles undefined properties gracefully', () => {
      // Using type assertion to test handling of undefined properties
      const result = filter(products, {
        // @ts-expect-error Testing undefined property handling
        description: { $contains: 'test' },
      });
      expect(result).toEqual([]);
    });
  });

  describe('operator with configuration options', () => {
    it('respects caseSensitive option with string operators', () => {
      const result1 = filter(products, { name: { $startsWith: 'lap' } }, { caseSensitive: false });
      expect(result1).toHaveLength(1);

      const result2 = filter(products, { name: { $startsWith: 'lap' } }, { caseSensitive: true });
      expect(result2).toHaveLength(0);
    });

    it('works with custom comparator (though operators take precedence)', () => {
      const result = filter(
        products,
        { price: { $gte: 100 } },
        {
          customComparator: () => true,
        },
      );
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('predicate function combined with operators', () => {
    it('allows filtering with both operators and predicate', () => {
      const operatorResult = filter(products, { price: { $gte: 100, $lte: 500 } });

      const predicateResult = filter(operatorResult, (item) => item.inStock === true);

      expect(predicateResult).toHaveLength(2);
      expect(predicateResult.map((p) => p.name)).toEqual(['Chair', 'Monitor']);
    });
  });
});
