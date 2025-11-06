import type { GeoPoint } from '../../types/geospatial';

const EARTH_RADIUS_METERS = 6371000;

export function calculateDistance(p1: GeoPoint, p2: GeoPoint): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;

  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);
  const deltaLat = toRad(p2.lat - p1.lat);

  // Normalize longitude difference to handle date line crossing
  let lngDiff = p2.lng - p1.lng;
  if (lngDiff > 180) lngDiff -= 360;
  if (lngDiff < -180) lngDiff += 360;
  const deltaLng = toRad(lngDiff);

  // Haversine formula for better numerical stability
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

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
