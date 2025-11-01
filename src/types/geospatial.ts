export interface GeoPoint {
  readonly lat: number;
  readonly lng: number;
}

export interface NearQuery {
  center: GeoPoint;
  maxDistanceMeters: number;
  minDistanceMeters?: number;
}

export interface BoundingBox {
  southwest: GeoPoint;
  northeast: GeoPoint;
}

export interface PolygonQuery {
  points: GeoPoint[];
}

export interface GeospatialOperators {
  $near?: NearQuery;
  $geoBox?: BoundingBox;
  $geoPolygon?: PolygonQuery;
}
