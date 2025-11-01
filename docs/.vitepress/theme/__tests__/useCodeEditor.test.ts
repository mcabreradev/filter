import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCodeEditor } from '../composables/useCodeEditor';

describe('useCodeEditor', () => {
  let editor: ReturnType<typeof useCodeEditor>;

  beforeEach(() => {
    editor = useCodeEditor();
  });

  describe('initialization', () => {
    it('should initialize with empty values', () => {
      expect(editor.code.value).toBe('');
      expect(editor.highlightedCode.value).toBe('');
      expect(editor.highlightedOutput.value).toBe('');
      expect(editor.output.value).toBe('');
      expect(editor.error.value).toBe('');
    });

    it('should initialize with provided code', () => {
      const initialCode = 'const x = 5;';
      const editorWithCode = useCodeEditor(initialCode);
      expect(editorWithCode.code.value).toBe(initialCode);
    });
  });

  describe('setCode', () => {
    it('should update code and highlight it', () => {
      const newCode = 'const hello = "world";';
      editor.setCode(newCode);

      expect(editor.code.value).toBe(newCode);
      expect(editor.highlightedCode.value).toContain('token-keyword');
      expect(editor.highlightedCode.value).toContain('token-string');
    });
  });

  describe('highlightCode', () => {
    it('should highlight keywords', () => {
      editor.code.value = 'const let var function return';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toContain('token-keyword');
    });

    it('should highlight strings', () => {
      editor.code.value = 'const str = "hello";';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toContain('token-string');
    });

    it('should highlight numbers', () => {
      editor.code.value = 'const num = 42;';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toContain('token-number');
    });

    it('should highlight function calls', () => {
      editor.code.value = 'filter(data, query);';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toContain('token-function');
    });

    it('should highlight properties', () => {
      editor.code.value = 'obj.property';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toContain('token-property');
    });

    it('should highlight comments', () => {
      editor.code.value = '// This is a comment\n/* Block comment */';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toContain('token-comment');
    });

    it('should escape HTML characters', () => {
      editor.code.value = 'const html = "<div>&nbsp;</div>";';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toContain('&lt;');
      expect(editor.highlightedCode.value).toContain('&gt;');
      expect(editor.highlightedCode.value).toContain('&amp;');
    });
  });

  describe('executeCode', () => {
    const mockFilter = vi.fn((data: any[], expr: any) => {
      if (typeof expr === 'function') {
        return data.filter(expr);
      }
      return data;
    });

    beforeEach(() => {
      mockFilter.mockClear();
    });

    it('should execute simple code', () => {
      editor.code.value = 'console.log("hello");';
      editor.executeCode(mockFilter);

      expect(editor.output.value).toBe('hello');
      expect(editor.error.value).toBe('');
    });

    it('should execute code with filter function', () => {
      editor.code.value = `
        const data = [1, 2, 3, 4, 5];
        const result = filter(data, (n) => n > 3);
        console.log(result);
      `;
      editor.executeCode(mockFilter);

      expect(mockFilter).toHaveBeenCalled();
      expect(editor.error.value).toBe('');
    });

    it('should handle console.log with objects', () => {
      editor.code.value = 'console.log({ name: "test", value: 42 });';
      editor.executeCode(mockFilter);

      expect(editor.output.value).toContain('"name"');
      expect(editor.output.value).toContain('"test"');
      expect(editor.output.value).toContain('42');
    });

    it('should capture errors', () => {
      editor.code.value = 'throw new Error("Test error");';
      editor.executeCode(mockFilter);

      expect(editor.error.value).toContain('Test error');
      expect(editor.output.value).toBe('');
    });

    it('should handle code without console.log', () => {
      editor.code.value = `
        const data = [1, 2, 3];
        filter(data, (n) => n > 1);
      `;
      editor.executeCode(mockFilter);

      expect(editor.error.value).toBe('');
    });

    it('should remove import statements before execution', () => {
      editor.code.value = `
        import { filter } from '@mcabreradev/filter';
        const data = [1, 2, 3];
        console.log(data);
      `;
      editor.executeCode(mockFilter);

      expect(editor.output.value).toContain('1');
      expect(editor.error.value).toBe('');
    });

    it('should handle multiple console.log statements', () => {
      editor.code.value = `
        console.log("first");
        console.log("second");
      `;
      editor.executeCode(mockFilter);

      expect(editor.output.value).toContain('first');
      expect(editor.output.value).toContain('second');
    });

    it('should return filter result when no console.log', () => {
      mockFilter.mockReturnValue([4, 5]);
      editor.code.value = `
        const data = [1, 2, 3, 4, 5];
        filter(data, (n) => n > 3);
      `;
      editor.executeCode(mockFilter);

      expect(editor.output.value).toContain('4');
      expect(editor.output.value).toContain('5');
    });

    it('should highlight JSON output', () => {
      editor.code.value = 'console.log({ active: true, count: 10 });';
      editor.executeCode(mockFilter);

      expect(editor.highlightedOutput.value).toContain('token-property');
      expect(editor.highlightedOutput.value).toContain('token-keyword');
      expect(editor.highlightedOutput.value).toContain('token-number');
    });
  });

  describe('edge cases', () => {
    it('should handle empty code', () => {
      editor.code.value = '';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toBe('');
    });

    it('should handle code with only whitespace', () => {
      editor.code.value = '   \n   \n   ';
      editor.highlightCode();

      expect(editor.highlightedCode.value).toContain('   ');
    });

    it('should handle complex nested objects', () => {
      editor.code.value = `
        console.log({
          user: {
            name: "test",
            settings: {
              theme: "dark"
            }
          }
        });
      `;
      const mockFilter = vi.fn();
      editor.executeCode(mockFilter);

      expect(editor.output.value).toContain('"name"');
      expect(editor.output.value).toContain('"settings"');
    });
  });
});
