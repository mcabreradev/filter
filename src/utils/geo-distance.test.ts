import { describe, it, expect } from 'vitest';
import { calculateDistance, isValidGeoPoint } from './geo-distance';
import type { GeoPoint } from '../types/geospatial';

describe('geo-distance utils', () => {
  describe('isValidGeoPoint', () => {
    describe('valid coordinates', () => {
      it('validates point at origin', () => {
        expect(isValidGeoPoint({ lat: 0, lng: 0 })).toBe(true);
      });

      it('validates positive coordinates', () => {
        expect(isValidGeoPoint({ lat: 52.52, lng: 13.4 })).toBe(true);
        expect(isValidGeoPoint({ lat: 45.5, lng: 90.75 })).toBe(true);
      });

      it('validates negative coordinates', () => {
        expect(isValidGeoPoint({ lat: -33.8688, lng: -151.2093 })).toBe(true);
        expect(isValidGeoPoint({ lat: -45.5, lng: -90.75 })).toBe(true);
      });

      it('validates boundary latitude values', () => {
        expect(isValidGeoPoint({ lat: -90, lng: 0 })).toBe(true);
        expect(isValidGeoPoint({ lat: 90, lng: 0 })).toBe(true);
      });

      it('validates boundary longitude values', () => {
        expect(isValidGeoPoint({ lat: 0, lng: -180 })).toBe(true);
        expect(isValidGeoPoint({ lat: 0, lng: 180 })).toBe(true);
      });

      it('validates all boundary extremes', () => {
        expect(isValidGeoPoint({ lat: -90, lng: -180 })).toBe(true);
        expect(isValidGeoPoint({ lat: 90, lng: 180 })).toBe(true);
        expect(isValidGeoPoint({ lat: -90, lng: 180 })).toBe(true);
        expect(isValidGeoPoint({ lat: 90, lng: -180 })).toBe(true);
      });

      it('validates decimal precision coordinates', () => {
        expect(isValidGeoPoint({ lat: 52.520008, lng: 13.404954 })).toBe(true);
        expect(isValidGeoPoint({ lat: -33.86882, lng: 151.20929 })).toBe(true);
      });
    });

    describe('invalid coordinates', () => {
      it('rejects latitude above 90', () => {
        expect(isValidGeoPoint({ lat: 91, lng: 0 })).toBe(false);
        expect(isValidGeoPoint({ lat: 90.1, lng: 0 })).toBe(false);
        expect(isValidGeoPoint({ lat: 100, lng: 0 })).toBe(false);
      });

      it('rejects latitude below -90', () => {
        expect(isValidGeoPoint({ lat: -91, lng: 0 })).toBe(false);
        expect(isValidGeoPoint({ lat: -90.1, lng: 0 })).toBe(false);
        expect(isValidGeoPoint({ lat: -100, lng: 0 })).toBe(false);
      });

      it('rejects longitude above 180', () => {
        expect(isValidGeoPoint({ lat: 0, lng: 181 })).toBe(false);
        expect(isValidGeoPoint({ lat: 0, lng: 180.1 })).toBe(false);
        expect(isValidGeoPoint({ lat: 0, lng: 200 })).toBe(false);
      });

      it('rejects longitude below -180', () => {
        expect(isValidGeoPoint({ lat: 0, lng: -181 })).toBe(false);
        expect(isValidGeoPoint({ lat: 0, lng: -180.1 })).toBe(false);
        expect(isValidGeoPoint({ lat: 0, lng: -200 })).toBe(false);
      });

      it('rejects null and undefined', () => {
        expect(isValidGeoPoint(null)).toBe(false);
        expect(isValidGeoPoint(undefined)).toBe(false);
      });

      it('rejects non-object types', () => {
        expect(isValidGeoPoint('string')).toBe(false);
        expect(isValidGeoPoint(123)).toBe(false);
        expect(isValidGeoPoint(true)).toBe(false);
        expect(isValidGeoPoint([])).toBe(false);
      });

      it('rejects empty object', () => {
        expect(isValidGeoPoint({})).toBe(false);
      });

      it('rejects object with missing lat', () => {
        expect(isValidGeoPoint({ lng: 0 })).toBe(false);
      });

      it('rejects object with missing lng', () => {
        expect(isValidGeoPoint({ lat: 0 })).toBe(false);
      });

      it('rejects object with non-numeric lat', () => {
        expect(isValidGeoPoint({ lat: 'invalid', lng: 0 })).toBe(false);
        expect(isValidGeoPoint({ lat: null, lng: 0 })).toBe(false);
        expect(isValidGeoPoint({ lat: undefined, lng: 0 })).toBe(false);
        expect(isValidGeoPoint({ lat: NaN, lng: 0 })).toBe(false);
      });

      it('rejects object with non-numeric lng', () => {
        expect(isValidGeoPoint({ lat: 0, lng: 'invalid' })).toBe(false);
        expect(isValidGeoPoint({ lat: 0, lng: null })).toBe(false);
        expect(isValidGeoPoint({ lat: 0, lng: undefined })).toBe(false);
        expect(isValidGeoPoint({ lat: 0, lng: NaN })).toBe(false);
      });

      it('rejects object with extra properties but invalid coordinates', () => {
        expect(isValidGeoPoint({ lat: 91, lng: 0, extra: 'prop' })).toBe(false);
      });
    });
  });

  describe('calculateDistance', () => {
    describe('identical points', () => {
      it('returns 0 for same coordinates', () => {
        const point: GeoPoint = { lat: 52.52, lng: 13.405 };
        expect(calculateDistance(point, point)).toBe(0);
      });

      it('returns 0 for different objects with same coordinates', () => {
        const p1: GeoPoint = { lat: 52.52, lng: 13.405 };
        const p2: GeoPoint = { lat: 52.52, lng: 13.405 };
        expect(calculateDistance(p1, p2)).toBe(0);
      });

      it('returns 0 for origin point', () => {
        const origin: GeoPoint = { lat: 0, lng: 0 };
        expect(calculateDistance(origin, origin)).toBe(0);
      });
    });

    describe('known distances', () => {
      it('calculates Berlin to Paris distance accurately', () => {
        const berlin: GeoPoint = { lat: 52.52, lng: 13.405 };
        const paris: GeoPoint = { lat: 48.8566, lng: 2.3522 };

        const distance = calculateDistance(berlin, paris);
        expect(distance).toBeGreaterThan(877000);
        expect(distance).toBeLessThan(880000);
      });

      it('calculates New York to London distance accurately', () => {
        const newYork: GeoPoint = { lat: 40.7128, lng: -74.006 };
        const london: GeoPoint = { lat: 51.5074, lng: -0.1278 };

        const distance = calculateDistance(newYork, london);
        expect(distance).toBeGreaterThan(5570000);
        expect(distance).toBeLessThan(5580000);
      });

      it('calculates Sydney to Tokyo distance accurately', () => {
        const sydney: GeoPoint = { lat: -33.8688, lng: 151.2093 };
        const tokyo: GeoPoint = { lat: 35.6762, lng: 139.6503 };

        const distance = calculateDistance(sydney, tokyo);
        expect(distance).toBeGreaterThan(7800000);
        expect(distance).toBeLessThan(7900000);
      });
    });

    describe('short distances', () => {
      it('calculates very short distances accurately', () => {
        const p1: GeoPoint = { lat: 52.52, lng: 13.405 };
        const p2: GeoPoint = { lat: 52.521, lng: 13.406 };

        const distance = calculateDistance(p1, p2);
        expect(distance).toBeGreaterThan(100);
        expect(distance).toBeLessThan(200);
      });

      it('calculates distances within 1km', () => {
        const p1: GeoPoint = { lat: 52.52, lng: 13.405 };
        const p2: GeoPoint = { lat: 52.525, lng: 13.41 };

        const distance = calculateDistance(p1, p2);
        expect(distance).toBeGreaterThan(500);
        expect(distance).toBeLessThan(700);
      });

      it('calculates nearby points within meters', () => {
        const p1: GeoPoint = { lat: 52.52, lng: 13.405 };
        const p2: GeoPoint = { lat: 52.5201, lng: 13.4051 };

        const distance = calculateDistance(p1, p2);
        expect(distance).toBeLessThan(150);
      });
    });

    describe('edge cases', () => {
      it('calculates distance across the equator', () => {
        const north: GeoPoint = { lat: 10, lng: 0 };
        const south: GeoPoint = { lat: -10, lng: 0 };

        const distance = calculateDistance(north, south);
        expect(distance).toBeGreaterThan(2200000);
        expect(distance).toBeLessThan(2300000);
      });

      it('calculates distance at the poles', () => {
        const northPole: GeoPoint = { lat: 90, lng: 0 };
        const nearNorthPole: GeoPoint = { lat: 89, lng: 0 };

        const distance = calculateDistance(northPole, nearNorthPole);
        expect(distance).toBeGreaterThan(110000);
        expect(distance).toBeLessThan(112000);
      });

      it('calculates distance across prime meridian', () => {
        const west: GeoPoint = { lat: 51.5, lng: -1 };
        const east: GeoPoint = { lat: 51.5, lng: 1 };

        const distance = calculateDistance(west, east);
        expect(distance).toBeGreaterThan(120000);
        expect(distance).toBeLessThan(140000);
      });

      it('calculates distance at date line', () => {
        const west: GeoPoint = { lat: 0, lng: 179 };
        const east: GeoPoint = { lat: 0, lng: -179 };

        const distance = calculateDistance(west, east);
        expect(distance).toBeGreaterThan(220000);
        expect(distance).toBeLessThan(230000);
      });
    });

    describe('symmetry', () => {
      it('returns same distance regardless of order', () => {
        const p1: GeoPoint = { lat: 52.52, lng: 13.405 };
        const p2: GeoPoint = { lat: 48.8566, lng: 2.3522 };

        const distance1 = calculateDistance(p1, p2);
        const distance2 = calculateDistance(p2, p1);

        expect(distance1).toBe(distance2);
      });

      it('maintains symmetry for negative coordinates', () => {
        const p1: GeoPoint = { lat: -33.8688, lng: 151.2093 };
        const p2: GeoPoint = { lat: 35.6762, lng: -139.6503 };

        const distance1 = calculateDistance(p1, p2);
        const distance2 = calculateDistance(p2, p1);

        expect(distance1).toBe(distance2);
      });
    });

    describe('precision', () => {
      it('handles high precision coordinates', () => {
        const p1: GeoPoint = { lat: 52.520008, lng: 13.404954 };
        const p2: GeoPoint = { lat: 52.520009, lng: 13.404955 };

        const distance = calculateDistance(p1, p2);
        expect(distance).toBeLessThan(1);
      });

      it('calculates consistent results for very close points', () => {
        const p1: GeoPoint = { lat: 52.52, lng: 13.405 };
        const p2: GeoPoint = { lat: 52.52000001, lng: 13.40500001 };

        const distance = calculateDistance(p1, p2);
        expect(distance).toBeGreaterThanOrEqual(0);
        expect(distance).toBeLessThan(0.01);
      });
    });
  });
});
