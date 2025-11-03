import type { GeoPoint } from '@mcabreradev/filter';

export type GeospatialOperator = '$near' | '$geoBox' | '$geoPolygon';

export interface PlaygroundState {
  selectedDataset: string;
  operator: GeospatialOperator;
  centerPoint: GeoPoint;
  radius: number;
  minRadius: number;
  boundingBox: {
    southwest: GeoPoint;
    northeast: GeoPoint;
  };
  polygon: {
    points: GeoPoint[];
  };
  additionalFilters: Record<string, any>;
}

export interface DatasetConfig {
  name: string;
  description: string;
  items: any[];
  defaultCenter: GeoPoint;
  defaultRadius: number;
  defaultBoundingBox: {
    southwest: GeoPoint;
    northeast: GeoPoint;
  };
  defaultPolygon: {
    points: GeoPoint[];
  };
  displayFields: string[];
  filterableFields: FilterableField[];
}

export interface FilterableField {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'boolean';
  placeholder?: string;
  step?: number;
  options?: string[];
}
