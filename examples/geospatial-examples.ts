import { filter, type GeoPoint } from '../src';

interface Restaurant {
  name: string;
  location: GeoPoint;
  rating: number;
  cuisine: string;
  priceLevel: number;
  isOpen: boolean;
}

const restaurants: Restaurant[] = [
  {
    name: 'Berlin Bistro',
    location: { lat: 52.52, lng: 13.405 },
    rating: 4.5,
    cuisine: 'German',
    priceLevel: 2,
    isOpen: true,
  },
  {
    name: 'Pasta Paradise',
    location: { lat: 52.521, lng: 13.406 },
    rating: 4.8,
    cuisine: 'Italian',
    priceLevel: 3,
    isOpen: true,
  },
  {
    name: 'Sushi Spot',
    location: { lat: 52.53, lng: 13.42 },
    rating: 4.6,
    cuisine: 'Japanese',
    priceLevel: 4,
    isOpen: false,
  },
  {
    name: 'Burger House',
    location: { lat: 52.525, lng: 13.415 },
    rating: 3.9,
    cuisine: 'American',
    priceLevel: 1,
    isOpen: true,
  },
  {
    name: 'Taco Time',
    location: { lat: 52.55, lng: 13.45 },
    rating: 4.2,
    cuisine: 'Mexican',
    priceLevel: 2,
    isOpen: true,
  },
];

console.log('=== Geospatial Filter Examples ===\n');

const userLocation: GeoPoint = { lat: 52.52, lng: 13.405 };

console.log('1. Find restaurants within 2km radius:');
const nearbyRestaurants = filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 2000,
    },
  },
});
console.log(nearbyRestaurants.map((r) => r.name));

console.log('\n2. Find high-rated restaurants within 3km:');
const nearbyHighRated = filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 3000,
    },
  },
  rating: { $gte: 4.5 },
});
console.log(nearbyHighRated.map((r) => `${r.name} (${r.rating}⭐)`));

console.log('\n3. Find affordable nearby restaurants that are open:');
const affordableNearbyOpen = filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 2500,
    },
  },
  priceLevel: { $lte: 2 },
  isOpen: true,
});
console.log(affordableNearbyOpen.map((r) => `${r.name} (${'$'.repeat(r.priceLevel)})`));

console.log('\n4. Find restaurants within bounding box (delivery area):');
const inDeliveryZone = filter(restaurants, {
  location: {
    $geoBox: {
      southwest: { lat: 52.51, lng: 13.4 },
      northeast: { lat: 52.54, lng: 13.43 },
    },
  },
});
console.log(inDeliveryZone.map((r) => r.name));

console.log('\n5. Find restaurants in specific neighborhood (polygon):');
const inNeighborhood = filter(restaurants, {
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
  rating: { $gte: 4.0 },
});
console.log(inNeighborhood.map((r) => r.name));

console.log('\n6. Exclude very close restaurants (min distance):');
const notTooClose = filter(restaurants, {
  location: {
    $near: {
      center: userLocation,
      maxDistanceMeters: 5000,
      minDistanceMeters: 1000,
    },
  },
});
console.log(notTooClose.map((r) => r.name));

console.log('\n7. Complex query - Italian or Japanese, nearby, highly rated:');
const complexQuery = filter(restaurants, {
  $and: [
    {
      location: {
        $near: {
          center: userLocation,
          maxDistanceMeters: 3000,
        },
      },
    },
    {
      $or: [{ cuisine: 'Italian' }, { cuisine: 'Japanese' }],
    },
    {
      rating: { $gte: 4.5 },
    },
  ],
});
console.log(complexQuery.map((r) => `${r.name} (${r.cuisine})`));
