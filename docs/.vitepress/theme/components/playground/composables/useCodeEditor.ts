import { ref, type Ref } from 'vue';

interface UseCodeEditorReturn {
  code: Ref<string>;
  highlightedCode: Ref<string>;
  highlightedOutput: Ref<string>;
  output: Ref<string>;
  error: Ref<string>;
  highlightCode: () => void;
  executeCode: (filterFn: any) => void;
  setCode: (newCode: string) => void;
}

export function useCodeEditor(initialCode = ''): UseCodeEditorReturn {
  const code = ref(initialCode);
  const highlightedCode = ref('');
  const highlightedOutput = ref('');
  const output = ref('');
  const error = ref('');

  const highlightCode = (): void => {
    let html = '';
    const codeText = code.value;
    let lastIndex = 0;

    const escapeHtml = (text: string): string => {
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    const patterns = [
      { regex: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, className: 'token-comment' },
      {
        regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        className: 'token-string',
      },
      {
        regex:
          /\b(import|from|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|true|false|null|undefined|typeof|instanceof|try|catch|finally|throw|async|await|export|default)\b/g,
        className: 'token-keyword',
      },
      { regex: /\b(\d+\.?\d*)\b/g, className: 'token-number' },
      { regex: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, className: 'token-function' },
      { regex: /\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, className: 'token-property', hasDot: true },
    ];

    const tokens: Array<{
      start: number;
      end: number;
      className: string;
      text: string;
      hasDot?: boolean;
    }> = [];

    patterns.forEach(({ regex, className, hasDot }) => {
      let match;
      const r = new RegExp(regex.source, regex.flags);
      while ((match = r.exec(codeText)) !== null) {
        tokens.push({
          start: match.index,
          end: match.index + match[0].length,
          className,
          text: match[1] || match[0],
          hasDot,
        });
      }
    });

    tokens.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));

    const usedRanges = new Set<string>();
    const finalTokens = tokens.filter((token) => {
      for (let i = token.start; i < token.end; i++) {
        if (usedRanges.has(String(i))) return false;
      }
      for (let i = token.start; i < token.end; i++) {
        usedRanges.add(String(i));
      }
      return true;
    });

    finalTokens.sort((a, b) => a.start - b.start);

    finalTokens.forEach((token) => {
      if (token.start > lastIndex) {
        html += escapeHtml(codeText.substring(lastIndex, token.start));
      }

      if (token.hasDot) {
        const dotIndex = codeText.lastIndexOf('.', token.start + 1);
        if (dotIndex >= lastIndex && dotIndex < token.start) {
          html += '.';
          lastIndex = dotIndex + 1;
        }
        html += `<span class="${token.className}">${escapeHtml(token.text)}</span>`;
      } else {
        html += `<span class="${token.className}">${escapeHtml(token.text)}</span>`;
      }

      lastIndex = token.end;
    });

    if (lastIndex < codeText.length) {
      html += escapeHtml(codeText.substring(lastIndex));
    }

    highlightedCode.value = html;
  };

  const highlightJson = (text: string): string => {
    const escapeHtml = (str: string): string => {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    let html = '';
    let lastIndex = 0;
    const tokens: Array<{ start: number; end: number; type: string; value: string }> = [];

    const patterns = [
      { regex: /"[^"\\]*(?:\\.[^"\\]*)*"\s*:/g, type: 'property-key' },
      { regex: /"[^"\\]*(?:\\.[^"\\]*)*"/g, type: 'string' },
      { regex: /\b(true|false|null)\b/g, type: 'keyword' },
      { regex: /\b\d+\.?\d*\b/g, type: 'number' },
    ];

    patterns.forEach(({ regex, type }) => {
      let match;
      const r = new RegExp(regex.source, regex.flags);
      while ((match = r.exec(text)) !== null) {
        tokens.push({
          start: match.index,
          end: match.index + match[0].length,
          type,
          value: match[0],
        });
      }
    });

    tokens.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));

    const usedRanges = new Set<number>();
    const finalTokens = tokens.filter((token) => {
      for (let i = token.start; i < token.end; i++) {
        if (usedRanges.has(i)) return false;
      }
      for (let i = token.start; i < token.end; i++) {
        usedRanges.add(i);
      }
      return true;
    });

    finalTokens.sort((a, b) => a.start - b.start);

    finalTokens.forEach((token) => {
      if (token.start > lastIndex) {
        html += escapeHtml(text.substring(lastIndex, token.start));
      }

      if (token.type === 'property-key') {
        const colonIndex = token.value.lastIndexOf(':');
        const keyPart = token.value.substring(0, colonIndex);
        const colonPart = token.value.substring(colonIndex);
        html += `<span class="token-property">${escapeHtml(keyPart)}</span>${escapeHtml(colonPart)}`;
      } else if (token.type === 'string') {
        html += `<span class="token-string">${escapeHtml(token.value)}</span>`;
      } else if (token.type === 'keyword') {
        html += `<span class="token-keyword">${escapeHtml(token.value)}</span>`;
      } else if (token.type === 'number') {
        html += `<span class="token-number">${escapeHtml(token.value)}</span>`;
      }

      lastIndex = token.end;
    });

    if (lastIndex < text.length) {
      html += escapeHtml(text.substring(lastIndex));
    }

    return html;
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

      const codeWithoutImport = code.value.replace(/import.*from.*['"];?\n?/g, '');

      const lines = codeWithoutImport.trim().split('\n');
      const lastLine = lines[lines.length - 1].trim();

      const isFilterCall =
        lastLine.startsWith('filter(') ||
        (lines.length > 1 && lastLine === '});' && codeWithoutImport.includes('filter('));

      let wrappedCode: string;

      if (
        isFilterCall &&
        !lastLine.startsWith('const ') &&
        !lastLine.startsWith('let ') &&
        !lastLine.startsWith('var ')
      ) {
        wrappedCode = `
          (function() {
            const console = arguments[0];
            const filter = arguments[1];
            let __result__;
            ${codeWithoutImport.replace(/filter\(/g, '__result__ = filter(')}
            return __result__;
          })
        `;
      } else {
        wrappedCode = `
          (function() {
            const console = arguments[0];
            const filter = arguments[1];
            ${codeWithoutImport}
          })
        `;
      }

      const fn = eval(wrappedCode);
      const result = fn(mockConsole, filterFn);

      if (logs.length > 0) {
        output.value = logs.join('\n');
      } else if (result !== undefined) {
        output.value =
          typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
      } else {
        output.value = 'No output';
      }

      highlightedOutput.value = highlightJson(output.value);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      output.value = '';
      highlightedOutput.value = '';
    }
  };

  const setCode = (newCode: string): void => {
    code.value = newCode;
    highlightCode();
  };

  return {
    code,
    highlightedCode,
    highlightedOutput,
    output,
    error,
    highlightCode,
    executeCode,
    setCode,
  };
}
