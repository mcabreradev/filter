<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  code: string;
  expression: any;
  resultCount: number;
}

const props = defineProps<Props>();

const copied = ref(false);

// Format JSON with syntax highlighting
const formattedExpression = computed(() => {
  return JSON.stringify(props.expression, null, 2);
});

// Syntax highlight the code
const highlightedCode = computed(() => {
  return highlightCode(props.code);
});

// Highlight code function
const highlightCode = (codeText: string): string => {
  let html = '';
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

  return html;
};

// Copy to clipboard
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>

<template>
  <div class="code-display">
    <div class="code-header">
      <p>Generated Filter Code</p>
      <button class="copy-btn" @click="copyCode" :title="copied ? 'Copied!' : 'Copy to clipboard'">
        {{ copied ? '✓ Copied' : '📋 Copy' }}
      </button>
    </div>

    <div class="code-block">
      <pre><code v-html="highlightedCode"></code></pre>
    </div>

    <div class="code-stats">
      <div class="stat">
        <span class="stat-label">Results:</span>
        <span class="stat-value">{{ resultCount }}</span>
      </div>
    </div>

    <div class="code-info">
      <p class="hint">
        💡 This filter expression will return {{ resultCount }} item{{ resultCount !== 1 ? 's' : '' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.code-display {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.code-header p {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.code-header h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.copy-btn {
  padding: 0.5rem 1rem;
  min-height: 40px;
  min-width: 80px;
  border: 1px solid var(--vp-c-brand);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-brand);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  touch-action: manipulation;
  white-space: nowrap;
}

.copy-btn:hover {
  background: var(--vp-c-brand-soft);
}

.code-block {
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  -webkit-overflow-scrolling: touch;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  white-space: pre;
  word-wrap: normal;
  overflow-wrap: normal;
}

.code-block code {
  display: block;
  min-width: min-content;
}

/* Syntax Highlighting */
.code-block :deep(.token-keyword) {
  color: #c678dd;
  font-weight: 600;
}

.code-block :deep(.token-string) {
  color: #98c379;
}

.code-block :deep(.token-number) {
  color: #d19a66;
}

.code-block :deep(.token-function) {
  color: #61afef;
}

.code-block :deep(.token-property) {
  color: #e06c75;
}

.code-block :deep(.token-comment) {
  color: #5c6370;
  font-style: italic;
}

.code-stats {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.stat-value {
  font-weight: 600;
  color: var(--vp-c-brand);
  font-size: 1.125rem;
}

.code-info {
  margin-top: 1rem;
}

.hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  padding: 0.75rem;
  background: var(--vp-c-bg);
  border-radius: 6px;
  border-left: 3px solid var(--vp-c-brand);
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .code-display {
    padding: 1rem;
  }

  .code-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .code-header p {
    font-size: 0.9375rem;
  }

  .copy-btn {
    width: 100%;
    min-height: 44px;
    font-size: 0.9375rem;
  }

  .code-block {
    padding: 0.875rem;
  }

  .code-block pre {
    font-size: 13px;
  }

  .code-stats {
    gap: 0.75rem;
  }

  .stat-label {
    font-size: 0.875rem;
  }

  .stat-value {
    font-size: 1rem;
  }

  .hint {
    font-size: 0.8125rem;
    padding: 0.625rem;
  }
}

@media (max-width: 480px) {
  .code-display {
    padding: 0.75rem;
  }

  .code-header p {
    font-size: 0.875rem;
  }

  .copy-btn {
    font-size: 0.875rem;
    padding: 0.625rem 0.875rem;
  }

  .code-block {
    padding: 0.75rem;
  }

  .code-block pre {
    font-size: 12px;
    line-height: 1.5;
  }

  .code-stats {
    padding: 0.625rem;
  }

  .stat-label {
    font-size: 0.8125rem;
  }

  .stat-value {
    font-size: 0.9375rem;
  }

  .hint {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
}
</style>
