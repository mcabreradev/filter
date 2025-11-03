import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import Playground from './components/Playground.vue';
import GeospatialPlayground from './components/geospatial/GeospatialPlayground.vue';
import { inject } from '@vercel/analytics';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Playground', Playground);
    app.component('GeospatialPlayground', GeospatialPlayground);

    // Initialize Vercel Analytics
    if (typeof window !== 'undefined') {
      inject();
    }
  },
} satisfies Theme;
