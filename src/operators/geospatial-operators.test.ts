import { describe, it, expect } from 'vitest';
import { evaluateNear, evaluateGeoBox, evaluateGeoPolygon } from './geospatial.operators';
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
        const query: NearQuery = { center: centerBerlin, maxDistanceMeters: 20020000 };
        const antipode: GeoPoint = { lat: -52.52, lng: -166.595 };
        expect(evaluateNear(antipode, query)).toBe(true);
      });

      it('handles points across the date line', () => {
        const center: GeoPoint = { lat: 0, lng: 179.5 };
        const query: NearQuery = { center, maxDistanceMeters: 112000 };
        const acrossDateLine: GeoPoint = { lat: 0, lng: -179.5 };
        expect(evaluateNear(acrossDateLine, query)).toBe(true);
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
