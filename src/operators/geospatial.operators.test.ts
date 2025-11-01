import { describe, it, expect } from 'vitest';
import { filter } from '../core/filter';
import type { GeoPoint } from '../types/geospatial';
import { calculateDistance, isValidGeoPoint } from '../utils/geo-distance';
import { evaluateNear, evaluateGeoBox, evaluateGeoPolygon } from './geospatial.operators';

describe('Geospatial Utils', () => {
  describe('isValidGeoPoint', () => {
    it('validates correct coordinates', () => {
      expect(isValidGeoPoint({ lat: 0, lng: 0 })).toBe(true);
      expect(isValidGeoPoint({ lat: 52.52, lng: 13.4 })).toBe(true);
      expect(isValidGeoPoint({ lat: -90, lng: -180 })).toBe(true);
      expect(isValidGeoPoint({ lat: 90, lng: 180 })).toBe(true);
    });

    it('rejects invalid coordinates', () => {
      expect(isValidGeoPoint({ lat: 91, lng: 0 })).toBe(false);
      expect(isValidGeoPoint({ lat: 0, lng: 181 })).toBe(false);
      expect(isValidGeoPoint({ lat: -91, lng: 0 })).toBe(false);
      expect(isValidGeoPoint({ lat: 0, lng: -181 })).toBe(false);
      expect(isValidGeoPoint(null)).toBe(false);
      expect(isValidGeoPoint(undefined)).toBe(false);
      expect(isValidGeoPoint({})).toBe(false);
      expect(isValidGeoPoint({ lat: 'invalid', lng: 0 })).toBe(false);
    });
  });

  describe('calculateDistance', () => {
    it('calculates distance between two points', () => {
      const berlin: GeoPoint = { lat: 52.52, lng: 13.405 };
      const paris: GeoPoint = { lat: 48.8566, lng: 2.3522 };

      const distance = calculateDistance(berlin, paris);
      expect(distance).toBeGreaterThan(877000);
      expect(distance).toBeLessThan(880000);
    });

    it('returns 0 for same point', () => {
      const point: GeoPoint = { lat: 52.52, lng: 13.405 };
      const distance = calculateDistance(point, point);
      expect(distance).toBe(0);
    });

    it('calculates short distances accurately', () => {
      const p1: GeoPoint = { lat: 52.52, lng: 13.405 };
      const p2: GeoPoint = { lat: 52.521, lng: 13.406 };

      const distance = calculateDistance(p1, p2);
      expect(distance).toBeGreaterThan(100);
      expect(distance).toBeLessThan(200);
    });
  });
});

describe('Geospatial Operators', () => {
  describe('$near operator', () => {
    it('finds points within radius', () => {
      const center: GeoPoint = { lat: 52.52, lng: 13.405 };

      expect(evaluateNear({ lat: 52.52, lng: 13.405 }, { center, maxDistanceMeters: 1000 })).toBe(
        true,
      );

      expect(evaluateNear({ lat: 52.521, lng: 13.406 }, { center, maxDistanceMeters: 1000 })).toBe(
        true,
      );
    });

    it('excludes points outside radius', () => {
      const center: GeoPoint = { lat: 52.52, lng: 13.405 };

      expect(evaluateNear({ lat: 48.8566, lng: 2.3522 }, { center, maxDistanceMeters: 1000 })).toBe(
        false,
      );
    });

    it('respects minimum distance', () => {
      const center: GeoPoint = { lat: 52.52, lng: 13.405 };

      expect(
        evaluateNear(
          { lat: 52.52, lng: 13.405 },
          { center, maxDistanceMeters: 1000, minDistanceMeters: 100 },
        ),
      ).toBe(false);

      expect(
        evaluateNear(
          { lat: 52.521, lng: 13.406 },
          { center, maxDistanceMeters: 1000, minDistanceMeters: 100 },
        ),
      ).toBe(true);
    });

    it('handles invalid points', () => {
      const center: GeoPoint = { lat: 52.52, lng: 13.405 };

      expect(
        evaluateNear({ lat: 91, lng: 0 } as GeoPoint, { center, maxDistanceMeters: 1000 }),
      ).toBe(false);

      expect(
        evaluateNear(
          { lat: 52.52, lng: 13.405 },
          { center: { lat: 91, lng: 0 } as GeoPoint, maxDistanceMeters: 1000 },
        ),
      ).toBe(false);
    });
  });

  describe('$geoBox operator', () => {
    it('finds points within bounding box', () => {
      const box = {
        southwest: { lat: 52.5, lng: 13.3 },
        northeast: { lat: 52.6, lng: 13.5 },
      };

      expect(evaluateGeoBox({ lat: 52.52, lng: 13.405 }, box)).toBe(true);
      expect(evaluateGeoBox({ lat: 52.5, lng: 13.3 }, box)).toBe(true);
      expect(evaluateGeoBox({ lat: 52.6, lng: 13.5 }, box)).toBe(true);
    });

    it('excludes points outside bounding box', () => {
      const box = {
        southwest: { lat: 52.5, lng: 13.3 },
        northeast: { lat: 52.6, lng: 13.5 },
      };

      expect(evaluateGeoBox({ lat: 52.4, lng: 13.4 }, box)).toBe(false);
      expect(evaluateGeoBox({ lat: 52.7, lng: 13.4 }, box)).toBe(false);
      expect(evaluateGeoBox({ lat: 52.55, lng: 13.2 }, box)).toBe(false);
      expect(evaluateGeoBox({ lat: 52.55, lng: 13.6 }, box)).toBe(false);
    });

    it('handles invalid points', () => {
      const box = {
        southwest: { lat: 52.5, lng: 13.3 },
        northeast: { lat: 52.6, lng: 13.5 },
      };

      expect(evaluateGeoBox({ lat: 91, lng: 13.4 } as GeoPoint, box)).toBe(false);
    });
  });

  describe('$geoPolygon operator', () => {
    it('finds points inside polygon', () => {
      const polygon = {
        points: [
          { lat: 52.5, lng: 13.3 },
          { lat: 52.6, lng: 13.3 },
          { lat: 52.6, lng: 13.5 },
          { lat: 52.5, lng: 13.5 },
        ],
      };

      expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, polygon)).toBe(true);
    });

    it('excludes points outside polygon', () => {
      const polygon = {
        points: [
          { lat: 52.5, lng: 13.3 },
          { lat: 52.6, lng: 13.3 },
          { lat: 52.6, lng: 13.5 },
          { lat: 52.5, lng: 13.5 },
        ],
      };

      expect(evaluateGeoPolygon({ lat: 52.4, lng: 13.4 }, polygon)).toBe(false);
      expect(evaluateGeoPolygon({ lat: 52.7, lng: 13.4 }, polygon)).toBe(false);
    });

    it('handles complex polygons', () => {
      const polygon = {
        points: [
          { lat: 52.5, lng: 13.3 },
          { lat: 52.55, lng: 13.35 },
          { lat: 52.6, lng: 13.3 },
          { lat: 52.6, lng: 13.5 },
          { lat: 52.5, lng: 13.5 },
        ],
      };

      expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, polygon)).toBe(true);
    });

    it('rejects invalid polygons', () => {
      expect(
        evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, { points: [{ lat: 52.5, lng: 13.3 }] }),
      ).toBe(false);

      expect(
        evaluateGeoPolygon(
          { lat: 52.55, lng: 13.4 },
          {
            points: [
              { lat: 52.5, lng: 13.3 },
              { lat: 52.6, lng: 13.3 },
            ],
          },
        ),
      ).toBe(false);
    });

    it('handles invalid points', () => {
      const polygon = {
        points: [
          { lat: 52.5, lng: 13.3 },
          { lat: 52.6, lng: 13.3 },
          { lat: 52.6, lng: 13.5 },
        ],
      };

      expect(evaluateGeoPolygon({ lat: 91, lng: 13.4 } as GeoPoint, polygon)).toBe(false);
    });
  });
});

describe('Filter with Geospatial Operators', () => {
  interface Restaurant {
    name: string;
    location: GeoPoint;
    rating: number;
  }

  const restaurants: Restaurant[] = [
    { name: 'Restaurant A', location: { lat: 52.52, lng: 13.405 }, rating: 4.5 },
    { name: 'Restaurant B', location: { lat: 52.521, lng: 13.406 }, rating: 4.0 },
    { name: 'Restaurant C', location: { lat: 52.53, lng: 13.42 }, rating: 4.8 },
    { name: 'Restaurant D', location: { lat: 48.8566, lng: 2.3522 }, rating: 4.2 },
    { name: 'Restaurant E', location: { lat: 52.55, lng: 13.45 }, rating: 3.9 },
  ];

  describe('$near filter', () => {
    it('filters restaurants by proximity', () => {
      const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

      const nearby = filter(restaurants, {
        location: {
          $near: {
            center: userLocation,
            maxDistanceMeters: 2000,
          },
        },
      });

      expect(nearby).toHaveLength(3);
      expect(nearby.map((r) => r.name)).toContain('Restaurant A');
      expect(nearby.map((r) => r.name)).toContain('Restaurant B');
      expect(nearby.map((r) => r.name)).toContain('Restaurant C');
    });

    it('filters with minimum distance', () => {
      const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

      const nearby = filter(restaurants, {
        location: {
          $near: {
            center: userLocation,
            maxDistanceMeters: 5000,
            minDistanceMeters: 500,
          },
        },
      });

      expect(nearby.map((r) => r.name)).not.toContain('Restaurant A');
      expect(nearby.map((r) => r.name)).toContain('Restaurant C');
    });

    it('combines with other filters', () => {
      const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

      const nearbyHighRated = filter(restaurants, {
        location: {
          $near: {
            center: userLocation,
            maxDistanceMeters: 5000,
          },
        },
        rating: { $gte: 4.5 },
      });

      expect(nearbyHighRated).toHaveLength(2);
      expect(nearbyHighRated.map((r) => r.name)).toContain('Restaurant A');
      expect(nearbyHighRated.map((r) => r.name)).toContain('Restaurant C');
    });
  });

  describe('$geoBox filter', () => {
    it('filters restaurants within bounding box', () => {
      const withinBox = filter(restaurants, {
        location: {
          $geoBox: {
            southwest: { lat: 52.51, lng: 13.4 },
            northeast: { lat: 52.54, lng: 13.43 },
          },
        },
      });

      expect(withinBox).toHaveLength(3);
      expect(withinBox.map((r) => r.name)).toContain('Restaurant A');
      expect(withinBox.map((r) => r.name)).toContain('Restaurant B');
      expect(withinBox.map((r) => r.name)).toContain('Restaurant C');
    });

    it('combines with rating filter', () => {
      const withinBox = filter(restaurants, {
        location: {
          $geoBox: {
            southwest: { lat: 52.51, lng: 13.4 },
            northeast: { lat: 52.54, lng: 13.43 },
          },
        },
        rating: { $gte: 4.5 },
      });

      expect(withinBox).toHaveLength(2);
      expect(withinBox.map((r) => r.name)).toContain('Restaurant A');
      expect(withinBox.map((r) => r.name)).toContain('Restaurant C');
    });
  });

  describe('$geoPolygon filter', () => {
    it('filters restaurants within polygon', () => {
      const withinPolygon = filter(restaurants, {
        location: {
          $geoPolygon: {
            points: [
              { lat: 52.51, lng: 13.4 },
              { lat: 52.54, lng: 13.4 },
              { lat: 52.54, lng: 13.43 },
              { lat: 52.51, lng: 13.43 },
            ],
          },
        },
      });

      expect(withinPolygon.length).toBeGreaterThanOrEqual(2);
    });

    it('combines with multiple filters', () => {
      const result = filter(restaurants, {
        location: {
          $geoPolygon: {
            points: [
              { lat: 52.51, lng: 13.4 },
              { lat: 52.56, lng: 13.4 },
              { lat: 52.56, lng: 13.46 },
              { lat: 52.51, lng: 13.46 },
            ],
          },
        },
        rating: { $gte: 4.0 },
      });

      expect(result.every((r) => r.rating >= 4.0)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles empty arrays', () => {
      const result = filter<Restaurant>([], {
        location: {
          $near: {
            center: { lat: 52.52, lng: 13.405 },
            maxDistanceMeters: 1000,
          },
        },
      });

      expect(result).toEqual([]);
    });

    it('handles items without location', () => {
      const items = [
        { name: 'A', location: { lat: 52.52, lng: 13.405 } },
        { name: 'B' },
        { name: 'C', location: { lat: 52.521, lng: 13.406 } },
      ];

      const result = filter(items, {
        location: {
          $near: {
            center: { lat: 52.52, lng: 13.405 },
            maxDistanceMeters: 1000,
          },
        },
      });

      expect(result.every((item) => item.location !== undefined)).toBe(true);
    });
  });
});
