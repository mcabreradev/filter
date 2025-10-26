# Changelog

All notable changes to @mcabreradev/filter are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.4.0] - 2024-10-26

### Added
- Comprehensive documentation overhaul
- Migration guide for v5.4
- Framework-specific SSR guides
- Troubleshooting guide
- Configuration reference
- FAQ section
- Best practices guide

### Changed
- Updated React integration documentation
- Updated Vue integration documentation
- Updated Svelte integration documentation
- Improved API reference clarity

### Fixed
- Documentation API inconsistencies
- Outdated code examples
- Missing TypeScript type references

## [5.3.0] - 2024-09-15

### Added
- Pagination support for all framework integrations
- `usePaginatedFilter` hook for React
- `usePaginatedFilter` composable for Vue
- `usePaginatedFilter` store for Svelte
- Pagination state management (`currentPage`, `totalPages`, `pageSize`)
- Pagination actions (`nextPage`, `previousPage`, `goToPage`, `setPageSize`)

### Changed
- Improved performance for large datasets
- Enhanced memoization strategy

### Fixed
- Memory leak in memoization cache
- Type inference issues with generic components

## [5.2.0] - 2024-08-10

### Added
- Debounced filtering support
- `useDebouncedFilter` hook for React
- `useDebouncedFilter` composable for Vue
- `useDebouncedFilter` store for Svelte
- `isPending` state for debounced operations
- Configurable delay option

### Changed
- Optimized re-render behavior in React
- Improved reactivity in Vue
- Enhanced store updates in Svelte

## [5.1.0] - 2024-07-05

### Added
- `useFilteredState` hook for React
- `useFilteredState` composable for Vue
- `useFilteredState` store for Svelte
- State management for data and expressions
- Setter functions for dynamic updates

### Changed
- Improved TypeScript type inference
- Enhanced documentation with more examples

### Fixed
- Edge case with empty arrays
- Null/undefined handling in expressions

## [5.0.0] - 2024-06-01

### Breaking Changes
- Renamed `data` to `filtered` in return values
- Removed `isError` and `error` from return values
- Changed `isLoading` to `isFiltering`
- Updated minimum TypeScript version to 4.9+
- Updated minimum React version to 18.0+
- Updated minimum Vue version to 3.0+

### Added
- Full TypeScript rewrite
- Improved type safety and inference
- Better error messages
- Performance optimizations
- Tree-shaking support

### Changed
- Simplified API surface
- Improved documentation
- Enhanced test coverage to 100%

### Migration Guide
See [Migration Guide v5.4](/guide/migration-v2) for detailed migration instructions.

## [4.5.0] - 2024-04-15

### Added
- Lazy evaluation support
- `createLazyFilter` function
- Chainable lazy operations
- Memory optimization for large datasets

### Changed
- Improved operator processing performance
- Enhanced memoization algorithm

## [4.4.0] - 2024-03-10

### Added
- Nested object filtering support
- Dot notation for property access
- Deep comparison utilities
- Array filtering within objects

### Fixed
- Nested property access edge cases
- Deep equality comparison issues

## [4.3.0] - 2024-02-05

### Added
- Custom operator registration
- `registerOperator` function
- Operator extension API
- Plugin system foundation

### Changed
- Refactored operator processing
- Improved operator type definitions

## [4.2.0] - 2024-01-15

### Added
- String operators: `$startsWith`, `$endsWith`, `$contains`
- Case-insensitive string matching option
- Regular expression operator `$regex`

### Fixed
- String comparison edge cases
- Unicode string handling

## [4.1.0] - 2023-12-10

### Added
- Array operators: `$in`, `$nin`
- Logical operators: `$and`, `$or`, `$not`
- Complex expression support
- Nested logical operations

### Changed
- Improved expression parsing
- Enhanced type safety for operators

## [4.0.0] - 2023-11-01

### Breaking Changes
- Removed jQuery-style API
- Changed expression format to object-based
- Updated operator syntax

### Added
- Modern operator-based API
- TypeScript support
- Framework integrations (React, Vue, Svelte)
- Comprehensive test suite

### Changed
- Complete API redesign
- Improved performance
- Better documentation

## [3.x] - Legacy Versions

Previous versions (3.x and below) used a different API and are no longer maintained.

For historical changes, see [GitHub Releases](https://github.com/mcabreradev/filter/releases).

## Upgrade Guides

- [v4 to v5 Migration](/guide/migration-v2)
- [v3 to v4 Migration](/guide/migration-v1) (archived)

## Support Policy

- **Current version (5.x)**: Full support, active development
- **Previous version (4.x)**: Security fixes only until 2025-06-01
- **Older versions (3.x and below)**: No longer supported

## Contributing

See [Contributing Guide](/project/contributing) for information on how to contribute to this project.

## License

MIT License - see [LICENSE](/project/license) for details.

