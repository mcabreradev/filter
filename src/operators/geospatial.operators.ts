import type { GeoPoint, NearQuery, BoundingBox, PolygonQuery } from '../types/geospatial';
import { calculateDistance, isValidGeoPoint } from '../utils/geo-distance';

export function evaluateNear(point: GeoPoint, query: NearQuery): boolean {
  if (!isValidGeoPoint(point) || !isValidGeoPoint(query.center)) {
    return false;
  }

  const distance = calculateDistance(point, query.center);

  if (query.minDistanceMeters !== undefined && distance < query.minDistanceMeters) {
    return false;
  }

  return distance <= query.maxDistanceMeters;
}

export function evaluateGeoBox(point: GeoPoint, box: BoundingBox): boolean {
  if (!isValidGeoPoint(point)) return false;

  const latInRange = point.lat >= box.southwest.lat && point.lat <= box.northeast.lat;
  if (!latInRange) return false;

  const crossesDateLine = box.southwest.lng > box.northeast.lng;

  const lngInRange = crossesDateLine
    ? point.lng >= box.southwest.lng || point.lng <= box.northeast.lng
    : point.lng >= box.southwest.lng && point.lng <= box.northeast.lng;

  return lngInRange;
}

export function evaluateGeoPolygon(point: GeoPoint, query: PolygonQuery): boolean {
  if (!isValidGeoPoint(point) || query.points.length < 3) {
    return false;
  }

  const vertices = query.points;

  for (const vertex of vertices) {
    if (point.lat === vertex.lat && point.lng === vertex.lng) {
      return false;
    }
  }

  let inside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const vi = vertices[i];
    const vj = vertices[j];

    const intersect =
      vi.lng > point.lng !== vj.lng > point.lng &&
      point.lat < ((vj.lat - vi.lat) * (point.lng - vi.lng)) / (vj.lng - vi.lng) + vi.lat;

    if (intersect) inside = !inside;
  }

  return inside;
}
