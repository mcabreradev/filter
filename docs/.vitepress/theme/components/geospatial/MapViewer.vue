<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import type { GeoPoint } from '../../../../../src/types';
import type { GeospatialOperator } from './types';

interface Props {
  data: any[];
  filtered: any[];
  operator: GeospatialOperator;
  center: GeoPoint;
  radius: number;
  minRadius: number;
  boundingBox: { southwest: GeoPoint; northeast: GeoPoint };
  polygon: { points: GeoPoint[] };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  click: [point: GeoPoint];
  boundsChange: [bounds: { southwest: GeoPoint; northeast: GeoPoint }];
  polygonChange: [points: GeoPoint[]];
}>();

// Leaflet instance
let map: any = null;
let L: any = null;
const mapContainer = ref<HTMLElement>();
const zoom = ref(13);

// Layer groups
let markersLayer: any = null;
let shapesLayer: any = null;

// Initialize map
onMounted(async () => {
  if (typeof window === 'undefined') return;
  
  try {
    L = (await import('leaflet')).default;

    // Fix Leaflet default icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
    
    map = L.map(mapContainer.value).setView(
      [props.center.lat, props.center.lng],
      zoom.value
    );
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);
    
    // Map click handler
    map.on('click', (e: any) => {
      emit('click', { lat: e.latlng.lat, lng: e.latlng.lng });
    });
    
    // Store zoom level when it changes
    map.on('zoomend', () => {
      zoom.value = map.getZoom();
    });
    
    updateMap();
  } catch (error) {
    console.error('Failed to initialize map:', error);
  }
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

// Update map when props change
watch([() => props.data, () => props.filtered, () => props.operator, 
       () => props.center, () => props.radius, () => props.minRadius,
       () => props.boundingBox, () => props.polygon], updateMap);

function updateMap() {
  if (!map || !L) return;
  
  // Clear existing layers
  if (markersLayer) markersLayer.clearLayers();
  if (shapesLayer) shapesLayer.clearLayers();
  
  if (!markersLayer) markersLayer = L.layerGroup().addTo(map);
  if (!shapesLayer) shapesLayer = L.layerGroup().addTo(map);
  
  // Add all data markers (gray)
  const filteredIds = new Set(props.filtered.map((item: any) => item.id || item.name));
  
  props.data.forEach((item: any) => {
    const isFiltered = filteredIds.has(item.id || item.name);
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pin ${isFiltered ? 'filtered' : 'unfiltered'}">
        <div class="marker-dot"></div>
      </div>`,
      iconSize: [30, 40],
      iconAnchor: [15, 40]
    });
    
    const marker = L.marker([item.location.lat, item.location.lng], { icon })
      .bindPopup(createPopupContent(item, isFiltered));
    
    markersLayer.addLayer(marker);
  });
  
  // Add operator-specific shapes
  switch (props.operator) {
    case '$near':
      addNearVisualization();
      break;
    case '$geoBox':
      addGeoBoxVisualization();
      break;
    case '$geoPolygon':
      addGeoPolygonVisualization();
      break;
  }
  
  // Center map
  map.setView([props.center.lat, props.center.lng], zoom.value);
}

function addNearVisualization() {
  if (!L || !shapesLayer) return;
  
  // Center marker
  const centerIcon = L.divIcon({
    className: 'center-marker',
    html: '<div class="center-pin">📍</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
  
  L.marker([props.center.lat, props.center.lng], { icon: centerIcon })
    .bindPopup('Center Point')
    .addTo(shapesLayer);
  
  // Radius circle
  L.circle([props.center.lat, props.center.lng], {
    radius: props.radius,
    color: '#3388ff',
    fillColor: '#3388ff',
    fillOpacity: 0.1,
    weight: 2
  }).addTo(shapesLayer);
  
  // Min radius circle (if set)
  if (props.minRadius > 0) {
    L.circle([props.center.lat, props.center.lng], {
      radius: props.minRadius,
      color: '#ff3838',
      fillColor: '#ff3838',
      fillOpacity: 0.05,
      weight: 2,
      dashArray: '5, 5'
    }).addTo(shapesLayer);
  }
}

function addGeoBoxVisualization() {
  if (!L || !shapesLayer) return;
  
  const bounds = L.latLngBounds(
    [props.boundingBox.southwest.lat, props.boundingBox.southwest.lng],
    [props.boundingBox.northeast.lat, props.boundingBox.northeast.lng]
  );
  
  L.rectangle(bounds, {
    color: '#ff7800',
    fillColor: '#ff7800',
    fillOpacity: 0.1,
    weight: 2
  }).addTo(shapesLayer);
}

function addGeoPolygonVisualization() {
  if (!L || !shapesLayer) return;
  
  const points = props.polygon.points.map(p => [p.lat, p.lng]);
  
  L.polygon(points, {
    color: '#9c27b0',
    fillColor: '#9c27b0',
    fillOpacity: 0.1,
    weight: 2
  }).addTo(shapesLayer);
  
  // Add editable vertices
  props.polygon.points.forEach((point, index) => {
    const vertexIcon = L.divIcon({
      className: 'vertex-marker',
      html: '<div class="vertex-dot"></div>',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
    
    const marker = L.marker([point.lat, point.lng], { 
      icon: vertexIcon,
      draggable: true
    });
    
    marker.on('dragend', (e: any) => {
      const newPoints = [...props.polygon.points];
      newPoints[index] = { lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng };
      emit('polygonChange', newPoints);
    });
    
    marker.addTo(shapesLayer);
  });
}

function createPopupContent(item: any, isFiltered: boolean): string {
  const status = isFiltered 
    ? '<span style="color: #22c55e">✓ Matched</span>' 
    : '<span style="color: #ef4444">✗ Not Matched</span>';
  
  return `
    <div class="marker-popup">
      <strong>${item.name}</strong><br>
      ${status}<br>
      ${item.rating ? `Rating: ${item.rating}⭐<br>` : ''}
      ${item.price ? `Price: $${item.price}<br>` : ''}
      ${item.priceLevel ? `Price: ${'$'.repeat(item.priceLevel)}<br>` : ''}
    </div>
  `;
}
</script>

<template>
  <ClientOnly>
    <div class="map-viewer">
      <div ref="mapContainer" class="map-container"></div>
      <div class="map-legend">
        <div class="legend-item">
          <span class="legend-marker filtered"></span>
          <span class="legend-label">Matched ({{ filtered.length }})</span>
        </div>
        <div class="legend-item">
          <span class="legend-marker unfiltered"></span>
          <span class="legend-label">Not Matched ({{ data.length - filtered.length }})</span>
        </div>
      </div>
    </div>  
  </ClientOnly>
</template>

<style>
@import 'leaflet/dist/leaflet.css';
</style>

<style scoped>
.map-viewer {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.map-container {
  height: 500px;
  width: 100%;
}

.map-legend {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-marker.filtered {
  background: #22c55e;
}

.legend-marker.unfiltered {
  background: #94a3b8;
}

.legend-label {
  font-size: 12px;
  color: #374151;
}
</style>

<style>
/* Custom Markers - Global styles */
.marker-pin {
  width: 24px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  position: relative;
}

.marker-pin.filtered {
  background: #22c55e;
}

.marker-pin.unfiltered {
  background: #94a3b8;
  opacity: 0.5;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.center-pin {
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.vertex-dot {
  width: 12px;
  height: 12px;
  background: #9c27b0;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  cursor: move;
}

.marker-popup {
  font-size: 14px;
  line-height: 1.6;
}
</style>
