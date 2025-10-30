import { ref, type Ref } from 'vue';

interface UseCodeEditorReturn {
  code: Ref<string>;
  highlightedCode: Ref<string>;
  output: Ref<string>;
  error: Ref<string>;
  highlightCode: () => void;
  executeCode: (filterFn: any) => void;
  setCode: (newCode: string) => void;
}

/**
 * Composable for code editor functionality
 * Handles syntax highlighting and code execution
 */
export function useCodeEditor(initialCode = ''): UseCodeEditorReturn {
  const code = ref(initialCode);
  const highlightedCode = ref('');
  const output = ref('');
  const error = ref('');

  const highlightCode = (): void => {
    let codeText = code.value;

    // Escape HTML
    codeText = codeText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Apply syntax highlighting
    codeText = codeText
      .replace(/(\/\/.*$)/gm, '<span class="token-comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>')
      .replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        '<span class="token-string">$1</span>',
      )
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>')
      .replace(
        /\b(import|from|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|true|false|null|undefined|typeof|instanceof|try|catch|finally|throw|async|await|export|default)\b/g,
        '<span class="token-keyword">$1</span>',
      )
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="token-function">$1</span>')
      .replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, '.<span class="token-property">$1</span>');

    highlightedCode.value = codeText;
  };

  const executeCode = (filterFn: any): void => {
    try {
      error.value = '';
      const logs: string[] = [];

      const mockConsole = {
        log: (...args: unknown[]) => {
          logs.push(
            args
              .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
              .join(' '),
          );
        },
      };

      const wrappedCode = `
        (function() {
          const console = arguments[0];
          const filter = arguments[1];
          ${code.value.replace(/import.*from.*['"];?\n?/g, '')}
        })
      `;

      const fn = eval(wrappedCode);
      fn(mockConsole, filterFn);

      output.value = logs.join('\n') || 'No output';
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      output.value = '';
    }
  };

  const setCode = (newCode: string): void => {
    code.value = newCode;
    highlightCode();
  };

  return {
    code,
    highlightedCode,
    output,
    error,
    highlightCode,
    executeCode,
    setCode,
  };
}
