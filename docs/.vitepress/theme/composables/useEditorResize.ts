import { onUnmounted, getCurrentInstance } from 'vue';

interface UseEditorResizeReturn {
  autoResize: (textarea: HTMLTextAreaElement) => void;
  syncScroll: (event: Event) => void;
  cleanup: () => void;
}

export function useEditorResize(): UseEditorResizeReturn {
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

    autoResize(textarea);
  };

  const cleanup = (): void => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = null;
    }
  };

  // Only register onUnmounted if we're in a Vue component context
  if (getCurrentInstance()) {
    onUnmounted(cleanup);
  }

  return {
    autoResize,
    syncScroll,
    cleanup,
  };
}
