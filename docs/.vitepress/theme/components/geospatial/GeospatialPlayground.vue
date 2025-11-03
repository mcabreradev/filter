<script setup lang="ts">
import { ref, computed } from 'vue';
import { filter } from '../../../../../src/index';
import type { GeoPoint } from '../../../../../src/types';
import MapViewer from './MapViewer.vue';
import OperatorControls from './OperatorControls.vue';
import FilterCodeDisplay from './FilterCodeDisplay.vue';
import ResultsPanel from './ResultsPanel.vue';
import DatasetSelector from './DatasetSelector.vue';
import type { GeospatialOperator, PlaygroundState } from './types';
import { datasets } from './geospatialDatasets';

// State management
const state = ref<PlaygroundState>({
  selectedDataset: 'restaurants',
  operator: '$near',
  centerPoint: { lat: -34.577645, lng: -58.426720 },
  radius: 2000,
  minRadius: 0,
  boundingBox: {
    southwest: { lat: -34.59, lng: -58.44 },
    northeast: { lat: -34.56, lng: -58.41 }
  },
  polygon: {
    points: [
      { lat: -34.57, lng: -58.43 },
      { lat: -34.57, lng: -58.42 },
      { lat: -34.58, lng: -58.42 },
      { lat: -34.58, lng: -58.43 }
    ]
  },
  additionalFilters: {}
});

// Current dataset
const currentData = computed(() => datasets[state.value.selectedDataset]);

// Build filter expression based on operator
const filterExpression = computed(() => {
  const expr: any = { ...state.value.additionalFilters };
  
  switch (state.value.operator) {
    case '$near':
      expr.location = {
        $near: {
          center: state.value.centerPoint,
          maxDistanceMeters: state.value.radius,
          ...(state.value.minRadius > 0 && { 
            minDistanceMeters: state.value.minRadius 
          })
        }
      };
      break;
    
    case '$geoBox':
      expr.location = {
        $geoBox: state.value.boundingBox
      };
      break;
    
    case '$geoPolygon':
      expr.location = {
        $geoPolygon: state.value.polygon
      };
      break;
  }
  
  return expr;
});

// Filtered results
const filteredData = computed(() => {
  try {
    return filter(currentData.value.items, filterExpression.value);
  } catch (error) {
    console.error('Filter error:', error);
    return [];
  }
});

// Code string for display
const codeString = computed(() => {
  return `filter(${state.value.selectedDataset}, ${JSON.stringify(filterExpression.value, null, 2)})`;
});

// Handle operator change
const onOperatorChange = (operator: GeospatialOperator) => {
  state.value.operator = operator;
  
  // Reset to dataset defaults
  const dataset = datasets[state.value.selectedDataset];
  state.value.centerPoint = dataset.defaultCenter;
  state.value.radius = dataset.defaultRadius;
};

// Handle dataset change
const onDatasetChange = (datasetId: string) => {
  state.value.selectedDataset = datasetId;
  const dataset = datasets[datasetId];
  
  // Reset to new dataset defaults
  state.value.centerPoint = dataset.defaultCenter;
  state.value.radius = dataset.defaultRadius;
  state.value.boundingBox = dataset.defaultBoundingBox;
  state.value.polygon = dataset.defaultPolygon;
  state.value.additionalFilters = {};
};

// Handle map interactions
const onMapClick = (point: GeoPoint) => {
  if (state.value.operator === '$near') {
    state.value.centerPoint = point;
  }
};

const onBoundsChange = (bounds: { southwest: GeoPoint; northeast: GeoPoint }) => {
  state.value.boundingBox = bounds;
};

const onPolygonChange = (points: GeoPoint[]) => {
  state.value.polygon = { points };
};
</script>

<template>
  <div class="geospatial-playground">
    <!-- Header -->
    <div class="playground-header">
      <h2>🗺️ Geospatial Operators Playground</h2>
      <p>Interactive demo: Click the map, adjust controls, and see real-time filtering!</p>
    </div>

    <!-- Main Layout: 2 columns -->
    <div class="playground-layout">
      <!-- Left Column: Map & Results -->
      <div class="playground-left">
        <!-- Dataset Selector -->
        <DatasetSelector
          :datasets="datasets"
          :selected="state.selectedDataset"
          @change="onDatasetChange"
        />

        <!-- Map -->
        <MapViewer
          :data="currentData.items"
          :filtered="filteredData"
          :operator="state.operator"
          :center="state.centerPoint"
          :radius="state.radius"
          :min-radius="state.minRadius"
          :bounding-box="state.boundingBox"
          :polygon="state.polygon"
          @click="onMapClick"
          @bounds-change="onBoundsChange"
          @polygon-change="onPolygonChange"
        />

        <!-- Results Panel -->
        <ResultsPanel
          :data="filteredData"
          :total="currentData.items.length"
          :dataset-config="currentData"
        />

        <!-- Live Code Display -->
        <FilterCodeDisplay
          :code="codeString"
          :expression="filterExpression"
          :result-count="filteredData.length"
        />
      </div>

      <!-- Right Column: Controls & Code -->
      <div class="playground-right">
        <!-- Operator Controls -->
        <OperatorControls
          v-model:operator="state.operator"
          v-model:center="state.centerPoint"
          v-model:radius="state.radius"
          v-model:min-radius="state.minRadius"
          v-model:bounding-box="state.boundingBox"
          v-model:polygon="state.polygon"
          v-model:additional-filters="state.additionalFilters"
          :dataset-config="currentData"
          @operator-change="onOperatorChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.geospatial-playground {
  margin: 2rem 0;
}

.playground-header {
  text-align: center;
  margin-bottom: 2rem;
}

.playground-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.playground-header p {
  margin: 0;
  color: var(--vp-c-text-2);
}

.playground-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
}

.playground-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .playground-layout {
    grid-template-columns: 1fr;
  }
  
  .playground-right {
    order: -1;
  }
}
</style>
