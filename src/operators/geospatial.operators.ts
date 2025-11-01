import type { GeoPoint, NearQuery, BoundingBox, PolygonQuery } from '../types/geospatial';
import { calculateDistance, isValidGeoPoint } from '../utils/geo-distance';

/**
 * Evaluates if a point is within a specified distance range from a center point.
 * Uses the Haversine formula for accurate great-circle distance calculation.
 *
 * @param point - The point to evaluate
 * @param query - The near query containing center point and distance constraints
 * @returns true if the point is within the distance range, false otherwise
 */
export function evaluateNear(point: GeoPoint, query: NearQuery): boolean {
  if (!isValidGeoPoint(point) || !isValidGeoPoint(query.center)) {
    return false;
  }

  const distance = calculateDistance(point, query.center);

  // Check minimum distance - explicitly handle 0 as a valid value
  if (query.minDistanceMeters !== undefined && distance < query.minDistanceMeters) {
    return false;
  }

  return distance <= query.maxDistanceMeters;
}

/**
 * Evaluates if a point is within a bounding box.
 * Handles boxes crossing the International Date Line.
 *
 * @param point - The point to evaluate
 * @param box - The bounding box with southwest and northeast corners
 * @returns true if the point is inside the box, false otherwise
 */
export function evaluateGeoBox(point: GeoPoint, box: BoundingBox): boolean {
  if (!isValidGeoPoint(point)) return false;

  // Check latitude (always straightforward)
  const latInRange = point.lat >= box.southwest.lat && point.lat <= box.northeast.lat;
  if (!latInRange) return false;

  // Check longitude - handle date line crossing
  // If southwest.lng > northeast.lng, the box crosses the date line
  const crossesDateLine = box.southwest.lng > box.northeast.lng;

  const lngInRange = crossesDateLine
    ? // Box crosses date line: point must be >= southwest OR <= northeast
      point.lng >= box.southwest.lng || point.lng <= box.northeast.lng
    : // Normal box: point must be between southwest and northeast
      point.lng >= box.southwest.lng && point.lng <= box.northeast.lng;

  return lngInRange;
}

/**
 * Evaluates if a point is inside a polygon using the ray-casting algorithm.
 *
 * Note: This implementation uses a simplified 2D ray-casting algorithm and may
 * not correctly handle polygons that cross the International Date Line. For such
 * cases, consider normalizing the polygon or using spherical geometry libraries.
 *
 * @param point - The point to evaluate
 * @param query - The polygon query containing the vertices
 * @returns true if the point is inside the polygon, false otherwise
 */
export function evaluateGeoPolygon(point: GeoPoint, query: PolygonQuery): boolean {
  if (!isValidGeoPoint(point) || query.points.length < 3) {
    return false;
  }

  const vertices = query.points;

  // Check if point is exactly on a vertex
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
