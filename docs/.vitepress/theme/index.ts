import DefaultTheme from 'vitepress/theme';
import './style.css';
import Playground from './components/Playground.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Playground', Playground);
  },
};
