---
title: Geospatial Operators
description: Location-based filtering with powerful spatial operators
aside: false
---

# Geospatial Operators

> Location-based filtering with powerful spatial operators for proximity search, bounding boxes, and polygon containment.

## Interactive Playground 🎮

Try geospatial operators live with real Buenos Aires data! Click the map, adjust controls, and see real-time filtering.

<GeospatialPlayground />

---

## Overview

Geospatial operators allow you to filter data based on geographic coordinates. Perfect for:

- Restaurant and store locators
- Real estate property searches
- Delivery zone validation
- IoT device monitoring
- Location-based services

## Available Operators

- `$near` - Find points within radius
- `$geoBox` - Find points within bounding box
- `$geoPolygon` - Find points within polygon

## GeoPoint Type

All geospatial operators use the `GeoPoint` interface:

```typescript
interface GeoPoint {
  lat: number;  // Latitude: -90 to 90
  lng: number;  // Longitude: -180 to 180
}
```

## `$near` - Proximity Search

Find points within a specified radius of a center point.

### Basic Usage

```typescript
import { filter, type GeoPoint } from '@mcabreradev/filter';

interface Restaurant {
  name: string;
  location: GeoPoint;
  rating: number;
}

const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 2000
    }
  }
});
```

### With Minimum Distance

Exclude points that are too close:

```typescript
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000,
      minDistanceMeters: 1000
    }
  }
});
```

### Distance Calculation

Uses the **spherical law of cosines** for fast, accurate distance calculation:

- Suitable for most use cases
- Earth radius: 6,371,000 meters
- Returns distance in meters
- Handles edge cases (poles, date line)

## `$geoBox` - Bounding Box

Find points within a rectangular area.

### Basic Usage

```typescript
filter(stores, {
  location: {
    $geoBox: {
      southwest: { lat: 52.5, lng: 13.3 },
      northeast: { lat: 52.6, lng: 13.5 }
    }
  }
});
```

### Use Cases

**Delivery zone:**

```typescript
const deliveryZone = {
  southwest: { lat: 40.7, lng: -74.02 },
  northeast: { lat: 40.8, lng: -73.9 }
};

filter(orders, {
  deliveryAddress: {
    $geoBox: deliveryZone
  },
  status: 'pending'
});
```

**Map viewport:**

```typescript
const getVisibleMarkers = (bounds: BoundingBox) => {
  return filter(markers, {
    location: { $geoBox: bounds }
  });
};
```

## `$geoPolygon` - Polygon Containment

Find points inside a custom polygon area.

### Basic Usage

```typescript
const neighborhoodBoundary = {
  points: [
    { lat: 52.51, lng: 13.4 },
    { lat: 52.54, lng: 13.4 },
    { lat: 52.54, lng: 13.43 },
    { lat: 52.51, lng: 13.43 }
  ]
};

filter(properties, {
  location: {
    $geoPolygon: neighborhoodBoundary
  }
});
```

### Complex Polygons

Supports any polygon shape:

```typescript
const schoolDistrict = {
  points: [
    { lat: 52.5, lng: 13.3 },
    { lat: 52.55, lng: 13.35 },
    { lat: 52.6, lng: 13.3 },
    { lat: 52.6, lng: 13.5 },
    { lat: 52.5, lng: 13.5 }
  ]
};

filter(schools, {
  location: {
    $geoPolygon: schoolDistrict
  }
});
```

### Requirements

- Minimum 3 points required
- Points define the polygon boundary
- Uses ray casting algorithm
- Automatically closes polygon

## Combining with Other Operators

### With Comparison Operators

```typescript
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 3000
    }
  },
  rating: { $gte: 4.5 },
  priceLevel: { $lte: 2 }
});
```

### With Logical Operators

```typescript
filter(restaurants, {
  $and: [
    {
      location: {
        $near: {
          center: userLocation,
          maxDistanceMeters: 5000
        }
      }
    },
    {
      $or: [
        { cuisine: 'Italian' },
        { cuisine: 'Japanese' }
      ]
    },
    {
      isOpen: true,
      rating: { $gte: 4.0 }
    }
  ]
});
```

### With String Operators

```typescript
filter(restaurants, {
  location: {
    $geoBox: deliveryZone
  },
  name: { $contains: 'pizza' },
  tags: { $contains: 'delivery' }
});
```

## Utility Functions

### Calculate Distance

```typescript
import { calculateDistance } from '@mcabreradev/filter';

const berlin: GeoPoint = { lat: 52.52, lng: 13.405 };
const paris: GeoPoint = { lat: 48.8566, lng: 2.3522 };

const distance = calculateDistance(berlin, paris);
console.log(`${(distance / 1000).toFixed(0)} km`);
```

### Validate Coordinates

```typescript
import { isValidGeoPoint } from '@mcabreradev/filter';

isValidGeoPoint({ lat: 52.52, lng: 13.405 });
isValidGeoPoint({ lat: 91, lng: 0 });
isValidGeoPoint({ lat: 0, lng: 181 });
```

### Evaluate Operators Directly

```typescript
import { evaluateNear, evaluateGeoBox, evaluateGeoPolygon } from '@mcabreradev/filter';

const point: GeoPoint = { lat: 52.52, lng: 13.405 };

evaluateNear(point, {
  center: { lat: 52.52, lng: 13.4 },
  maxDistanceMeters: 1000
});

evaluateGeoBox(point, {
  southwest: { lat: 52.5, lng: 13.3 },
  northeast: { lat: 52.6, lng: 13.5 }
});

evaluateGeoPolygon(point, {
  points: [
    { lat: 52.5, lng: 13.4 },
    { lat: 52.6, lng: 13.4 },
    { lat: 52.6, lng: 13.5 }
  ]
});
```

## Real-World Examples

### Restaurant Finder

```typescript
interface Restaurant {
  name: string;
  location: GeoPoint;
  cuisine: string;
  rating: number;
  priceLevel: number;
  isOpen: boolean;
}

const findRestaurants = (
  userLoc: GeoPoint,
  options: {
    maxDistance?: number;
    cuisine?: string;
    minRating?: number;
    maxPrice?: number;
  } = {}
) => {
  const {
    maxDistance = 5000,
    cuisine,
    minRating = 4.0,
    maxPrice = 4
  } = options;

  return filter(restaurants, {
    location: {
      $near: {
        center: userLoc,
        maxDistanceMeters: maxDistance
      }
    },
    ...(cuisine && { cuisine }),
    rating: { $gte: minRating },
    priceLevel: { $lte: maxPrice },
    isOpen: true
  });
};

const nearbyItalian = findRestaurants(
  { lat: 52.52, lng: 13.405 },
  { cuisine: 'Italian', maxDistance: 3000 }
);
```

### Delivery Zone Validator

```typescript
const deliveryZones = [
  {
    name: 'Downtown',
    boundary: {
      southwest: { lat: 40.7, lng: -74.02 },
      northeast: { lat: 40.75, lng: -73.95 }
    }
  },
  {
    name: 'Midtown',
    boundary: {
      southwest: { lat: 40.75, lng: -74.0 },
      northeast: { lat: 40.8, lng: -73.92 }
    }
  }
];

const isDeliveryAvailable = (address: GeoPoint): boolean => {
  return deliveryZones.some(zone => {
    const result = filter([{ location: address }], {
      location: { $geoBox: zone.boundary }
    });
    return result.length > 0;
  });
};
```

### Property Search

```typescript
interface Property {
  address: string;
  location: GeoPoint;
  price: number;
  bedrooms: number;
  sqft: number;
  features: string[];
}

const searchProperties = (
  criteria: {
    neighborhood?: GeoPoint[];
    maxPrice?: number;
    minBedrooms?: number;
    requiredFeatures?: string[];
  }
) => {
  const {
    neighborhood,
    maxPrice = 1000000,
    minBedrooms = 1,
    requiredFeatures = []
  } = criteria;

  return filter(properties, {
    ...(neighborhood && {
      location: {
        $geoPolygon: { points: neighborhood }
      }
    }),
    price: { $lte: maxPrice },
    bedrooms: { $gte: minBedrooms },
    ...(requiredFeatures.length > 0 && {
      features: {
        $in: requiredFeatures
      }
    })
  });
};
```

### IoT Device Monitoring

```typescript
interface Device {
  id: string;
  location: GeoPoint;
  status: 'online' | 'offline' | 'maintenance';
  batteryLevel: number;
  lastSeen: Date;
}

const getDevicesInArea = (
  center: GeoPoint,
  radiusMeters: number,
  options?: {
    status?: string;
    minBattery?: number;
  }
) => {
  return filter(devices, {
    location: {
      $near: {
        center,
        maxDistanceMeters: radiusMeters
      }
    },
    ...(options?.status && { status: options.status }),
    ...(options?.minBattery && {
      batteryLevel: { $gte: options.minBattery }
    })
  });
};

const criticalDevices = getDevicesInArea(
  { lat: 52.52, lng: 13.405 },
  10000,
  { status: 'online', minBattery: 20 }
);
```

## Performance Optimization

### Use Lazy Evaluation

For large datasets, use lazy evaluation:

```typescript
import { filterLazy, filterFirst } from '@mcabreradev/filter';

const nearbyLazy = filterLazy(millionRestaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000
    }
  }
});

for (const restaurant of nearbyLazy) {
  if (found === 10) break;
}

const first20 = filterFirst(millionRestaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 3000
    }
  }
}, 20);
```

### Choose the Right Operator

- **Bounding box** is fastest for rectangular areas
- **Proximity** is best for "nearby" searches
- **Polygon** is most flexible but slightly slower

### Enable Caching

For repeated queries:

```typescript
filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000
    }
  }
}, { enableCache: true });
```

## Edge Cases

### Invalid Coordinates

Invalid coordinates are automatically excluded:

```typescript
const points = [
  { location: { lat: 52.52, lng: 13.405 } },
  { location: { lat: 91, lng: 0 } },
  { location: { lat: 0, lng: 181 } }
];

filter(points, {
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 1000
    }
  }
});
```

### Missing Location Data

Items without location are excluded:

```typescript
const items = [
  { name: 'A', location: { lat: 52.52, lng: 13.405 } },
  { name: 'B' },
  { name: 'C', location: { lat: 52.521, lng: 13.406 } }
];

filter(items, {
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 1000
    }
  }
});
```

### Polygon Requirements

Polygons must have at least 3 points:

```typescript
evaluateGeoPolygon(point, {
  points: [
    { lat: 52.5, lng: 13.4 }
  ]
});

evaluateGeoPolygon(point, {
  points: [
    { lat: 52.5, lng: 13.4 },
    { lat: 52.6, lng: 13.4 },
    { lat: 52.6, lng: 13.5 }
  ]
});
```

## TypeScript Support

Full type safety with intelligent autocomplete:

```typescript
import type {
  GeoPoint,
  NearQuery,
  BoundingBox,
  PolygonQuery,
  GeospatialOperators
} from '@mcabreradev/filter';

const nearQuery: NearQuery = {
  center: { lat: 52.52, lng: 13.405 },
  maxDistanceMeters: 5000,
  minDistanceMeters: 500
};

const box: BoundingBox = {
  southwest: { lat: 52.5, lng: 13.3 },
  northeast: { lat: 52.6, lng: 13.5 }
};

const polygon: PolygonQuery = {
  points: [
    { lat: 52.5, lng: 13.4 },
    { lat: 52.6, lng: 13.4 },
    { lat: 52.6, lng: 13.5 }
  ]
};
```

## Distance Calculation Details

The library uses the **spherical law of cosines** for distance calculation:

```typescript
distance = R × arccos(sin(φ1) × sin(φ2) + cos(φ1) × cos(φ2) × cos(Δλ))
```

Where:
- `R` = Earth radius (6,371,000 meters)
- `φ1, φ2` = latitudes in radians
- `Δλ` = longitude difference in radians

This formula provides:
- Fast computation
- Accuracy suitable for most applications
- Handles edge cases correctly

## Coordinate System

All coordinates use the **WGS84** standard:
- Latitude range: -90° (South Pole) to 90° (North Pole)
- Longitude range: -180° to 180°
- Positive latitude = North
- Positive longitude = East

## Further Reading

- [Main Operators Guide](./operators.md)
- [Logical Operators](./logical-operators.md)
- [Lazy Evaluation](./lazy-evaluation.md)
- [Performance Benchmarks](../advanced/performance-benchmarks.md)
- [TypeScript Guide](../advanced/type-system.md)
- [API Reference](../api/reference.md)
