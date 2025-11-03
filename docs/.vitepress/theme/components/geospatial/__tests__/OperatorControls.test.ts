import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import OperatorControls from '../OperatorControls.vue';
import type { GeoPoint } from '../../../../../../src/types';
import type { GeospatialOperator } from '../types';

describe('OperatorControls', () => {
  const mockCenter: GeoPoint = { lat: 52.52, lng: 13.405 };
  const mockBoundingBox = {
    southwest: { lat: 52.5, lng: 13.3 },
    northeast: { lat: 52.54, lng: 13.5 },
  };
  const mockPolygon = {
    points: [
      { lat: 52.51, lng: 13.4 },
      { lat: 52.52, lng: 13.41 },
      { lat: 52.53, lng: 13.42 },
    ],
  };
  const mockDatasetConfig = {
    filterableFields: [
      {
        name: 'rating',
        label: 'Rating',
        type: 'number' as const,
        step: 0.1,
        placeholder: 'Min rating',
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select' as const,
        options: ['Restaurant', 'Cafe', 'Bar'],
      },
      { name: 'isOpen', label: 'Open Now', type: 'boolean' as const },
    ],
  };

  const defaultProps = {
    operator: '$near' as GeospatialOperator,
    center: mockCenter,
    radius: 5000,
    minRadius: 0,
    boundingBox: mockBoundingBox,
    polygon: mockPolygon,
    additionalFilters: {},
    datasetConfig: mockDatasetConfig,
  };

  describe('rendering', () => {
    it('should render operator selector buttons', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const buttons = wrapper.findAll('.operator-btn');
      expect(buttons).toHaveLength(3);
      expect(buttons[0].text()).toContain('Proximity ($near)');
      expect(buttons[1].text()).toContain('Bounding Box ($geoBox)');
      expect(buttons[2].text()).toContain('Polygon ($geoPolygon)');
    });

    it('should highlight active operator', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const activeBtn = wrapper.find('.operator-btn.active');
      expect(activeBtn.text()).toContain('Proximity ($near)');
    });

    it('should show operator icons', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const icons = wrapper.findAll('.op-icon');
      expect(icons[0].text()).toBe('📍');
      expect(icons[1].text()).toBe('📦');
      expect(icons[2].text()).toBe('🔷');
    });
  });

  describe('$near operator controls', () => {
    it('should show proximity settings when $near is selected', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      expect(wrapper.text()).toContain('Proximity Settings');
      expect(wrapper.text()).toContain('Center Point');
      expect(wrapper.text()).toContain('Max Radius');
      expect(wrapper.text()).toContain('Min Radius');
    });

    it('should display center coordinates', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const inputs = wrapper.findAll('input[type="number"]');
      expect((inputs[0].element as HTMLInputElement).value).toBe('52.52');
      expect((inputs[1].element as HTMLInputElement).value).toBe('13.405');
    });

    it('should emit update:center when coordinates change', async () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const latInput = wrapper.findAll('input[type="number"]')[0];
      await latInput.setValue(52.53);

      expect(wrapper.emitted('update:center')).toBeTruthy();
      expect(wrapper.emitted('update:center')?.[0]).toEqual([{ lat: 52.53, lng: 13.405 }]);
    });

    it('should display radius value', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      expect(wrapper.text()).toContain('Max Radius: 5000m');
    });

    it('should emit update:radius when slider changes', async () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const radiusSlider = wrapper.find('input[type="range"]');
      await radiusSlider.setValue(7000);

      expect(wrapper.emitted('update:radius')).toBeTruthy();
      expect(wrapper.emitted('update:radius')?.[0]).toEqual([7000]);
    });

    it('should display min radius value', () => {
      const wrapper = mount(OperatorControls, {
        props: { ...defaultProps, minRadius: 1000 },
      });

      expect(wrapper.text()).toContain('Min Radius: 1000m');
    });

    it('should emit update:minRadius when slider changes', async () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const sliders = wrapper.findAll('input[type="range"]');
      const minRadiusSlider = sliders[1];
      await minRadiusSlider.setValue(500);

      expect(wrapper.emitted('update:minRadius')).toBeTruthy();
      expect(wrapper.emitted('update:minRadius')?.[0]).toEqual([500]);
    });
  });

  describe('$geoBox operator controls', () => {
    const boxProps = { ...defaultProps, operator: '$geoBox' as GeospatialOperator };

    it('should show bounding box settings when $geoBox is selected', () => {
      const wrapper = mount(OperatorControls, { props: boxProps });

      expect(wrapper.text()).toContain('Bounding Box');
      expect(wrapper.text()).toContain('Southwest Corner');
      expect(wrapper.text()).toContain('Northeast Corner');
    });

    it('should display bounding box coordinates', () => {
      const wrapper = mount(OperatorControls, { props: boxProps });

      const inputs = wrapper.findAll('input[type="number"]');
      // Southwest
      expect((inputs[0].element as HTMLInputElement).value).toBe('52.5');
      expect((inputs[1].element as HTMLInputElement).value).toBe('13.3');
      // Northeast
      expect((inputs[2].element as HTMLInputElement).value).toBe('52.54');
      expect((inputs[3].element as HTMLInputElement).value).toBe('13.5');
    });

    it('should emit update:boundingBox when southwest changes', async () => {
      const wrapper = mount(OperatorControls, { props: boxProps });

      const swLatInput = wrapper.findAll('input[type="number"]')[0];
      await swLatInput.setValue(52.51);

      expect(wrapper.emitted('update:boundingBox')).toBeTruthy();
      const emitted = wrapper.emitted('update:boundingBox')?.[0][0] as any;
      expect(emitted.southwest.lat).toBe(52.51);
      expect(emitted.southwest.lng).toBe(13.3);
    });

    it('should emit update:boundingBox when northeast changes', async () => {
      const wrapper = mount(OperatorControls, { props: boxProps });

      const neLatInput = wrapper.findAll('input[type="number"]')[2];
      await neLatInput.setValue(52.55);

      expect(wrapper.emitted('update:boundingBox')).toBeTruthy();
      const emitted = wrapper.emitted('update:boundingBox')?.[0][0] as any;
      expect(emitted.northeast.lat).toBe(52.55);
    });
  });

  describe('$geoPolygon operator controls', () => {
    const polygonProps = { ...defaultProps, operator: '$geoPolygon' as GeospatialOperator };

    it('should show polygon settings when $geoPolygon is selected', () => {
      const wrapper = mount(OperatorControls, { props: polygonProps });

      expect(wrapper.text()).toContain('Polygon Points');
    });

    it('should display all polygon points', () => {
      const wrapper = mount(OperatorControls, { props: polygonProps });

      expect(wrapper.text()).toContain('Point 1');
      expect(wrapper.text()).toContain('Point 2');
      expect(wrapper.text()).toContain('Point 3');
    });

    it('should display polygon point coordinates', () => {
      const wrapper = mount(OperatorControls, { props: polygonProps });

      const inputs = wrapper.findAll('input[type="number"]');
      // Point 1
      expect((inputs[0].element as HTMLInputElement).value).toBe('52.51');
      expect((inputs[1].element as HTMLInputElement).value).toBe('13.4');
    });

    it('should emit update:polygon when point changes', async () => {
      const wrapper = mount(OperatorControls, { props: polygonProps });

      const latInput = wrapper.findAll('input[type="number"]')[0];
      await latInput.setValue(52.52);

      expect(wrapper.emitted('update:polygon')).toBeTruthy();
      const emitted = wrapper.emitted('update:polygon')?.[0][0] as any;
      expect(emitted.points[0].lat).toBe(52.52);
    });

    it('should show add point button', () => {
      const wrapper = mount(OperatorControls, { props: polygonProps });

      const addBtn = wrapper.find('.add-point-btn');
      expect(addBtn.exists()).toBe(true);
      expect(addBtn.text()).toContain('Add Point');
    });

    it('should add new point when clicking add button', async () => {
      const wrapper = mount(OperatorControls, { props: polygonProps });

      const addBtn = wrapper.find('.add-point-btn');
      await addBtn.trigger('click');

      expect(wrapper.emitted('update:polygon')).toBeTruthy();
      const emitted = wrapper.emitted('update:polygon')?.[0][0] as any;
      expect(emitted.points).toHaveLength(4);
    });

    it('should show remove buttons for points when more than 3', async () => {
      const wrapper = mount(OperatorControls, { props: polygonProps });
      await wrapper.vm.$nextTick();

      const removeButtons = wrapper.findAll('button.remove-btn');
      expect(removeButtons.length).toBe(0); // polygonProps has 3 points, so 0 remove buttons initially

      // Actually need 4 points to show remove buttons
      await wrapper.setProps({
        polygon: {
          points: [
            { lat: 52.51, lng: 13.4 },
            { lat: 52.52, lng: 13.41 },
            { lat: 52.53, lng: 13.42 },
            { lat: 52.54, lng: 13.43 },
          ],
        },
      });
      await wrapper.vm.$nextTick();

      const removeButtonsAfter = wrapper.findAll('button.remove-btn');
      expect(removeButtonsAfter.length).toBe(4);
    });

    it('should remove point when clicking remove button', async () => {
      const fourPointPolygon = {
        points: [
          { lat: 52.51, lng: 13.4 },
          { lat: 52.52, lng: 13.41 },
          { lat: 52.53, lng: 13.42 },
          { lat: 52.54, lng: 13.43 },
        ],
      };

      const wrapper = mount(OperatorControls, {
        props: { ...polygonProps, polygon: fourPointPolygon },
      });
      await wrapper.vm.$nextTick();

      const removeBtn = wrapper.find('button.remove-btn');
      expect(removeBtn.exists()).toBe(true);

      await removeBtn.trigger('click');

      expect(wrapper.emitted('update:polygon')).toBeTruthy();
      const emitted = wrapper.emitted('update:polygon')?.[0][0] as any;
      expect(emitted.points).toHaveLength(3);
    });

    it('should not show remove buttons when only 3 points', () => {
      const minPolygon = {
        points: [
          { lat: 52.51, lng: 13.4 },
          { lat: 52.52, lng: 13.41 },
          { lat: 52.53, lng: 13.42 },
        ],
      };

      const wrapper = mount(OperatorControls, {
        props: { ...polygonProps, polygon: minPolygon },
      });

      const removeButtons = wrapper.findAll('.remove-btn');
      expect(removeButtons.length).toBe(0);
    });
  });

  describe('operator switching', () => {
    it('should emit operatorChange when operator button is clicked', async () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const geoBoxBtn = wrapper.findAll('.operator-btn')[1];
      await geoBoxBtn.trigger('click');

      expect(wrapper.emitted('update:operator')).toBeTruthy();
      expect(wrapper.emitted('update:operator')?.[0]).toEqual(['$geoBox']);
      expect(wrapper.emitted('operatorChange')).toBeTruthy();
      expect(wrapper.emitted('operatorChange')?.[0]).toEqual(['$geoBox']);
    });

    it('should update active class when operator changes', async () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      await wrapper.setProps({ operator: '$geoBox' });

      const activeBtn = wrapper.find('.operator-btn.active');
      expect(activeBtn.text()).toContain('Bounding Box ($geoBox)');
    });
  });

  describe('additional filters', () => {
    it('should render additional filters section', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      expect(wrapper.text()).toContain('Additional Filters');
      expect(wrapper.text()).toContain('Rating');
      expect(wrapper.text()).toContain('Category');
      expect(wrapper.text()).toContain('Open Now');
    });

    it('should render number input for number type', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const numberInputs = wrapper.findAll('.control-group input[type="number"]');
      const ratingInput = numberInputs.find(
        (input) => (input.element as HTMLInputElement).placeholder === 'Min rating',
      );
      expect(ratingInput).toBeDefined();
    });

    it('should render select for select type', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const select = wrapper.find('select');
      expect(select.exists()).toBe(true);

      const options = select.findAll('option');
      expect(options).toHaveLength(4); // All + 3 options
      expect(options[1].text()).toBe('Restaurant');
      expect(options[2].text()).toBe('Cafe');
      expect(options[3].text()).toBe('Bar');
    });

    it('should render checkbox for boolean type', () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.exists()).toBe(true);
    });

    it('should emit update:additionalFilters when number filter changes', async () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const numberInputs = wrapper.findAll('.control-group input[type="number"]');
      const ratingInput = numberInputs.find(
        (input) => (input.element as HTMLInputElement).placeholder === 'Min rating',
      );

      await ratingInput?.setValue(4.5);

      expect(wrapper.emitted('update:additionalFilters')).toBeTruthy();
      const emitted = wrapper.emitted('update:additionalFilters')?.[0][0] as any;
      expect(emitted.rating).toBe(4.5);
    });

    it('should emit update:additionalFilters when select filter changes', async () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const select = wrapper.find('select');
      await select.setValue('Restaurant');

      expect(wrapper.emitted('update:additionalFilters')).toBeTruthy();
      const emitted = wrapper.emitted('update:additionalFilters')?.[0][0] as any;
      expect(emitted.category).toBe('Restaurant');
    });

    it('should emit update:additionalFilters when checkbox changes', async () => {
      const wrapper = mount(OperatorControls, { props: defaultProps });

      const checkbox = wrapper.find('input[type="checkbox"]');
      await checkbox.setValue(true);

      expect(wrapper.emitted('update:additionalFilters')).toBeTruthy();
      const emitted = wrapper.emitted('update:additionalFilters')?.[0][0] as any;
      expect(emitted.isOpen).toBe(true);
    });

    it('should remove filter when value is cleared', async () => {
      const wrapper = mount(OperatorControls, {
        props: {
          ...defaultProps,
          additionalFilters: { rating: 4.5, category: 'Restaurant' },
        },
      });

      const select = wrapper.find('select');
      await select.setValue('');

      expect(wrapper.emitted('update:additionalFilters')).toBeTruthy();
      const emitted = wrapper.emitted('update:additionalFilters')?.[0][0] as any;
      expect(emitted.category).toBeUndefined();
      expect(emitted.rating).toBe(4.5); // Other filters preserved
    });

    it('should not render additional filters section when no filterable fields', () => {
      const wrapper = mount(OperatorControls, {
        props: {
          ...defaultProps,
          datasetConfig: { filterableFields: [] },
        },
      });

      expect(wrapper.text()).not.toContain('Additional Filters');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined dataset config', () => {
      const wrapper = mount(OperatorControls, {
        props: {
          ...defaultProps,
          datasetConfig: {},
        },
      });

      expect(wrapper.text()).not.toContain('Additional Filters');
    });

    it('should handle negative coordinates', () => {
      const negativeCenter = { lat: -33.8688, lng: 151.2093 }; // Sydney
      const wrapper = mount(OperatorControls, {
        props: { ...defaultProps, center: negativeCenter },
      });

      const inputs = wrapper.findAll('input[type="number"]');
      expect((inputs[0].element as HTMLInputElement).value).toBe('-33.8688');
      expect((inputs[1].element as HTMLInputElement).value).toBe('151.2093');
    });
  });
});
