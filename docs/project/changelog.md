# Changelog

All notable changes to @mcabreradev/filter are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.6.0] - 2025-11-01

### Added
- **Geospatial Operators**: Location-based filtering with three powerful spatial operators
  - `$near`: Find points within radius with optional min/max distance
  - `$geoBox`: Bounding box queries for rectangular areas
  - `$geoPolygon`: Polygon containment using ray casting algorithm
- **Distance Calculation**: Spherical law of cosines for accurate distance measurement
  - `calculateDistance(p1, p2)` function for manual distance calculation
  - Earth radius: 6,371,000 meters
  - Returns distance in meters
- **Coordinate Validation**: Automatic validation of geographic coordinates
  - `isValidGeoPoint(point)` function for coordinate validation
  - Latitude range: -90 to 90
  - Longitude range: -180 to 180
- **Geospatial Utilities**: Direct access to geospatial evaluation functions
  - `evaluateNear(point, query)` for proximity checks
  - `evaluateGeoBox(point, box)` for bounding box checks
  - `evaluateGeoPolygon(point, query)` for polygon containment checks
- **TypeScript Support**: Full type definitions for geospatial types
  - `GeoPoint` interface for coordinates
  - `NearQuery`, `BoundingBox`, `PolygonQuery` interfaces
  - `GeospatialOperators` type for operator support
- **Documentation**: Complete geospatial operators guide with examples
  - Restaurant finder examples
  - Delivery zone validation
  - Property search use cases
  - IoT device monitoring patterns

### Changed
- Updated operator count from 18+ to 21+ operators
- Enhanced type system to recognize GeoPoint types
- Improved autocomplete for geospatial operators on GeoPoint properties
- Extended constants to include geospatial operator keys

### Performance
- Fast distance calculation using spherical law of cosines
- Efficient ray casting algorithm for polygon containment
- Optimized bounding box checks
- Compatible with lazy evaluation for large datasets

### Testing
- Added 26 new comprehensive tests
- Total test count: 523 tests (previously 497)
- 100% code coverage for geospatial features
- Edge case testing for invalid coordinates and missing data

## [5.5.1] - 2025-10-30

### Fixed
- Bug fixes and stability improvements
- Build optimization issues
- Type definition exports

### Changed
- Updated documentation with latest features
- Improved error messages
- Enhanced performance for array operations

## [5.5.0] - 2025-10-28

### Added
- **Array OR Syntax**: Intuitive array-based OR filtering without explicit `$in` operator
  - `filter(products, { category: ['Electronics', 'Books'] })`
  - Supports wildcards within array values
  - Works with strings, numbers, booleans
  - 100% backward compatible with existing syntax
- **Visual Debugging**: Built-in debug mode with expression tree visualization
  - `debug` option to enable debug mode
  - `verbose` option for detailed evaluation info
  - `showTimings` option to display execution timings
  - `colorize` option for ANSI color support in output
  - `filterDebug` function for programmatic access to debug information
- **Interactive Playground**: New online playground for testing filters live
  - Real-time filter testing
  - Code examples and templates
  - Share filter expressions via URL
- **Debug Analytics**: Performance metrics and condition tracking
  - Execution time measurement
  - Conditions evaluated counter
  - Match statistics (matched/total/percentage)
  - Expression tree visualization

### Changed
- Enhanced array operator performance
- Improved type inference for array expressions
- Optimized debug tree building
- Better error messages for invalid expressions

### Fixed
- Edge cases with empty arrays in expressions
- Type inference issues with array OR syntax
- Debug output formatting inconsistencies

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

