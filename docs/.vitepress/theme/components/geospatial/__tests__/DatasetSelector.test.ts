import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DatasetSelector from '../DatasetSelector.vue';

describe('DatasetSelector', () => {
  const mockDatasets = {
    restaurants: {
      name: 'Restaurants',
      description: 'Restaurant locations',
      items: [
        { id: 1, name: 'Restaurant 1' },
        { id: 2, name: 'Restaurant 2' },
        { id: 3, name: 'Restaurant 3' },
      ],
    },
    stores: {
      name: 'Stores',
      description: 'Store locations',
      items: [
        { id: 1, name: 'Store 1' },
        { id: 2, name: 'Store 2' },
      ],
    },
  };

  describe('rendering', () => {
    it('should render dataset selector with label', () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'restaurants',
        },
      });

      expect(wrapper.find('label').text()).toContain('📦 Dataset:');
      expect(wrapper.find('select').exists()).toBe(true);
    });

    it('should render all dataset options', () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'restaurants',
        },
      });

      const options = wrapper.findAll('option');
      expect(options).toHaveLength(2);
      expect(options[0].text()).toBe('Restaurants (3 items)');
      expect(options[1].text()).toBe('Stores (2 items)');
    });

    it('should show selected dataset', () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'stores',
        },
      });

      const select = wrapper.find('select').element as HTMLSelectElement;
      expect(select.value).toBe('stores');
    });

    it('should include item count in option text', () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'restaurants',
        },
      });

      const options = wrapper.findAll('option');
      expect(options[0].text()).toContain('(3 items)');
      expect(options[1].text()).toContain('(2 items)');
    });
  });

  describe('events', () => {
    it('should emit change event when dataset is selected', async () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'restaurants',
        },
      });

      const select = wrapper.find('select');
      await select.setValue('stores');

      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')?.[0]).toEqual(['stores']);
    });

    it('should emit correct dataset id on change', async () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'restaurants',
        },
      });

      const select = wrapper.find('select');
      // Use setValue instead of trigger with target
      await select.setValue('stores');

      expect(wrapper.emitted('change')?.[0]).toEqual(['stores']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty datasets', () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: {},
          selected: '',
        },
      });

      const options = wrapper.findAll('option');
      expect(options).toHaveLength(0);
    });

    it('should handle dataset with no items', () => {
      const emptyDataset = {
        empty: {
          name: 'Empty Dataset',
          description: 'No items',
          items: [],
        },
      };

      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: emptyDataset,
          selected: 'empty',
        },
      });

      const option = wrapper.find('option');
      expect(option.text()).toBe('Empty Dataset (0 items)');
    });

    it('should handle single dataset', () => {
      const singleDataset = {
        restaurants: mockDatasets.restaurants,
      };

      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: singleDataset,
          selected: 'restaurants',
        },
      });

      const options = wrapper.findAll('option');
      expect(options).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('should have proper label association', () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'restaurants',
        },
      });

      const label = wrapper.find('label');
      const select = wrapper.find('select');

      expect(label.attributes('for')).toBe('dataset');
      expect(select.attributes('id')).toBe('dataset');
    });

    it('should set value attribute on options', () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'restaurants',
        },
      });

      const options = wrapper.findAll('option');
      expect(options[0].attributes('value')).toBe('restaurants');
      expect(options[1].attributes('value')).toBe('stores');
    });
  });

  describe('styling', () => {
    it('should have proper CSS classes', () => {
      const wrapper = mount(DatasetSelector, {
        props: {
          datasets: mockDatasets,
          selected: 'restaurants',
        },
      });

      expect(wrapper.find('.dataset-selector').exists()).toBe(true);
    });
  });
});
