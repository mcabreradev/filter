# Examples

This directory contains comprehensive examples demonstrating the usage of `@mcabreradev/filter` v5.1.0.

## Running Examples

### TypeScript Examples

To run the TypeScript examples with ts-node:

```bash
pnpm install -g ts-node
ts-node examples/operators-examples.ts
```

### Compiled Examples

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Compile the examples:
   ```bash
   tsc examples/operators-examples.ts --outDir examples/dist --esModuleInterop
   ```

3. Run the compiled example:
   ```bash
   node examples/dist/operators-examples.js
   ```

## Available Examples

### `operators-examples.ts`

Comprehensive examples showcasing all v5.0.0 operators:

- **Comparison Operators**: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`
- **Array Operators**: `$in`, `$nin`, `$contains`, `$size`
- **String Operators**: `$startsWith`, `$endsWith`, `$contains`
- **Combined Operators**: Multiple operators on same/different properties
- **Mixed Syntax**: Operators combined with legacy v3.x syntax
- **Real-World Scenarios**: E-commerce, inventory, and search use cases

### `lazy-evaluation-examples.ts` (v5.1.0+)

Comprehensive examples showcasing lazy evaluation features:

- **Basic Lazy Filtering**: Using `filterLazy` for on-demand processing
- **Early Exit Optimization**: Using `filterFirst` to stop after N matches
- **Existence Checks**: Using `filterExists` for fast boolean checks
- **Counting**: Using `filterCount` without creating result arrays
- **Chunked Processing**: Using `filterChunked` and `filterLazyChunked` for batch operations
- **Lazy Composition**: Combining `take`, `skip`, `map`, and other utilities
- **Pagination**: Building efficient pagination with lazy operations
- **Async Streams**: Using `filterLazyAsync` for async iterables
- **Performance Comparison**: Benchmarking lazy vs standard filtering
- **Memory Efficiency**: Demonstrating memory savings with large datasets

## Example Output

Running `operators-examples.ts` will output filtered results for 20 different scenarios, demonstrating:

1. Price range filtering
2. Date-based filtering
3. Category inclusion/exclusion
4. Tag-based searching
5. Name pattern matching
6. Complex multi-condition queries
7. Performance optimization patterns

## Further Reading

- [Full Operators Guide](../docs/OPERATORS.md)
- [Lazy Evaluation Guide](../docs/LAZY_EVALUATION.md)
- [Migration Guide](../docs/MIGRATION.md)
- [Main README](../README.md)

