# Geospatial Examples Update

## Summary

Added 5 comprehensive geospatial operator examples to the Interactive Playground, showcasing all three geospatial operators with real-world use cases.

## New Examples

### 1. **Geospatial - $near (Proximity)** 
`geospatial-near`

Find restaurants within a specific radius from user location.

**Use Case**: Restaurant discovery, nearby points of interest
**Operator**: `$near`
**Features**:
- Proximity search (2km radius)
- User location-based filtering
- Real Berlin coordinates

```typescript
filter(restaurants, {
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 2000
    }
  }
});
```

### 2. **Geospatial - $geoBox (Bounding Box)**
`geospatial-geobox`

Find stores within a rectangular geographic area.

**Use Case**: Area-based search, city zone filtering, regional analysis
**Operator**: `$geoBox`
**Features**:
- Rectangular boundary filtering
- Southwest/Northeast coordinates
- Multiple store types

```typescript
filter(stores, {
  location: {
    $geoBox: {
      southwest: { lat: 52.51, lng: 13.40 },
      northeast: { lat: 52.53, lng: 13.42 }
    }
  }
});
```

### 3. **Geospatial - $geoPolygon (Custom Area)**
`geospatial-geopolygon`

Find properties within a custom polygon boundary.

**Use Case**: Neighborhood search, custom zones, irregular areas
**Operator**: `$geoPolygon`
**Features**:
- Custom polygon boundaries
- Multiple coordinate points
- Real London coordinates
- Real estate filtering

```typescript
filter(properties, {
  location: {
    $geoPolygon: {
      points: [
        { lat: 51.506, lng: -0.130 },
        { lat: 51.512, lng: -0.120 },
        { lat: 51.508, lng: -0.125 },
        { lat: 51.504, lng: -0.127 }
      ]
    }
  }
});
```

### 4. **Geospatial - Combined with Filters**
`geospatial-combined`

Find nearby, highly-rated, affordable restaurants combining geospatial and standard filters.

**Use Case**: Advanced filtering with location, ratings, price
**Operators**: `$near`, `$gte`, `$lte`
**Features**:
- Multi-criteria filtering
- Location + quality + price
- Real-world restaurant search

```typescript
filter(restaurants, {
  location: {
    $near: {
      center: { lat: 52.52, lng: 13.405 },
      maxDistanceMeters: 3000
    }
  },
  rating: { $gte: 4.5 },
  priceLevel: { $lte: 3 }
});
```

### 5. **Geospatial - Delivery Zone**
`geospatial-delivery`

Find customers within delivery radius from store.

**Use Case**: Delivery services, service area validation
**Operator**: `$near`
**Features**:
- 5km delivery radius
- Customer address filtering
- Real NYC coordinates

```typescript
filter(customers, {
  address: {
    $near: {
      center: { lat: 40.7580, lng: -73.9855 },
      maxDistanceMeters: 5000
    }
  }
});
```

### 6. **Geospatial - Zone-Based Pricing**
`geospatial-zone-pricing`

Find service areas within premium zones with low surcharges.

**Use Case**: Dynamic pricing zones, service coverage areas
**Operators**: `$geoBox`, `$lte`
**Features**:
- Bounding box zones
- Price-based filtering
- Service area management

```typescript
filter(serviceAreas, {
  location: {
    $geoBox: {
      southwest: { lat: 52.518, lng: 13.400 },
      northeast: { lat: 52.528, lng: 13.415 }
    }
  },
  surcharge: { $lte: 5 }
});
```

## New Datasets

Added 4 new datasets to support geospatial examples:

### 1. **Stores** (`stores`)
- Downtown Store, East Store, West Store, Central Store, North Store
- Fields: `name`, `location`, `type`, `inventory`
- Berlin coordinates
- Multiple store types

### 2. **Properties** (`properties`)
- Real estate properties in London
- Fields: `address`, `location`, `price`, `bedrooms`, `sqft`
- London coordinates
- Price range: £450k - £900k

### 3. **Customers** (`customers`)
- Customer delivery addresses
- Fields: `name`, `address`, `orderValue`, `premium`
- NYC coordinates
- Premium customer flag

### 4. **Service Areas** (`serviceAreas`)
- Delivery/service zones with pricing
- Fields: `zone`, `location`, `basePrice`, `surcharge`, `coverage`
- Zone-based pricing model
- Coverage types: Full/Limited

## Updated Existing Dataset

**Restaurants** (`restaurants`)
- Added more detailed fields
- Enhanced with cuisine types
- Price level indicators
- Updated sample filters

## Features Demonstrated

✅ **All 3 geospatial operators**:
- `$near` - Proximity/radius search
- `$geoBox` - Rectangular boundary
- `$geoPolygon` - Custom polygon area

✅ **Real-world use cases**:
- Restaurant discovery
- Real estate search
- Delivery zones
- Service areas
- Store locators
- Zone-based pricing

✅ **Combined filtering**:
- Geospatial + rating
- Geospatial + price
- Geospatial + inventory
- Multiple criteria

✅ **Multiple cities**:
- Berlin (restaurants, stores, service areas)
- London (properties)
- New York (customers)

✅ **Realistic data**:
- Actual city coordinates
- Realistic distances (2km, 3km, 5km)
- Real pricing ranges
- Business-relevant filters

## Integration

All examples are:
- ✅ TypeScript compiled
- ✅ Available in playground dropdown
- ✅ Linked to appropriate datasets
- ✅ Ready for interactive testing
- ✅ Include sample filter expressions

## Testing

```bash
# Build docs
pnpm docs:build
# ✓ Build successful

# Type check
pnpm typecheck
# ✓ No errors

# Test playground
pnpm docs:dev
# Navigate to /playground/
# Select geospatial examples from dropdown
```

## User Benefits

1. **Learn by Example**: See geospatial operators in action
2. **Real-World Scenarios**: Understand practical applications
3. **Interactive Testing**: Modify and experiment with filters
4. **Best Practices**: See proper operator usage
5. **Multiple Approaches**: Compare different geospatial operators

## Files Modified

- `docs/.vitepress/theme/data/examples.ts` - Added 5 new geospatial examples (replaced generic one)
- `docs/.vitepress/theme/data/datasets.ts` - Added 4 new datasets, updated sample filters

## Total Playground Content

- **Examples**: 16 total (6 geospatial-focused)
- **Datasets**: 13 total (5 geospatial-ready)
- **Geospatial Coverage**: 37.5% of all examples
