# Playground "Apply to Code" Button Fix

## Issue
The "Apply to Code" button in the Visual Filter Builder was not working properly.

## Root Causes

1. **Regex Pattern Too Restrictive**: The regex pattern for finding and replacing the `filter()` call was too restrictive and couldn't handle multi-line or complex filter expressions.

2. **Type Mismatch**: The `buildRuleExpression` function was returning strings instead of objects, causing JSON parsing issues and making it difficult to properly generate complex nested expressions.

3. **Missing Fallback**: The function didn't handle the case when no `console.log` was found in the code.

## Solutions Applied

### 1. Fixed `handleApplyFilter` in Playground.vue

**Before:**
```typescript
const handleApplyFilter = (): void => {
  // ... code ...
  if (code.value.includes('filter(')) {
    code.value = code.value.replace(
      /const result = filter\([^)]+(?:,\s*[\s\S]*?)?\);/,
      newFilterCode
    );
  }
  // ...
};
```

**After:**
```typescript
const handleApplyFilter = (): void => {
  // ... code ...
  // Check if filter() call already exists with better regex
  const filterCallPattern = /const\s+result\s*=\s*filter\([^;]*\);/s;
  
  if (filterCallPattern.test(code.value)) {
    // Replace existing filter call
    code.value = code.value.replace(filterCallPattern, newFilterCode);
  } else {
    // Insert new filter call with proper fallback
    const lines = code.value.split('\n');
    const consoleIndex = lines.findIndex((l) => l.trim().startsWith('console.log'));
    
    if (consoleIndex > 0) {
      lines.splice(consoleIndex, 0, '', newFilterCode);
      code.value = lines.join('\n');
    } else {
      // Fallback: append at the end
      code.value += `\n\n${newFilterCode}\n\nconsole.log(result);`;
    }
  }
  // ...
};
```

### 2. Improved `buildRuleExpression` in useFilterBuilder.ts

**Before:**
```typescript
const buildRuleExpression = (rule: BuilderRule): string => {
  // ... returned formatted string like '{ "field": { "$op": value } }'
  return `{ "${field}": { "${operator}": ${value} } }`;
};
```

**After:**
```typescript
const buildRuleExpression = (rule: BuilderRule): Record<string, any> => {
  // ... returns proper JavaScript object
  return { [field]: { [operator]: value } };
};
```

### 3. Updated `generatedExpression` computed property

**Before:**
```typescript
const generatedExpression = computed(() => {
  // ... had to JSON.parse string expressions
  const expr = buildRuleExpression(rule);
  return JSON.parse(expr); // Could fail
});
```

**After:**
```typescript
const generatedExpression = computed(() => {
  // ... directly works with objects
  const ruleObj = buildRuleExpression(validRules[0]);
  return JSON.stringify(ruleObj, null, 2);
});
```

## Benefits

1. ✅ **More Robust**: Better regex pattern handles multi-line filter expressions
2. ✅ **Type Safe**: Returns objects instead of strings, avoiding JSON parsing errors
3. ✅ **Better Error Handling**: Proper fallback when console.log is not found
4. ✅ **Cleaner Code**: Simpler logic without string concatenation and parsing
5. ✅ **Supports Complex Expressions**: Handles nested objects and arrays correctly

## Testing

Added comprehensive unit tests in `docs/.vitepress/theme/__tests__/useFilterBuilder.test.ts`:

- ✅ Single rule generation
- ✅ Multiple rules with logical operators
- ✅ Array operators ($in, $nin)
- ✅ Boolean value handling
- ✅ Add/remove rules
- ✅ Clear builder

## Verification Steps

1. Open the playground at http://localhost:5174/playground/
2. Click the filter builder icon (funnel icon)
3. Select a dataset
4. Add filter rules
5. Click "Apply to Code"
6. Verify the generated filter expression appears in the code editor
7. Verify the output shows the filtered results

## Files Changed

- `docs/.vitepress/theme/components/Playground.vue` - Fixed `handleApplyFilter` function
- `docs/.vitepress/theme/composables/useFilterBuilder.ts` - Improved expression generation
- `docs/.vitepress/theme/__tests__/useFilterBuilder.test.ts` - Added unit tests

## TypeScript Compilation

All changes pass TypeScript strict mode compilation:

```bash
pnpm typecheck
# ✓ No errors
```
