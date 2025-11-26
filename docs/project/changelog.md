# Changelog

All notable changes to @mcabreradev/filter are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.8.2] - 2025-11-17

### Documentation
- **Comprehensive Documentation Update**: Complete overhaul of documentation structure
  - Consolidated all operator documentation into single comprehensive guide
  - Expanded API Reference with 40+ exported functions documented
  - Updated all version references from v5.6.0 to v5.8.2
  - Added exhaustive examples for all 40+ operators (comparison, array, string, logical, geospatial, datetime)
  - Documented all Performance Monitoring, Type Helpers, and DateTime utilities
  - Completed configuration guide with orderBy and limit options
  - Updated framework integration guides for React, Vue, Svelte, Angular, SolidJS, and Preact
- **Performance Documentation**: Added detailed performance considerations section
  - Operator performance rankings (fastest to slowest)
  - Best practices for optimization
  - Caching strategies and benchmarks
  - Lazy evaluation patterns

### Changed
- Updated documentation structure for better navigation and discoverability
- Improved TypeScript examples with comprehensive type coverage
- Enhanced operator examples with real-world use cases

## [5.8.1] - 2025-11-15

### Fixed
- Minor documentation fixes and typo corrections
- Improved error messages for invalid geospatial coordinates
- Fixed type inference for nested object expressions

### Changed
- Updated dependencies to latest stable versions
- Improved bundle size optimization

## [5.8.3] - 2025-11-26

### Bug Fixes
- **Cache**: Fixed critical issue where `limit` option was ignored in cache key. Requests with different limits now correctly generate distinct cache keys.

### Performance Improvements
- **Memory**: Replaced unbounded `Map` caches with `LRUCache` strategy.
  - `FilterCache`: Limited to 100 entries per source array.
  - `RegexCache`: Limited to 500 compiled patterns.
- **Stability**: Prevented memory leaks in long-running applications with dynamic queries.

## [5.8.0] - 2025-11-10

### Added
- **OrderBy and Limit Options**: Enhanced configuration system
  - Full support for single and multi-field sorting
  - Nested path sorting with dot notation (e.g., 'profile.age')
  - Limit option for result pagination and performance
  - Works seamlessly with all operators and expression types
- **Enhanced Type System**: Improved TypeScript inference
  - Better autocomplete for operator expressions
  - Stricter type checking for geospatial and datetime operators
  - Full generic support for custom types

### Changed
- Optimized internal sorting algorithms for better performance
- Improved cache key generation for orderBy and limit combinations
- Updated all framework integrations to support orderBy and limit

### Performance
- OrderBy uses stable sort algorithm (10-15% faster than v5.7.0)
- Limit applies after filtering/sorting (minimal overhead)
- Cache efficiency improved for complex queries with orderBy

## [5.7.1] - 2025-11-08

### Fixed
- **$contains Operator**: Fixed type detection edge cases
  - Improved string vs array context detection
  - Better handling of undefined values
  - Fixed false positives with mixed type expressions
- **Framework Integrations**: Minor bug fixes
  - Fixed Angular pipe change detection issues
  - Improved SolidJS signal reactivity
  - Fixed Preact hook re-render optimization

### Changed
- Improved error messages for invalid expressions
- Better TypeScript type inference for logical operators

## [5.7.0] - 2025-11-06

### Added
- **Framework Integrations**: Angular, SolidJS, and Preact support
  - **Angular**: Services and Pipes with Signals support
    - `FilterService`: Core filtering service with Signal-based state
    - `DebouncedFilterService`: Debounced filtering with configurable delay
    - `PaginatedFilterService`: Built-in pagination with reactive state
    - `FilterPipe`: Declarative filtering in templates
  - **SolidJS**: Signal-based reactive hooks
    - `useFilter`: Signal-based reactive filtering
    - `useDebouncedFilter`: Debounced filtering with pending state
    - `usePaginatedFilter`: Pagination support with reactive signals
  - **Preact**: Lightweight hooks API
    - `useFilter`: Basic filtering with memoization
    - `useFilteredState`: Stateful filtering
    - `useDebouncedFilter`: Debounced search functionality
    - `usePaginatedFilter`: Built-in pagination
- **OrderBy Configuration**: New `orderBy` option to sort filtered results
  - Single field sorting: `{ orderBy: 'age' }` (ascending by default)
  - Descending sort: `{ orderBy: { field: 'age', direction: 'desc' } }`
  - Multi-field sorting: `{ orderBy: [{ field: 'city', direction: 'asc' }, { field: 'age', direction: 'desc' }] }`
  - Respects `caseSensitive` option for string comparisons
  - Stable sort algorithm preserves original order for equal values
  - Works with all expression types and operators
- **Limit Configuration**: New `limit` option to restrict result count
  - Applied after filtering and sorting for predictable results
  - Works with all expression types and operators
  - Compatible with caching and debug modes
  - Full framework integration support (React, Vue, Svelte, Angular, SolidJS, Preact)
- **Complete Documentation**:
  - Angular integration guide with services, pipes, and SSR examples
  - SolidJS integration guide with signal patterns and SolidStart SSR
  - Preact integration guide with hooks and best practices
  - OrderBy configuration documentation with examples
  - Limit configuration documentation with examples
  - Updated Quick Start guide with new features

### Fixed
- **$contains Operator**: Fixed type detection to distinguish between string and array contexts
  - Enhanced `hasArrayOps` to check actual value types (not just operator presence)
  - Enhanced `hasStringOps` to check actual value types
  - Correctly handles `$contains` for both strings (`'hello'.includes('ell')`) and arrays (`[1,2,3].includes(2)`)
  - Fixed edge case where undefined properties would incorrectly pass $contains checks

### Changed
- Updated framework integrations documentation to v5.7.0
- Updated README with all new features (Angular, SolidJS, Preact, orderBy, limit)
- Updated configuration guide with orderBy and limit sections
- Improved Quick Start guide with sorting and limiting examples

### Performance
- OrderBy uses efficient comparison functions
- Limit applies slice operation after filtering (minimal overhead)
- Framework integrations use proper memoization strategies

### Testing
- Added 33 comprehensive tests for limit functionality
- Added tests for orderBy with limit combinations
- Fixed integration tests for $contains operator with proper type checking
- **Total Tests**: 994 (985 passing, 9 skipped for browser-only SolidJS reactivity)
- 100% code coverage for orderBy and limit features

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
- Updated operator count from 18+ to 30+ operators
- Enhanced type system to recognize GeoPoint and Date types
- Improved autocomplete for geospatial and datetime operators
- Extended constants to include all operator keys

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

### Datetime Operators
- **Relative Time Filtering**: Filter by last/next N days/hours/minutes
  - `$recent`: Find events in the last N days/hours/minutes
  - `$upcoming`: Find events in the next N days/hours/minutes
- **Day-of-Week Filtering**: Filter by specific days (Monday-Sunday)
  - `$dayOfWeek`: Filter by day of week (0-6, Sunday-Saturday)
  - `$isWeekday`: Filter for Monday-Friday
  - `$isWeekend`: Filter for Saturday-Sunday
- **Time-of-Day Filtering**: Filter by hour ranges (0-23)
  - `$timeOfDay`: Filter by hour range (e.g., business hours 9-17)
- **Age Calculation**: Calculate age in years/months/days
  - `$age`: Calculate age from birth date with min/max ranges
- **Date Comparison**: Before/after filtering
  - `$isBefore`: Check if date is before specified date
  - `$isAfter`: Check if date is after specified date
- **TypeScript Support**: Context-aware autocomplete for Date properties
  - Full type definitions for all datetime operators
  - Intelligent operator suggestions based on property types
  - Type-safe query building with DateTimeOperators
- **Zero Dependencies**: Uses native Date API
  - No external libraries required
  - Lightweight implementation
  - Cross-platform compatibility
- **Documentation**: Complete datetime operators guide
  - Event scheduling examples
  - User filtering by age
  - Business hours filtering
  - Weekend/weekday filtering patterns

### Testing (Enhanced)
- Added 90 new comprehensive tests for datetime operators
- Total test count: 613+ tests (previously 523)
- 100% code coverage for all datetime features
- Edge case testing for timezones, leap years, and invalid dates

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

