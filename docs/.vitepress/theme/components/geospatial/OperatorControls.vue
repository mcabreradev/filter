<script setup lang="ts">
import { computed } from 'vue';
import type { GeoPoint } from '../../../../../src/types';
import type { GeospatialOperator } from './types';

interface Props {
  operator: GeospatialOperator;
  center: GeoPoint;
  radius: number;
  minRadius: number;
  boundingBox: { southwest: GeoPoint; northeast: GeoPoint };
  polygon: { points: GeoPoint[] };
  additionalFilters: Record<string, any>;
  datasetConfig: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:operator': [value: GeospatialOperator];
  'update:center': [value: GeoPoint];
  'update:radius': [value: number];
  'update:minRadius': [value: number];
  'update:boundingBox': [value: { southwest: GeoPoint; northeast: GeoPoint }];
  'update:polygon': [value: { points: GeoPoint[] }];
  'update:additionalFilters': [value: Record<string, any>];
  'operatorChange': [value: GeospatialOperator];
}>();

// Operator options
const operators: { value: GeospatialOperator; label: string; icon: string }[] = [
  { value: '$near', label: 'Proximity ($near)', icon: '📍' },
  { value: '$geoBox', label: 'Bounding Box ($geoBox)', icon: '📦' },
  { value: '$geoPolygon', label: 'Polygon ($geoPolygon)', icon: '🔷' }
];

// Handle operator change
const handleOperatorChange = (op: GeospatialOperator) => {
  emit('update:operator', op);
  emit('operatorChange', op);
};

// Available additional filters based on dataset
const availableFilters = computed(() => {
  return props.datasetConfig.filterableFields || [];
});

// Add/update additional filter
const updateAdditionalFilter = (field: string, value: any) => {
  const newFilters = { ...props.additionalFilters };
  if (value === null || value === '') {
    delete newFilters[field];
  } else {
    newFilters[field] = value;
  }
  emit('update:additionalFilters', newFilters);
};

// Polygon helpers
const updatePolygonPoint = (index: number, coord: 'lat' | 'lng', value: number) => {
  const points = [...props.polygon.points];
  points[index] = { ...points[index], [coord]: value };
  emit('update:polygon', { points });
};

const addPolygonPoint = () => {
  const lastPoint = props.polygon.points[props.polygon.points.length - 1];
  const newPoint = {
    lat: lastPoint.lat + 0.01,
    lng: lastPoint.lng + 0.01
  };
  emit('update:polygon', {
    points: [...props.polygon.points, newPoint]
  });
};

const removePolygonPoint = (index: number) => {
  if (props.polygon.points.length <= 3) return;
  const points = [...props.polygon.points];
  points.splice(index, 1);
  emit('update:polygon', { points });
};
</script>

<template>
  <div class="operator-controls">
    <div class="controls-section">
      <h3>Geospatial Operator</h3>
      <div class="operator-buttons">
        <button
          v-for="op in operators"
          :key="op.value"
          :class="['operator-btn', { active: operator === op.value }]"
          @click="handleOperatorChange(op.value)"
        >
          <span class="op-icon">{{ op.icon }}</span>
          <span>{{ op.label }}</span>
        </button>
      </div>
    </div>

    <!-- $near Controls -->
    <div v-if="operator === '$near'" class="controls-section">
      <h4>Proximity Settings</h4>
      
      <div class="control-group">
        <label>Center Point</label>
        <div class="coordinate-inputs">
          <input
            type="number"
            step="0.001"
            :value="center.lat"
            @input="emit('update:center', { ...center, lat: +($event.target as HTMLInputElement).value })"
            placeholder="Latitude"
          />
          <input
            type="number"
            step="0.001"
            :value="center.lng"
            @input="emit('update:center', { ...center, lng: +($event.target as HTMLInputElement).value })"
            placeholder="Longitude"
          />
        </div>
        <p class="hint">💡 Click the map to change center point</p>
      </div>

      <div class="control-group">
        <label>Max Radius: {{ radius }}m</label>
        <input
          type="range"
          :value="radius"
          min="500"
          max="10000"
          step="500"
          @input="emit('update:radius', +($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="control-group">
        <label>Min Radius: {{ minRadius }}m</label>
        <input
          type="range"
          :value="minRadius"
          min="0"
          :max="radius - 500"
          step="100"
          @input="emit('update:minRadius', +($event.target as HTMLInputElement).value)"
        />
        <p class="hint">Creates an exclusion zone around the center</p>
      </div>
    </div>

    <!-- $geoBox Controls -->
    <div v-if="operator === '$geoBox'" class="controls-section">
      <h4>Bounding Box</h4>
      
      <div class="control-group">
        <label>Southwest Corner</label>
        <div class="coordinate-inputs">
          <input
            type="number"
            step="0.001"
            :value="boundingBox.southwest.lat"
            @input="emit('update:boundingBox', { 
              ...boundingBox, 
              southwest: { ...boundingBox.southwest, lat: +($event.target as HTMLInputElement).value }
            })"
            placeholder="Latitude"
          />
          <input
            type="number"
            step="0.001"
            :value="boundingBox.southwest.lng"
            @input="emit('update:boundingBox', { 
              ...boundingBox, 
              southwest: { ...boundingBox.southwest, lng: +($event.target as HTMLInputElement).value }
            })"
            placeholder="Longitude"
          />
        </div>
      </div>

      <div class="control-group">
        <label>Northeast Corner</label>
        <div class="coordinate-inputs">
          <input
            type="number"
            step="0.001"
            :value="boundingBox.northeast.lat"
            @input="emit('update:boundingBox', { 
              ...boundingBox, 
              northeast: { ...boundingBox.northeast, lat: +($event.target as HTMLInputElement).value }
            })"
            placeholder="Latitude"
          />
          <input
            type="number"
            step="0.001"
            :value="boundingBox.northeast.lng"
            @input="emit('update:boundingBox', { 
              ...boundingBox, 
              northeast: { ...boundingBox.northeast, lng: +($event.target as HTMLInputElement).value }
            })"
            placeholder="Longitude"
          />
        </div>
      </div>
    </div>

    <!-- $geoPolygon Controls -->
    <div v-if="operator === '$geoPolygon'" class="controls-section">
      <h4>Polygon Points</h4>
      
      <div 
        v-for="(point, index) in polygon.points" 
        :key="index"
        class="control-group"
      >
        <label>Point {{ index + 1 }}</label>
        <div class="coordinate-inputs">
          <input
            type="number"
            step="0.001"
            :value="point.lat"
            @input="updatePolygonPoint(index, 'lat', +($event.target as HTMLInputElement).value)"
            placeholder="Latitude"
          />
          <input
            type="number"
            step="0.001"
            :value="point.lng"
            @input="updatePolygonPoint(index, 'lng', +($event.target as HTMLInputElement).value)"
            placeholder="Longitude"
          />
          <button
            v-if="polygon.points.length > 3"
            class="remove-btn"
            @click="removePolygonPoint(index)"
          >
            ✕
          </button>
        </div>
      </div>

      <button class="add-point-btn" @click="addPolygonPoint">
        + Add Point
      </button>
      <p class="hint">💡 Drag vertices on the map to edit polygon</p>
    </div>

    <!-- Additional Filters -->
    <div v-if="availableFilters.length > 0" class="controls-section">
      <h4>Additional Filters</h4>
      
      <div 
        v-for="field in availableFilters"
        :key="field.name"
        class="control-group"
      >
        <label v-if="field.type !== 'boolean'">{{ field.label }}</label>
        
        <!-- Number input -->
        <input
          v-if="field.type === 'number'"
          type="number"
          :step="field.step || 1"
          :value="additionalFilters[field.name]"
          @input="updateAdditionalFilter(field.name, +($event.target as HTMLInputElement).value || null)"
          :placeholder="field.placeholder"
        />
        
        <!-- Text input -->
        <input
          v-else-if="field.type === 'text'"
          type="text"
          :value="additionalFilters[field.name]"
          @input="updateAdditionalFilter(field.name, ($event.target as HTMLInputElement).value || null)"
          :placeholder="field.placeholder"
        />
        
        <!-- Select -->
        <select
          v-else-if="field.type === 'select'"
          :value="additionalFilters[field.name]"
          @change="updateAdditionalFilter(field.name, ($event.target as HTMLSelectElement).value || null)"
        >
          <option value="">All</option>
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        
        <!-- Boolean -->
        <label v-else-if="field.type === 'boolean'" class="checkbox-label">
          <input
            type="checkbox"
            :checked="additionalFilters[field.name]"
            @change="updateAdditionalFilter(field.name, ($event.target as HTMLInputElement).checked || null)"
          />

          <span style="margin-left: 0.5rem;">{{ field.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.operator-controls {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.5rem;
}

.controls-section {
  margin-bottom: 1.5rem;
}

.controls-section:last-child {
  margin-bottom: 0;
}

.controls-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.controls-section h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: var(--vp-c-text-2);
}

.operator-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.operator-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s;
}

.operator-btn:hover {
  border-color: var(--vp-c-brand);
}

.operator-btn.active {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.op-icon {
  font-size: 1.5rem;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.coordinate-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
}

.control-group input[type="number"],
.control-group input[type="text"],
.control-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.control-group input[type="range"] {
  width: 100%;
}

.hint {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.remove-btn {
  padding: 0.5rem;
  border: 1px solid var(--vp-c-danger);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-danger);
  cursor: pointer;
}

.add-point-btn {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed var(--vp-c-brand);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-brand);
  cursor: pointer;
  transition: all 0.2s;
}

.add-point-btn:hover {
  background: var(--vp-c-brand-soft);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>
