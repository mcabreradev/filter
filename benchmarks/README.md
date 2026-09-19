# Benchmarks

Baseline performance suite for `@mcabreradev/filter`, built on [Vitest's benchmark API](https://vitest.dev/guide/features.html#benchmarking).

## Running

```bash
# all benchmarks
pnpm benchmark

# a single file
pnpm benchmark -- benchmarks/filter.bench.ts

# watch mode (useful while optimizing)
pnpm benchmark -- --watch
```

## What is measured

| File | Focus | Datasets |
|---|---|---|
| `filter.bench.ts` | Common expression throughput (string, wildcard, `$gte`, `$in`, `$and`) | 100 … 100K items |
| `cache.bench.ts` | Cache cold-vs-warm impact, dataset-size scaling | 1K … 100K |
| `operators.bench.ts` | Operator vs predicate, eager `filter` vs `filterLazy`, early exit vs `filterCount` | 100K |
| `wildcards.bench.ts` | Wildcard pattern cost (`%...`, `_`, plain) with cache on/off | 100K |

## Interpreting results

Benchmarks time **iterations per second + average latency per iteration**. Figures depend on
hardware (Node engine, JIT warm-up), so:

- Compare **relative** numbers (operator vs predicate, cache on vs off) rather than absolute.
- The suite targets **steady-state** filtering: cache is on by default to reflect real usage,
  and the dataset generator is deterministic (same seed every run) so runs are comparable.
- Do not chase isolated micro-optimisations; use these to catch **regressions** on large
  datasets and to validate claims like "caching is 530x–1520x faster".

## Regression detection

Benchmarks are not part of `pnpm test` / CI (they are timing-based and flaky in shared
runners). For local regression checking before a release, run the full suite and compare
against the values recorded in the last release.

> Tip: the `cache.bench.ts` "warm cache, repeated expression" case is the closest proxy for
> the 530x–1520x caching figure claimed in the docs.
