import { filter } from '../../core/filter/filter';

interface TestItem {
  id: number;
  name: string;
  value: number;
  active: boolean;
  category?: string;
}

const testData: TestItem[] = [
  { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
  { id: 2, name: 'Item B', value: 20, active: false, category: 'furniture' },
  { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
  { id: 4, name: 'Item D', value: 40, active: false, category: 'furniture' },
  { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
];

describe('Logical Operators', () => {
  describe('$and operator', () => {
    it('should filter with $and operator combining two conditions', () => {
      const result = filter(testData, {
        $and: [{ active: true }, { value: { $gte: 30 } }],
      });
      expect(result).toEqual([
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should handle multiple conditions in $and', () => {
      const result = filter(testData, {
        $and: [{ active: true }, { value: { $gt: 5 } }, { value: { $lt: 25 } }],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
      ]);
    });

    it('should work with $and and category filter', () => {
      const result = filter(testData, {
        $and: [{ category: 'electronics' }, { value: { $gte: 20 } }],
      });
      expect(result).toEqual([
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
      ]);
    });

    it('should return empty array when $and conditions do not match', () => {
      const result = filter(testData, {
        $and: [{ active: true }, { value: { $gt: 100 } }],
      });
      expect(result).toEqual([]);
    });

    it('should throw error if $and is not an array', () => {
      expect(() => {
        filter(testData, {
          $and: { active: true } as unknown,
        });
      }).toThrow('$and operator requires an array of expressions');
    });
  });

  describe('$or operator', () => {
    it('should filter with $or operator', () => {
      const result = filter(testData, {
        $or: [{ value: { $lt: 15 } }, { value: { $gt: 45 } }],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should handle multiple conditions in $or', () => {
      const result = filter(testData, {
        $or: [{ name: 'Item A' }, { name: 'Item C' }, { value: 40 }],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 4, name: 'Item D', value: 40, active: false, category: 'furniture' },
      ]);
    });

    it('should work with $or and category filter', () => {
      const result = filter(testData, {
        $or: [{ category: 'electronics' }, { category: 'accessories' }],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should throw error if $or is not an array', () => {
      expect(() => {
        filter(testData, {
          $or: { active: true } as unknown,
        });
      }).toThrow('$or operator requires an array of expressions');
    });
  });

  describe('$not operator', () => {
    it('should filter with $not operator', () => {
      const result = filter(testData, {
        $not: { active: true },
      });
      expect(result).toEqual([
        { id: 2, name: 'Item B', value: 20, active: false, category: 'furniture' },
        { id: 4, name: 'Item D', value: 40, active: false, category: 'furniture' },
      ]);
    });

    it('should work with complex expressions', () => {
      const result = filter(testData, {
        $not: { value: { $gte: 30 } },
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 2, name: 'Item B', value: 20, active: false, category: 'furniture' },
      ]);
    });

    it('should work with $not and category filter', () => {
      const result = filter(testData, {
        $not: { category: 'furniture' },
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should throw error if $not is an array', () => {
      expect(() => {
        filter(testData, {
          $not: [{ active: true }] as unknown,
        });
      }).toThrow('$not operator requires a single expression');
    });
  });

  describe('Nested logical operators', () => {
    it('should handle $and inside $or', () => {
      const result = filter(testData, {
        $or: [
          { $and: [{ active: true }, { value: { $lt: 15 } }] },
          { $and: [{ active: false }, { value: { $gt: 35 } }] },
        ],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 4, name: 'Item D', value: 40, active: false, category: 'furniture' },
      ]);
    });

    it('should handle $or inside $and', () => {
      const result = filter(testData, {
        $and: [
          { $or: [{ category: 'electronics' }, { category: 'accessories' }] },
          { active: true },
        ],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should handle $not with $and', () => {
      const result = filter(testData, {
        $not: {
          $and: [{ active: false }, { value: { $gte: 30 } }],
        },
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 2, name: 'Item B', value: 20, active: false, category: 'furniture' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should handle $not with $or', () => {
      const result = filter(testData, {
        $not: {
          $or: [{ value: { $lt: 20 } }, { value: { $gt: 40 } }],
        },
      });
      expect(result).toEqual([
        { id: 2, name: 'Item B', value: 20, active: false, category: 'furniture' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 4, name: 'Item D', value: 40, active: false, category: 'furniture' },
      ]);
    });

    it('should handle complex nested structure', () => {
      const result = filter(testData, {
        $and: [
          {
            $or: [{ name: 'Item A' }, { name: 'Item C' }, { name: 'Item E' }],
          },
          {
            $not: { value: { $lt: 20 } },
          },
        ],
      });
      expect(result).toEqual([
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should handle deeply nested logical operators', () => {
      const result = filter(testData, {
        $or: [
          {
            $and: [{ category: 'electronics' }, { $not: { value: { $lt: 20 } } }],
          },
          {
            $and: [{ category: 'accessories' }, { active: true }],
          },
        ],
      });
      expect(result).toEqual([
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });
  });

  describe('Combining logical with field operators', () => {
    it('should combine $and with field-level conditions', () => {
      const result = filter(testData, {
        active: true,
        $and: [{ value: { $gte: 10 } }, { value: { $lte: 30 } }],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
      ]);
    });

    it('should combine $or with field-level conditions', () => {
      const result = filter(testData, {
        active: true,
        $or: [{ value: { $lt: 15 } }, { value: { $gt: 40 } }],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should combine $not with field-level conditions', () => {
      const result = filter(testData, {
        category: 'electronics',
        $not: { value: { $lt: 20 } },
      });
      expect(result).toEqual([
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
      ]);
    });

    it('should combine multiple logical operators with field conditions', () => {
      const result = filter(testData, {
        active: true,
        $and: [
          { $or: [{ category: 'electronics' }, { category: 'accessories' }] },
          { $not: { value: { $lt: 20 } } },
        ],
      });
      expect(result).toEqual([
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });
  });

  describe('Real-world scenarios', () => {
    it('should filter active electronics or accessories with value > 20', () => {
      const result = filter(testData, {
        $and: [
          { active: true },
          { $or: [{ category: 'electronics' }, { category: 'accessories' }] },
          { value: { $gt: 20 } },
        ],
      });
      expect(result).toEqual([
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should filter items that are NOT (inactive AND furniture)', () => {
      const result = filter(testData, {
        $not: {
          $and: [{ active: false }, { category: 'furniture' }],
        },
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should filter premium items (high value OR specific categories) AND active', () => {
      const result = filter(testData, {
        $and: [
          {
            $or: [{ value: { $gte: 40 } }, { category: 'electronics' }],
          },
          { active: true },
        ],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty $and array gracefully', () => {
      const result = filter(testData, {
        $and: [],
      });
      expect(result).toEqual(testData);
    });

    it('should handle empty $or array gracefully', () => {
      const result = filter(testData, {
        $or: [],
      });
      expect(result).toEqual([]);
    });

    it('should handle single condition in $and', () => {
      const result = filter(testData, {
        $and: [{ active: true }],
      });
      expect(result).toEqual([
        { id: 1, name: 'Item A', value: 10, active: true, category: 'electronics' },
        { id: 3, name: 'Item C', value: 30, active: true, category: 'electronics' },
        { id: 5, name: 'Item E', value: 50, active: true, category: 'accessories' },
      ]);
    });

    it('should handle single condition in $or', () => {
      const result = filter(testData, {
        $or: [{ active: false }],
      });
      expect(result).toEqual([
        { id: 2, name: 'Item B', value: 20, active: false, category: 'furniture' },
        { id: 4, name: 'Item D', value: 40, active: false, category: 'furniture' },
      ]);
    });
  });
});
