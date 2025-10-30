import { type Ref, onUnmounted } from 'vue';

interface UseEditorResizeReturn {
  autoResize: (textarea: HTMLTextAreaElement) => void;
  syncScroll: (event: Event) => void;
}

/**
 * Composable for editor auto-resize and scroll synchronization
 */
export function useEditorResize(isVerticalLayout: Ref<boolean>): UseEditorResizeReturn {
  let resizeTimeout: number | null = null;

  const autoResize = (textarea: HTMLTextAreaElement): void => {
    const wrapper = textarea.parentElement;
    const highlight = textarea.previousElementSibling as HTMLPreElement;
    if (!wrapper || !highlight) return;

    wrapper.style.height = 'auto';

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = window.setTimeout(() => {
      const scrollHeight = highlight.scrollHeight;
      const minHeight = 200;
      const newHeight = Math.max(minHeight, scrollHeight + 20);
      wrapper.style.height = `${newHeight}px`;
    }, 0);
  };

  const syncScroll = (event: Event): void => {
    const textarea = event.target as HTMLTextAreaElement;
    const highlight = textarea.previousElementSibling as HTMLPreElement;

    if (highlight) {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }

    if (isVerticalLayout.value) {
      autoResize(textarea);
    }
  };

  onUnmounted(() => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
  });

  return {
    autoResize,
    syncScroll,
  };
}
