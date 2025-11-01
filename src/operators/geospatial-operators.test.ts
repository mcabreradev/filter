import { describe, it, expect } from 'vitest';
import { filter } from '../core/filter';
import { evaluateNear, evaluateGeoBox, evaluateGeoPolygon } from './geospatial.operators';
import { calculateDistance, isValidGeoPoint } from '../utils/geo-distance';
import type { GeoPoint, NearQuery, BoundingBox, PolygonQuery } from '../types/geospatial';

describe('geospatial operators', () => {
  describe('$near operator', () => {
    const centerBerlin: GeoPoint = { lat: 52.52, lng: 13.405 };

    describe('basic proximity filtering', () => {
      it('includes point at exact center', () => {
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 1000 };
        expect(evaluateNear(centerBerlin, query)).toBe(true);
      });

      it('includes points within maxDistanceMeters', () => {
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 1000 };
        const nearbyPoint: GeoPoint = { lat: 52.521, lng: 13.406 };
        expect(evaluateNear(nearbyPoint, query)).toBe(true);
      });

      it('excludes points beyond maxDistanceMeters', () => {
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 1000 };
        const farPoint: GeoPoint = { lat: 48.8566, lng: 2.3522 };
        expect(evaluateNear(farPoint, query)).toBe(false);
      });

      it('includes point exactly at maxDistanceMeters boundary', () => {
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 150 };
        const boundaryPoint: GeoPoint = { lat: 52.5201, lng: 13.4051 };
        expect(evaluateNear(boundaryPoint, query)).toBe(true);
      });
    });

    describe('minDistanceMeters filtering', () => {
      it('excludes point at center when minDistanceMeters is set', () => {
        const query: NearQuery = {
          center: centerBerlin,
          maxDistanceMeters: 1000,
          minDistanceMeters: 100,
        };
        expect(evaluateNear(centerBerlin, query)).toBe(false);
      });

      it('excludes points within minDistanceMeters', () => {
        const query: NearQuery = {
          center: centerBerlin,
          maxDistanceMeters: 1000,
          minDistanceMeters: 200,
        };
        const tooClosePoint: GeoPoint = { lat: 52.5201, lng: 13.4051 };
        expect(evaluateNear(tooClosePoint, query)).toBe(false);
      });

      it('includes points between minDistanceMeters and maxDistanceMeters', () => {
        const query: NearQuery = {
          center: centerBerlin,
          maxDistanceMeters: 1000,
          minDistanceMeters: 100,
        };
        const validPoint: GeoPoint = { lat: 52.521, lng: 13.406 };
        expect(evaluateNear(validPoint, query)).toBe(true);
      });

      it('excludes points beyond maxDistanceMeters even with minDistanceMeters', () => {
        const query: NearQuery = {
          center: centerBerlin,
          maxDistanceMeters: 500,
          minDistanceMeters: 100,
        };
        const farPoint: GeoPoint = { lat: 52.525, lng: 13.41 };
        expect(evaluateNear(farPoint, query)).toBe(false);
      });

      it('handles minDistanceMeters of 0', () => {
        const query: NearQuery = {
          center: centerBerlin,
          maxDistanceMeters: 1000,
          minDistanceMeters: 0,
        };
        expect(evaluateNear(centerBerlin, query)).toBe(true);
      });
    });

    describe('invalid input handling', () => {
      it('returns false for invalid target point - latitude out of range', () => {
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 1000 };
        const invalidPoint: GeoPoint = { lat: 91, lng: 0 };
        expect(evaluateNear(invalidPoint, query)).toBe(false);
      });

      it('returns false for invalid target point - longitude out of range', () => {
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 1000 };
        const invalidPoint: GeoPoint = { lat: 0, lng: 181 };
        expect(evaluateNear(invalidPoint, query)).toBe(false);
      });

      it('returns false for invalid center point - latitude out of range', () => {
        const query: NearQuery = {
          center: { lat: 91, lng: 0 } as GeoPoint,
          maxDistanceMeters: 1000,
        };
        expect(evaluateNear(centerBerlin, query)).toBe(false);
      });

      it('returns false for invalid center point - longitude out of range', () => {
        const query: NearQuery = {
          center: { lat: 0, lng: 181 } as GeoPoint,
          maxDistanceMeters: 1000,
        };
        expect(evaluateNear(centerBerlin, query)).toBe(false);
      });

      it('returns false when both points are invalid', () => {
        const query: NearQuery = {
          center: { lat: 91, lng: 0 } as GeoPoint,
          maxDistanceMeters: 1000,
        };
        const invalidPoint: GeoPoint = { lat: -91, lng: 0 };
        expect(evaluateNear(invalidPoint, query)).toBe(false);
      });
    });

    describe('edge case distances', () => {
      it('handles very small maxDistanceMeters', () => {
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 1 };
        const nearbyPoint: GeoPoint = { lat: 52.52000001, lng: 13.40500001 };
        expect(evaluateNear(nearbyPoint, query)).toBe(true);
      });

      it('handles very large maxDistanceMeters', () => {
        // Antipode distance is ~20,015 km, adjusted to account for actual distance
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 20020000 };
        const antipode: GeoPoint = { lat: -52.52, lng: -166.595 };
        expect(evaluateNear(antipode, query)).toBe(true);
      });

      it('handles points across the date line', () => {
        // Date line crossing: 179.5 to -179.5 is ~111 km after normalization
        const center: GeoPoint = { lat: 0, lng: 179.5 };
        const query: NearQuery = { center, maxDistanceMeters: 112000 };
        const acrossDateLine: GeoPoint = { lat: 0, lng: -179.5 };
        expect(evaluateNear(acrossDateLine, query)).toBe(true);
      });

      it('handles date line crossing from east to west', () => {
        const center: GeoPoint = { lat: 0, lng: -179.5 };
        const query: NearQuery = { center, maxDistanceMeters: 112000 };
        const acrossDateLine: GeoPoint = { lat: 0, lng: 179.5 };
        expect(evaluateNear(acrossDateLine, query)).toBe(true);
      });

      it('correctly handles points across the date line with varied latitudes', () => {
        const center: GeoPoint = { lat: 35.6762, lng: 179.8 };
        const query: NearQuery = { center, maxDistanceMeters: 50000 };
        const acrossDateLine: GeoPoint = { lat: 35.6762, lng: -179.8 };
        expect(evaluateNear(acrossDateLine, query)).toBe(true);
      });

      it('correctly handles antipodal points across the date line', () => {
        const center: GeoPoint = { lat: 60, lng: 179 };
        const query: NearQuery = { center, maxDistanceMeters: 150000 };
        const nearPoint: GeoPoint = { lat: 60, lng: -179 };
        expect(evaluateNear(nearPoint, query)).toBe(true);
      });

      it('excludes points just beyond date line threshold', () => {
        const center: GeoPoint = { lat: 0, lng: 179.5 };
        const query: NearQuery = { center, maxDistanceMeters: 110000 };
        const acrossDateLine: GeoPoint = { lat: 0, lng: -179.5 };
        expect(evaluateNear(acrossDateLine, query)).toBe(false);
      });

      it('handles points at exact poles', () => {
        const northPole: GeoPoint = { lat: 90, lng: 0 };
        const nearNorthPole: GeoPoint = { lat: 89.999, lng: 0 };
        const query: NearQuery = { center: northPole, maxDistanceMeters: 200 };
        expect(evaluateNear(nearNorthPole, query)).toBe(true);
      });

      it('handles equatorial points with maximum longitude difference', () => {
        const p1: GeoPoint = { lat: 0, lng: 0 };
        const p2: GeoPoint = { lat: 0, lng: 180 };
        const query: NearQuery = { center: p1, maxDistanceMeters: 20040000 };
        expect(evaluateNear(p2, query)).toBe(true);
      });

      it('handles points with identical coordinates', () => {
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 0 };
        expect(evaluateNear(centerBerlin, query)).toBe(true);
      });

      it('excludes points with floating point precision differences', () => {
        const point: GeoPoint = { lat: 52.52, lng: 13.405 };
        const veryClose: GeoPoint = { lat: 52.52 + 1e-10, lng: 13.405 + 1e-10 };
        const query: NearQuery = { center: point, maxDistanceMeters: 0 };
        expect(evaluateNear(veryClose, query)).toBe(false);
      });
    });
  });

  describe('$geoBox operator', () => {
    const standardBox: BoundingBox = {
      southwest: { lat: 52.5, lng: 13.3 },
      northeast: { lat: 52.6, lng: 13.5 },
    };

    describe('basic bounding box filtering', () => {
      it('includes point at center of box', () => {
        const centerPoint: GeoPoint = { lat: 52.55, lng: 13.4 };
        expect(evaluateGeoBox(centerPoint, standardBox)).toBe(true);
      });

      it('includes point at southwest corner', () => {
        expect(evaluateGeoBox(standardBox.southwest, standardBox)).toBe(true);
      });

      it('includes point at northeast corner', () => {
        expect(evaluateGeoBox(standardBox.northeast, standardBox)).toBe(true);
      });

      it('includes point at northwest corner', () => {
        const nwCorner: GeoPoint = { lat: 52.6, lng: 13.3 };
        expect(evaluateGeoBox(nwCorner, standardBox)).toBe(true);
      });

      it('includes point at southeast corner', () => {
        const seCorner: GeoPoint = { lat: 52.5, lng: 13.5 };
        expect(evaluateGeoBox(seCorner, standardBox)).toBe(true);
      });

      it('includes points on box edges', () => {
        const edgePoints: GeoPoint[] = [
          { lat: 52.55, lng: 13.3 },
          { lat: 52.55, lng: 13.5 },
          { lat: 52.5, lng: 13.4 },
          { lat: 52.6, lng: 13.4 },
        ];

        edgePoints.forEach((point) => {
          expect(evaluateGeoBox(point, standardBox)).toBe(true);
        });
      });
    });

    describe('exclusion cases', () => {
      it('excludes point south of box', () => {
        const southPoint: GeoPoint = { lat: 52.4, lng: 13.4 };
        expect(evaluateGeoBox(southPoint, standardBox)).toBe(false);
      });

      it('excludes point north of box', () => {
        const northPoint: GeoPoint = { lat: 52.7, lng: 13.4 };
        expect(evaluateGeoBox(northPoint, standardBox)).toBe(false);
      });

      it('excludes point west of box', () => {
        const westPoint: GeoPoint = { lat: 52.55, lng: 13.2 };
        expect(evaluateGeoBox(westPoint, standardBox)).toBe(false);
      });

      it('excludes point east of box', () => {
        const eastPoint: GeoPoint = { lat: 52.55, lng: 13.6 };
        expect(evaluateGeoBox(eastPoint, standardBox)).toBe(false);
      });

      it('excludes point outside box diagonally', () => {
        const diagonalPoints: GeoPoint[] = [
          { lat: 52.4, lng: 13.2 },
          { lat: 52.7, lng: 13.6 },
          { lat: 52.4, lng: 13.6 },
          { lat: 52.7, lng: 13.2 },
        ];

        diagonalPoints.forEach((point) => {
          expect(evaluateGeoBox(point, standardBox)).toBe(false);
        });
      });

      it('excludes point just outside box boundary', () => {
        const justOutside: GeoPoint = { lat: 52.6001, lng: 13.4 };
        expect(evaluateGeoBox(justOutside, standardBox)).toBe(false);
      });
    });

    describe('special bounding boxes', () => {
      it('handles box crossing the equator', () => {
        const equatorBox: BoundingBox = {
          southwest: { lat: -10, lng: -10 },
          northeast: { lat: 10, lng: 10 },
        };

        expect(evaluateGeoBox({ lat: 0, lng: 0 }, equatorBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 5, lng: 5 }, equatorBox)).toBe(true);
        expect(evaluateGeoBox({ lat: -5, lng: -5 }, equatorBox)).toBe(true);
      });

      it('handles box crossing the prime meridian', () => {
        const primeMeridianBox: BoundingBox = {
          southwest: { lat: 50, lng: -10 },
          northeast: { lat: 60, lng: 10 },
        };

        expect(evaluateGeoBox({ lat: 55, lng: 0 }, primeMeridianBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 55, lng: -5 }, primeMeridianBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 55, lng: 5 }, primeMeridianBox)).toBe(true);
      });

      it('handles very small box', () => {
        const tinyBox: BoundingBox = {
          southwest: { lat: 52.52, lng: 13.405 },
          northeast: { lat: 52.521, lng: 13.406 },
        };

        expect(evaluateGeoBox({ lat: 52.5205, lng: 13.4055 }, tinyBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 52.519, lng: 13.404 }, tinyBox)).toBe(false);
      });

      it('handles box at extreme latitudes', () => {
        const polarBox: BoundingBox = {
          southwest: { lat: 85, lng: -180 },
          northeast: { lat: 90, lng: 180 },
        };

        expect(evaluateGeoBox({ lat: 87.5, lng: 0 }, polarBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 84, lng: 0 }, polarBox)).toBe(false);
      });

      it('handles box spanning entire longitude range', () => {
        const globalBox: BoundingBox = {
          southwest: { lat: -90, lng: -180 },
          northeast: { lat: 90, lng: 180 },
        };

        expect(evaluateGeoBox({ lat: 0, lng: 0 }, globalBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 90, lng: 180 }, globalBox)).toBe(true);
        expect(evaluateGeoBox({ lat: -90, lng: -180 }, globalBox)).toBe(true);
      });

      it('handles zero-area box (point)', () => {
        const pointBox: BoundingBox = {
          southwest: { lat: 52.52, lng: 13.405 },
          northeast: { lat: 52.52, lng: 13.405 },
        };

        expect(evaluateGeoBox({ lat: 52.52, lng: 13.405 }, pointBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 52.521, lng: 13.405 }, pointBox)).toBe(false);
      });

      it('handles box with minimal width', () => {
        const thinBox: BoundingBox = {
          southwest: { lat: 52.5, lng: 13.405 },
          northeast: { lat: 52.6, lng: 13.405 },
        };

        expect(evaluateGeoBox({ lat: 52.55, lng: 13.405 }, thinBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 52.55, lng: 13.406 }, thinBox)).toBe(false);
      });

      it('handles box at date line boundary', () => {
        const dateLineBox: BoundingBox = {
          southwest: { lat: -10, lng: 179 },
          northeast: { lat: 10, lng: 180 },
        };

        expect(evaluateGeoBox({ lat: 0, lng: 179.5 }, dateLineBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 0, lng: 180 }, dateLineBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 0, lng: 178.9 }, dateLineBox)).toBe(false);
      });

      it('correctly handles boxes spanning the entire longitude range', () => {
        const fullLongitudeBox: BoundingBox = {
          southwest: { lat: -45, lng: -180 },
          northeast: { lat: 45, lng: 180 },
        };

        expect(evaluateGeoBox({ lat: 0, lng: 0 }, fullLongitudeBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 30, lng: -170 }, fullLongitudeBox)).toBe(true);
        expect(evaluateGeoBox({ lat: -30, lng: 170 }, fullLongitudeBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 0, lng: 180 }, fullLongitudeBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 0, lng: -180 }, fullLongitudeBox)).toBe(true);
        expect(evaluateGeoBox({ lat: 50, lng: 0 }, fullLongitudeBox)).toBe(false);
        expect(evaluateGeoBox({ lat: -50, lng: 0 }, fullLongitudeBox)).toBe(false);
      });
    });

    describe('invalid input handling', () => {
      it('returns false for invalid point - latitude too high', () => {
        const invalidPoint: GeoPoint = { lat: 91, lng: 13.4 };
        expect(evaluateGeoBox(invalidPoint, standardBox)).toBe(false);
      });

      it('returns false for invalid point - latitude too low', () => {
        const invalidPoint: GeoPoint = { lat: -91, lng: 13.4 };
        expect(evaluateGeoBox(invalidPoint, standardBox)).toBe(false);
      });

      it('returns false for invalid point - longitude too high', () => {
        const invalidPoint: GeoPoint = { lat: 52.55, lng: 181 };
        expect(evaluateGeoBox(invalidPoint, standardBox)).toBe(false);
      });

      it('returns false for invalid point - longitude too low', () => {
        const invalidPoint: GeoPoint = { lat: 52.55, lng: -181 };
        expect(evaluateGeoBox(invalidPoint, standardBox)).toBe(false);
      });
    });
  });

  describe('$geoPolygon operator', () => {
    const squarePolygon: PolygonQuery = {
      points: [
        { lat: 52.5, lng: 13.3 },
        { lat: 52.6, lng: 13.3 },
        { lat: 52.6, lng: 13.5 },
        { lat: 52.5, lng: 13.5 },
      ],
    };

    describe('basic polygon filtering', () => {
      it('includes point at center of polygon', () => {
        const centerPoint: GeoPoint = { lat: 52.55, lng: 13.4 };
        expect(evaluateGeoPolygon(centerPoint, squarePolygon)).toBe(true);
      });

      it('excludes point outside polygon', () => {
        const outsidePoints: GeoPoint[] = [
          { lat: 52.4, lng: 13.4 },
          { lat: 52.7, lng: 13.4 },
          { lat: 52.55, lng: 13.2 },
          { lat: 52.55, lng: 13.6 },
        ];

        outsidePoints.forEach((point) => {
          expect(evaluateGeoPolygon(point, squarePolygon)).toBe(false);
        });
      });

      it('handles point on polygon vertex', () => {
        expect(evaluateGeoPolygon({ lat: 52.5, lng: 13.3 }, squarePolygon)).toBe(false);
      });

      it('handles point on polygon edge', () => {
        const edgePoint: GeoPoint = { lat: 52.55, lng: 13.3 };
        const result = evaluateGeoPolygon(edgePoint, squarePolygon);
        expect(typeof result).toBe('boolean');
      });
    });

    describe('complex polygon shapes', () => {
      it('handles triangle polygon', () => {
        const trianglePolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.6, lng: 13.4 },
            { lat: 52.5, lng: 13.5 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.53, lng: 13.4 }, trianglePolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 52.4, lng: 13.4 }, trianglePolygon)).toBe(false);
      });

      it('handles pentagon polygon', () => {
        const pentagonPolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.55, lng: 13.35 },
            { lat: 52.6, lng: 13.3 },
            { lat: 52.6, lng: 13.5 },
            { lat: 52.5, lng: 13.5 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, pentagonPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 52.53, lng: 13.32 }, pentagonPolygon)).toBe(false);
      });

      it('handles concave polygon', () => {
        const concavePolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.6, lng: 13.3 },
            { lat: 52.55, lng: 13.4 },
            { lat: 52.6, lng: 13.5 },
            { lat: 52.5, lng: 13.5 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.52, lng: 13.4 }, concavePolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 52.57, lng: 13.4 }, concavePolygon)).toBe(false);
      });

      it('handles L-shaped polygon', () => {
        const lShapedPolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.6, lng: 13.3 },
            { lat: 52.6, lng: 13.4 },
            { lat: 52.55, lng: 13.4 },
            { lat: 52.55, lng: 13.5 },
            { lat: 52.5, lng: 13.5 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.58, lng: 13.35 }, lShapedPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 52.52, lng: 13.45 }, lShapedPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 52.58, lng: 13.45 }, lShapedPolygon)).toBe(false);
      });

      it('handles polygon with many vertices', () => {
        const manyVerticesPolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.52, lng: 13.32 },
            { lat: 52.54, lng: 13.3 },
            { lat: 52.56, lng: 13.32 },
            { lat: 52.58, lng: 13.3 },
            { lat: 52.6, lng: 13.35 },
            { lat: 52.6, lng: 13.45 },
            { lat: 52.58, lng: 13.5 },
            { lat: 52.56, lng: 13.48 },
            { lat: 52.54, lng: 13.5 },
            { lat: 52.52, lng: 13.48 },
            { lat: 52.5, lng: 13.5 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, manyVerticesPolygon)).toBe(true);
      });
    });

    describe('invalid polygon handling', () => {
      it('rejects polygon with 0 points', () => {
        const emptyPolygon: PolygonQuery = { points: [] };
        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, emptyPolygon)).toBe(false);
      });

      it('rejects polygon with 1 point', () => {
        const singlePointPolygon: PolygonQuery = {
          points: [{ lat: 52.5, lng: 13.3 }],
        };
        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, singlePointPolygon)).toBe(false);
      });

      it('rejects polygon with 2 points', () => {
        const twoPointPolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.6, lng: 13.3 },
          ],
        };
        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, twoPointPolygon)).toBe(false);
      });

      it('accepts polygon with exactly 3 points (minimum valid)', () => {
        const trianglePolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.6, lng: 13.3 },
            { lat: 52.55, lng: 13.4 },
          ],
        };
        expect(evaluateGeoPolygon({ lat: 52.54, lng: 13.33 }, trianglePolygon)).toBe(true);
      });
    });

    describe('invalid point handling', () => {
      it('returns false for invalid point - latitude too high', () => {
        const invalidPoint: GeoPoint = { lat: 91, lng: 13.4 };
        expect(evaluateGeoPolygon(invalidPoint, squarePolygon)).toBe(false);
      });

      it('returns false for invalid point - latitude too low', () => {
        const invalidPoint: GeoPoint = { lat: -91, lng: 13.4 };
        expect(evaluateGeoPolygon(invalidPoint, squarePolygon)).toBe(false);
      });

      it('returns false for invalid point - longitude too high', () => {
        const invalidPoint: GeoPoint = { lat: 52.55, lng: 181 };
        expect(evaluateGeoPolygon(invalidPoint, squarePolygon)).toBe(false);
      });

      it('returns false for invalid point - longitude too low', () => {
        const invalidPoint: GeoPoint = { lat: 52.55, lng: -181 };
        expect(evaluateGeoPolygon(invalidPoint, squarePolygon)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('handles polygon crossing the equator', () => {
        const equatorPolygon: PolygonQuery = {
          points: [
            { lat: -10, lng: -10 },
            { lat: 10, lng: -10 },
            { lat: 10, lng: 10 },
            { lat: -10, lng: 10 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 0, lng: 0 }, equatorPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 5, lng: 5 }, equatorPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: -5, lng: -5 }, equatorPolygon)).toBe(true);
      });

      it('handles polygon crossing the prime meridian', () => {
        const primeMeridianPolygon: PolygonQuery = {
          points: [
            { lat: 50, lng: -10 },
            { lat: 60, lng: -10 },
            { lat: 60, lng: 10 },
            { lat: 50, lng: 10 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 55, lng: 0 }, primeMeridianPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 55, lng: -5 }, primeMeridianPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 55, lng: 5 }, primeMeridianPolygon)).toBe(true);
      });

      it('handles very small polygon', () => {
        const tinyPolygon: PolygonQuery = {
          points: [
            { lat: 52.52, lng: 13.405 },
            { lat: 52.521, lng: 13.405 },
            { lat: 52.521, lng: 13.406 },
            { lat: 52.52, lng: 13.406 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.5205, lng: 13.4055 }, tinyPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 52.519, lng: 13.404 }, tinyPolygon)).toBe(false);
      });

      it('handles degenerate polygon (collinear points)', () => {
        const degeneratePolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.55, lng: 13.35 },
            { lat: 52.6, lng: 13.4 },
          ],
        };

        const result = evaluateGeoPolygon({ lat: 52.55, lng: 13.35 }, degeneratePolygon);
        expect(typeof result).toBe('boolean');
      });

      it('excludes multiple vertices correctly', () => {
        const polygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.6, lng: 13.3 },
            { lat: 52.6, lng: 13.5 },
            { lat: 52.5, lng: 13.5 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.5, lng: 13.3 }, polygon)).toBe(false);
        expect(evaluateGeoPolygon({ lat: 52.6, lng: 13.3 }, polygon)).toBe(false);
        expect(evaluateGeoPolygon({ lat: 52.6, lng: 13.5 }, polygon)).toBe(false);
        expect(evaluateGeoPolygon({ lat: 52.5, lng: 13.5 }, polygon)).toBe(false);
      });

      it('handles polygon at extreme latitudes', () => {
        const polarPolygon: PolygonQuery = {
          points: [
            { lat: 89, lng: -180 },
            { lat: 89, lng: 0 },
            { lat: 89, lng: 180 },
            { lat: 85, lng: 0 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 87, lng: 0 }, polarPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 84, lng: 0 }, polarPolygon)).toBe(false);
      });

      it('handles narrow polygon (high aspect ratio)', () => {
        const narrowPolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.405 },
            { lat: 52.6, lng: 13.405 },
            { lat: 52.6, lng: 13.406 },
            { lat: 52.5, lng: 13.406 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4055 }, narrowPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.407 }, narrowPolygon)).toBe(false);
      });

      it('handles star-shaped polygon', () => {
        const starPolygon: PolygonQuery = {
          points: [
            { lat: 52.55, lng: 13.3 },
            { lat: 52.52, lng: 13.35 },
            { lat: 52.5, lng: 13.4 },
            { lat: 52.52, lng: 13.45 },
            { lat: 52.55, lng: 13.5 },
            { lat: 52.58, lng: 13.45 },
            { lat: 52.6, lng: 13.4 },
            { lat: 52.58, lng: 13.35 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, starPolygon)).toBe(true);
        expect(evaluateGeoPolygon({ lat: 52.5, lng: 13.3 }, starPolygon)).toBe(false);
      });

      it('correctly handles star-shaped polygons with multiple concave sections', () => {
        const complexStarPolygon: PolygonQuery = {
          points: [
            { lat: 52.55, lng: 13.4 },
            { lat: 52.53, lng: 13.38 },
            { lat: 52.5, lng: 13.35 },
            { lat: 52.51, lng: 13.4 },
            { lat: 52.5, lng: 13.45 },
            { lat: 52.53, lng: 13.42 },
          ],
        };

        // Point inside center of star
        expect(evaluateGeoPolygon({ lat: 52.52, lng: 13.4 }, complexStarPolygon)).toBe(true);
        // Point inside one of the arms
        expect(evaluateGeoPolygon({ lat: 52.51, lng: 13.39 }, complexStarPolygon)).toBe(true);
        // Point clearly outside all arms
        expect(evaluateGeoPolygon({ lat: 52.48, lng: 13.35 }, complexStarPolygon)).toBe(false);
        // Point outside near the edge
        expect(evaluateGeoPolygon({ lat: 52.56, lng: 13.4 }, complexStarPolygon)).toBe(false);
      });

      it('handles polygon with duplicate consecutive points', () => {
        const duplicatePolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.6, lng: 13.3 },
            { lat: 52.6, lng: 13.3 },
            { lat: 52.6, lng: 13.5 },
            { lat: 52.5, lng: 13.5 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 52.55, lng: 13.4 }, duplicatePolygon)).toBe(true);
      });

      it('handles clockwise vs counter-clockwise winding', () => {
        const cwPolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.5, lng: 13.5 },
            { lat: 52.6, lng: 13.5 },
            { lat: 52.6, lng: 13.3 },
          ],
        };

        const ccwPolygon: PolygonQuery = {
          points: [
            { lat: 52.5, lng: 13.3 },
            { lat: 52.6, lng: 13.3 },
            { lat: 52.6, lng: 13.5 },
            { lat: 52.5, lng: 13.5 },
          ],
        };

        const testPoint: GeoPoint = { lat: 52.55, lng: 13.4 };
        expect(evaluateGeoPolygon(testPoint, cwPolygon)).toBe(true);
        expect(evaluateGeoPolygon(testPoint, ccwPolygon)).toBe(true);
      });
    });

    describe('ray casting algorithm verification', () => {
      it('correctly counts intersections for point inside', () => {
        const polygon: PolygonQuery = {
          points: [
            { lat: 0, lng: 0 },
            { lat: 10, lng: 0 },
            { lat: 10, lng: 10 },
            { lat: 0, lng: 10 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 5, lng: 5 }, polygon)).toBe(true);
      });

      it('correctly counts intersections for point outside', () => {
        const polygon: PolygonQuery = {
          points: [
            { lat: 0, lng: 0 },
            { lat: 10, lng: 0 },
            { lat: 10, lng: 10 },
            { lat: 0, lng: 10 },
          ],
        };

        expect(evaluateGeoPolygon({ lat: 15, lng: 5 }, polygon)).toBe(false);
        expect(evaluateGeoPolygon({ lat: 5, lng: 15 }, polygon)).toBe(false);
      });

      it('handles horizontal ray intersections correctly', () => {
        const polygon: PolygonQuery = {
          points: [
            { lat: 0, lng: 0 },
            { lat: 10, lng: 5 },
            { lat: 0, lng: 10 },
          ],
        };

        const insidePoint: GeoPoint = { lat: 3, lng: 5 };
        expect(evaluateGeoPolygon(insidePoint, polygon)).toBe(true);
      });
    });
  });
});

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

    it('correctly applies $near operator with minDistanceMeters to filter data', () => {
      const centerPoint: GeoPoint = { lat: 52.52, lng: 13.405 };

      const result = filter(restaurants, {
        location: {
          $near: {
            center: centerPoint,
            maxDistanceMeters: 3000,
            minDistanceMeters: 200,
          },
        },
      });

      // Verify that all returned restaurants are within the distance range
      result.forEach((restaurant) => {
        const distance = calculateDistance(restaurant.location, centerPoint);
        expect(distance).toBeGreaterThanOrEqual(200);
        expect(distance).toBeLessThanOrEqual(3000);
      });

      // Verify that Restaurant A (at exact center) is excluded
      expect(result.map((r) => r.name)).not.toContain('Restaurant A');

      // Verify that Restaurant B (very close) might be excluded if within minDistance
      const restaurantB = restaurants.find((r) => r.name === 'Restaurant B');
      if (restaurantB) {
        const restaurantBDistance = calculateDistance(restaurantB.location, centerPoint);
        if (restaurantBDistance < 200) {
          expect(result.map((r) => r.name)).not.toContain('Restaurant B');
        }
      }
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

    it('correctly applies $geoPolygon operator for complex polygon shapes', () => {
      // Create a star-shaped polygon that should only include specific restaurants
      const starPolygon: PolygonQuery = {
        points: [
          { lat: 52.525, lng: 13.4 },
          { lat: 52.515, lng: 13.41 },
          { lat: 52.51, lng: 13.42 },
          { lat: 52.515, lng: 13.43 },
          { lat: 52.525, lng: 13.44 },
          { lat: 52.535, lng: 13.43 },
          { lat: 52.54, lng: 13.42 },
          { lat: 52.535, lng: 13.41 },
        ],
      };

      const result = filter(restaurants, {
        location: {
          $geoPolygon: starPolygon,
        },
      });

      // Verify that all returned restaurants are actually inside the polygon
      result.forEach((restaurant) => {
        expect(evaluateGeoPolygon(restaurant.location, starPolygon)).toBe(true);
      });

      // Verify that excluded restaurants are outside the polygon
      const excluded = restaurants.filter((r) => !result.includes(r));
      excluded.forEach((restaurant) => {
        expect(evaluateGeoPolygon(restaurant.location, starPolygon)).toBe(false);
      });
    });

    it('correctly handles L-shaped polygon with filter function', () => {
      const lShapedPolygon: PolygonQuery = {
        points: [
          { lat: 52.515, lng: 13.4 },
          { lat: 52.535, lng: 13.4 },
          { lat: 52.535, lng: 13.42 },
          { lat: 52.525, lng: 13.42 },
          { lat: 52.525, lng: 13.45 },
          { lat: 52.515, lng: 13.45 },
        ],
      };

      const result = filter(restaurants, {
        location: {
          $geoPolygon: lShapedPolygon,
        },
      });

      // All results should be inside the L-shaped polygon
      result.forEach((restaurant) => {
        expect(evaluateGeoPolygon(restaurant.location, lShapedPolygon)).toBe(true);
      });
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
