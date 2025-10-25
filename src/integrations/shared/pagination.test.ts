import { describe, it, expect } from 'vitest';
import {
  calculateTotalPages,
  getPageData,
  createPaginationResult,
  validatePageNumber,
  validatePageSize,
} from './pagination';

describe('pagination utilities', () => {
  describe('calculateTotalPages', () => {
    it('should calculate total pages correctly', () => {
      expect(calculateTotalPages(100, 10)).toBe(10);
      expect(calculateTotalPages(95, 10)).toBe(10);
      expect(calculateTotalPages(101, 10)).toBe(11);
      expect(calculateTotalPages(0, 10)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(calculateTotalPages(1, 10)).toBe(1);
      expect(calculateTotalPages(10, 10)).toBe(1);
      expect(calculateTotalPages(11, 10)).toBe(2);
    });
  });

  describe('getPageData', () => {
    const data = Array.from({ length: 25 }, (_, i) => i + 1);

    it('should return correct page data', () => {
      expect(getPageData(data, 1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(getPageData(data, 2, 10)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
      expect(getPageData(data, 3, 10)).toEqual([21, 22, 23, 24, 25]);
    });

    it('should handle first page', () => {
      expect(getPageData(data, 1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle last page with partial data', () => {
      expect(getPageData(data, 5, 6)).toEqual([25]);
    });

    it('should return empty array for out of bounds page', () => {
      expect(getPageData(data, 10, 10)).toEqual([]);
    });
  });

  describe('createPaginationResult', () => {
    const allData = Array.from({ length: 25 }, (_, i) => i + 1);
    const pageData = [1, 2, 3, 4, 5];

    it('should create pagination result with correct metadata', () => {
      const result = createPaginationResult(pageData, allData, {
        currentPage: 1,
        pageSize: 5,
        totalItems: 25,
      });

      expect(result).toEqual({
        data: pageData,
        currentPage: 1,
        pageSize: 5,
        totalItems: 25,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('should handle middle page', () => {
      const result = createPaginationResult([11, 12, 13, 14, 15], allData, {
        currentPage: 3,
        pageSize: 5,
        totalItems: 25,
      });

      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
    });

    it('should handle last page', () => {
      const result = createPaginationResult([21, 22, 23, 24, 25], allData, {
        currentPage: 5,
        pageSize: 5,
        totalItems: 25,
      });

      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(true);
    });
  });

  describe('validatePageNumber', () => {
    it('should validate page number within bounds', () => {
      expect(validatePageNumber(1, 10)).toBe(1);
      expect(validatePageNumber(5, 10)).toBe(5);
      expect(validatePageNumber(10, 10)).toBe(10);
    });

    it('should clamp page number to minimum', () => {
      expect(validatePageNumber(0, 10)).toBe(1);
      expect(validatePageNumber(-5, 10)).toBe(1);
    });

    it('should clamp page number to maximum', () => {
      expect(validatePageNumber(11, 10)).toBe(10);
      expect(validatePageNumber(100, 10)).toBe(10);
    });
  });

  describe('validatePageSize', () => {
    it('should validate positive page size', () => {
      expect(validatePageSize(10)).toBe(10);
      expect(validatePageSize(1)).toBe(1);
      expect(validatePageSize(100)).toBe(100);
    });

    it('should clamp page size to minimum', () => {
      expect(validatePageSize(0)).toBe(1);
      expect(validatePageSize(-5)).toBe(1);
    });
  });
});
