import type { GeoPoint } from '../types/geospatial';

const EARTH_RADIUS_METERS = 6371000;

export function calculateDistance(p1: GeoPoint, p2: GeoPoint): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;

  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);
  const deltaLng = toRad(p2.lng - p1.lng);

  const centralAngle = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLng),
  );

  return EARTH_RADIUS_METERS * centralAngle;
}

export function isValidGeoPoint(point: unknown): point is GeoPoint {
  if (!point || typeof point !== 'object') return false;
  const p = point as GeoPoint;
  return (
    typeof p.lat === 'number' &&
    typeof p.lng === 'number' &&
    p.lat >= -90 &&
    p.lat <= 90 &&
    p.lng >= -180 &&
    p.lng <= 180
  );
}
