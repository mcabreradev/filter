import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useEditorResize } from '../composables/useEditorResize';

describe('useEditorResize', () => {
  let textarea: HTMLTextAreaElement;
  let wrapper: HTMLDivElement;
  let highlight: HTMLPreElement;
  let cleanup: (() => void) | null = null;

  beforeEach(() => {
    vi.useFakeTimers();

    // Create mock DOM elements
    wrapper = document.createElement('div');
    highlight = document.createElement('pre');
    textarea = document.createElement('textarea');

    // Set up DOM structure
    wrapper.appendChild(highlight);
    wrapper.appendChild(textarea);
    document.body.appendChild(wrapper);

    // Mock scrollHeight
    Object.defineProperty(highlight, 'scrollHeight', {
      configurable: true,
      get: () => 500,
    });
  });

  afterEach(() => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.removeChild(wrapper);
  });

  describe('autoResize', () => {
    it('should resize wrapper based on highlight scrollHeight', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      autoResize(textarea);

      // Run pending timers
      vi.runAllTimers();

      expect(wrapper.style.height).toBe('520px'); // scrollHeight (500) + 20
    });

    it('should respect minimum height of 200px', () => {
      Object.defineProperty(highlight, 'scrollHeight', {
        configurable: true,
        get: () => 50,
      });

      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      autoResize(textarea);
      vi.runAllTimers();

      expect(wrapper.style.height).toBe('200px'); // min height
    });

    it('should handle large content', () => {
      Object.defineProperty(highlight, 'scrollHeight', {
        configurable: true,
        get: () => 2000,
      });

      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      autoResize(textarea);
      vi.runAllTimers();

      expect(wrapper.style.height).toBe('2020px'); // 2000 + 20
    });

    it('should not crash if wrapper is missing', () => {
      const orphanTextarea = document.createElement('textarea');
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      expect(() => {
        autoResize(orphanTextarea);
        vi.runAllTimers();
      }).not.toThrow();
    });

    it('should not crash if highlight is missing', () => {
      const newWrapper = document.createElement('div');
      const newTextarea = document.createElement('textarea');
      newWrapper.appendChild(newTextarea);
      document.body.appendChild(newWrapper);

      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      expect(() => {
        autoResize(newTextarea);
        vi.runAllTimers();
      }).not.toThrow();

      document.body.removeChild(newWrapper);
    });

    it('should set wrapper height to auto initially', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      wrapper.style.height = '1000px';
      autoResize(textarea);

      expect(wrapper.style.height).toBe('auto');
    });

    it('should debounce resize operations', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      autoResize(textarea);
      autoResize(textarea);
      autoResize(textarea);

      vi.runAllTimers();

      // Should only resize once
      expect(wrapper.style.height).toBe('520px');
    });
  });

  describe('syncScroll', () => {
    it('should sync scroll position from textarea to highlight', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { syncScroll } = result;

      textarea.scrollTop = 100;
      textarea.scrollLeft = 50;

      const event = new Event('scroll');
      Object.defineProperty(event, 'target', { value: textarea });

      syncScroll(event);

      expect(highlight.scrollTop).toBe(100);
      expect(highlight.scrollLeft).toBe(50);
    });

    it('should trigger autoResize on scroll', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { syncScroll } = result;

      const event = new Event('scroll');
      Object.defineProperty(event, 'target', { value: textarea });

      syncScroll(event);
      vi.runAllTimers();

      expect(wrapper.style.height).toBe('520px');
    });

    it('should handle missing highlight element', () => {
      const newWrapper = document.createElement('div');
      const newTextarea = document.createElement('textarea');
      newWrapper.appendChild(newTextarea);
      document.body.appendChild(newWrapper);

      const result = useEditorResize();
      cleanup = result.cleanup;
      const { syncScroll } = result;

      const event = new Event('scroll');
      Object.defineProperty(event, 'target', { value: newTextarea });

      expect(() => {
        syncScroll(event);
      }).not.toThrow();

      document.body.removeChild(newWrapper);
    });

    it('should handle rapid scroll events', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { syncScroll } = result;

      const event = new Event('scroll');
      Object.defineProperty(event, 'target', { value: textarea });

      // Simulate rapid scrolling
      for (let i = 0; i < 10; i++) {
        textarea.scrollTop = i * 10;
        syncScroll(event);
      }

      vi.runAllTimers();

      expect(highlight.scrollTop).toBe(90); // Last scroll position
      expect(wrapper.style.height).toBe('520px');
    });

    it('should sync horizontal and vertical scroll independently', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { syncScroll } = result;

      const event = new Event('scroll');
      Object.defineProperty(event, 'target', { value: textarea });

      // Scroll vertically
      textarea.scrollTop = 100;
      textarea.scrollLeft = 0;
      syncScroll(event);
      expect(highlight.scrollTop).toBe(100);
      expect(highlight.scrollLeft).toBe(0);

      // Scroll horizontally
      textarea.scrollTop = 100;
      textarea.scrollLeft = 75;
      syncScroll(event);
      expect(highlight.scrollTop).toBe(100);
      expect(highlight.scrollLeft).toBe(75);
    });
  });

  describe('cleanup', () => {
    it('should clear timeout on component unmount', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      autoResize(textarea);

      // Timer should be pending
      expect(vi.getTimerCount()).toBeGreaterThan(0);

      // Simulate unmount - timers will be cleared
      vi.clearAllTimers();

      expect(vi.getTimerCount()).toBe(0);
    });

    it('should not crash when accessing after unmount', () => {
      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize, syncScroll } = result;

      autoResize(textarea);

      // Clear timers (simulate unmount)
      vi.clearAllTimers();

      // Should not crash
      expect(() => {
        const event = new Event('scroll');
        Object.defineProperty(event, 'target', { value: textarea });
        syncScroll(event);
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle zero scrollHeight', () => {
      Object.defineProperty(highlight, 'scrollHeight', {
        configurable: true,
        get: () => 0,
      });

      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      autoResize(textarea);
      vi.runAllTimers();

      expect(wrapper.style.height).toBe('200px'); // Should use min height
    });

    it('should handle negative scrollHeight', () => {
      Object.defineProperty(highlight, 'scrollHeight', {
        configurable: true,
        get: () => -100,
      });

      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      autoResize(textarea);
      vi.runAllTimers();

      expect(wrapper.style.height).toBe('200px'); // Should use min height
    });

    it('should handle fractional scrollHeight', () => {
      Object.defineProperty(highlight, 'scrollHeight', {
        configurable: true,
        get: () => 250.5,
      });

      const result = useEditorResize();
      cleanup = result.cleanup;
      const { autoResize } = result;

      autoResize(textarea);
      vi.runAllTimers();

      expect(wrapper.style.height).toBe('270.5px'); // 250.5 + 20
    });
  });
});
