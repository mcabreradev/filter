# Best Practices

Guidelines and patterns for using @mcabreradev/filter effectively.

## General Principles

### 1. Use Type-Safe Expressions

Always provide generic type parameters for type safety:

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

const { filtered } = useFilter<User>(data, expression);
```

### 2. Memoize Expressions

Prevent unnecessary re-renders by memoizing expressions:

```typescript
const expression = useMemo(() => ({
  age: { $gte: 18 },
  status: { $eq: 'active' }
}), []);

const { filtered } = useFilter(data, expression);
```

### 3. Memoize Configuration

Memoize options objects to prevent re-computation:

```typescript
const options = useMemo(() => ({
  memoize: true,
  caseSensitive: false
}), []);

const { filtered } = useFilter(data, expression, options);
```

### 4. Use Appropriate Operators

Choose the right operator for your use case:

```typescript
const expression = {
  age: { $gte: 18 },
  name: { $regex: /john/i },
  tags: { $contains: 'javascript' },
  role: { $in: ['admin', 'user'] }
};
```

## React Best Practices

### Hook Dependencies

Always include proper dependencies:

```typescript
const expression = useMemo(() => ({
  status: { $eq: filterStatus }
}), [filterStatus]);

useEffect(() => {
  console.log('Filtered data:', filtered);
}, [filtered]);
```

### Avoid Inline Objects

Don't create objects inline in render:

```typescript
const MyComponent = () => {
  const { filtered } = useFilter(data, { age: { $gte: 18 } });

  return <UserList users={filtered} />;
};

const MyComponent = () => {
  const expression = useMemo(() => ({
    age: { $gte: 18 }
  }), []);

  const { filtered } = useFilter(data, expression);

  return <UserList users={filtered} />;
};
```

### Combine with Other Hooks

Integrate seamlessly with other React patterns:

```typescript
const UserFilter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minAge, setMinAge] = useState(18);

  const expression = useMemo(() => ({
    $and: [
      { name: { $regex: new RegExp(searchTerm, 'i') } },
      { age: { $gte: minAge } }
    ]
  }), [searchTerm, minAge]);

  const { filtered, isFiltering } = useFilter(users, expression, {
    memoize: true
  });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="number"
        value={minAge}
        onChange={(e) => setMinAge(Number(e.target.value))}
      />
      {isFiltering ? <Spinner /> : <UserList users={filtered} />}
    </div>
  );
};
```

### Use Debouncing for Search

Debounce user input to reduce filtering frequency:

```typescript
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const expression = useMemo(() => ({
    name: { $regex: new RegExp(searchTerm, 'i') }
  }), [searchTerm]);

  const { filtered, isPending } = useDebouncedFilter(users, expression, {
    delay: 300,
    memoize: true
  });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <Spinner />}
      <UserList users={filtered} />
    </div>
  );
};
```

### Implement Pagination

Use pagination for large datasets:

```typescript
const PaginatedList = () => {
  const {
    filtered,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage
  } = usePaginatedFilter(users, expression, 25, {
    memoize: true
  });

  return (
    <div>
      <UserList users={filtered} />
      <Pagination
        current={currentPage}
        total={totalPages}
        onNext={nextPage}
        onPrevious={previousPage}
        onGoTo={goToPage}
      />
    </div>
  );
};
```

## Vue Best Practices

### Use Reactive References

Ensure data and expressions are reactive:

```typescript
import { ref, computed } from 'vue';
import { useFilter } from '@mcabreradev/filter/vue';

const users = ref<User[]>([]);
const searchTerm = ref('');

const expression = computed(() => ({
  name: { $regex: new RegExp(searchTerm.value, 'i') }
}));

const { filtered } = useFilter(users, expression);
```

### Computed Properties

Use computed for derived state:

```typescript
const activeUsers = computed(() => {
  const expression = { status: { $eq: 'active' } };
  const { filtered } = useFilter(users.value, expression);
  return filtered.value;
});
```

### Watch for Changes

React to filter changes:

```typescript
import { watch } from 'vue';

const { filtered } = useFilter(users, expression);

watch(filtered, (newFiltered) => {
  console.log('Filtered data changed:', newFiltered);
});
```

## Svelte Best Practices

### Use Stores

Leverage Svelte stores for reactivity:

```typescript
import { writable } from 'svelte/store';
import { useFilter } from '@mcabreradev/filter/svelte';

const users = writable<User[]>([]);
const expression = writable({ status: { $eq: 'active' } });

const { filtered } = useFilter(users, expression);
```

### Reactive Statements

Use reactive statements for derived values:

```svelte
<script lang="ts">
  import { useFilter } from '@mcabreradev/filter/svelte';

  let searchTerm = '';

  $: expression = {
    name: { $regex: new RegExp(searchTerm, 'i') }
  };

  const { filtered } = useFilter(users, expression);
</script>

<input bind:value={searchTerm} />

{#each $filtered as user}
  <div>{user.name}</div>
{/each}
```

## Performance Optimization

### Enable Memoization for Large Datasets

```typescript
const { filtered } = useFilter(largeDataset, expression, {
  memoize: true
});
```

### Use Lazy Evaluation

For very large datasets, use lazy evaluation:

```typescript
import { createLazyFilter } from '@mcabreradev/filter';

const lazyFilter = createLazyFilter(data, expression);
const first100 = lazyFilter.take(100).toArray();
```

### Paginate Large Results

```typescript
const { filtered } = usePaginatedFilter(data, expression, 50);
```

### Clear Cache When Needed

```typescript
import { clearMemoizationCache } from '@mcabreradev/filter';

useEffect(() => {
  return () => {
    clearMemoizationCache();
  };
}, []);
```

## Expression Patterns

### Simple Equality

```typescript
const expression = {
  status: { $eq: 'active' }
};
```

### Multiple Conditions (AND)

```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { status: { $eq: 'active' } },
    { role: { $in: ['admin', 'user'] } }
  ]
};
```

### Multiple Conditions (OR)

```typescript
const expression = {
  $or: [
    { role: { $eq: 'admin' } },
    { permissions: { $contains: 'write' } }
  ]
};
```

### Negation

```typescript
const expression = {
  $not: {
    status: { $eq: 'deleted' }
  }
};
```

### Nested Objects

```typescript
const expression = {
  'address.city': { $eq: 'New York' },
  'profile.age': { $gte: 18 }
};

const expression = {
  address: {
    city: { $eq: 'New York' }
  }
};
```

### Array Operations

```typescript
const expression = {
  tags: { $contains: 'javascript' },
  roles: { $in: ['admin', 'moderator'] }
};
```

### String Matching

```typescript
const expression = {
  name: { $regex: /john/i },
  email: { $endsWith: '@example.com' },
  username: { $startsWith: 'user_' }
};
```

### Range Queries

```typescript
const expression = {
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } }
  ]
};
```

## Error Handling

### Validate Data

```typescript
const { filtered } = useFilter(data ?? [], expression);
```

### Handle Empty Results

```typescript
const { filtered } = useFilter(data, expression);

if (filtered.length === 0) {
  return <EmptyState />;
}

return <UserList users={filtered} />;
```

### Debug Mode

Enable debug mode during development:

```typescript
const { filtered } = useFilter(data, expression, {
  debug: process.env.NODE_ENV === 'development'
});
```

## Testing

### Test Filter Logic

```typescript
import { render, screen } from '@testing-library/react';
import { useFilter } from '@mcabreradev/filter/react';

test('filters users by age', () => {
  const TestComponent = () => {
    const { filtered } = useFilter(mockUsers, {
      age: { $gte: 18 }
    });

    return <div>{filtered.length}</div>;
  };

  render(<TestComponent />);
  expect(screen.getByText('2')).toBeInTheDocument();
});
```

### Mock the Hook

```typescript
jest.mock('@mcabreradev/filter/react', () => ({
  useFilter: jest.fn(() => ({
    filtered: mockFilteredData,
    isFiltering: false
  }))
}));
```

### Test Edge Cases

```typescript
test('handles empty arrays', () => {
  const { filtered } = useFilter([], expression);
  expect(filtered).toEqual([]);
});

test('handles null values', () => {
  const data = [{ age: null }, { age: 25 }];
  const { filtered } = useFilter(data, { age: { $gt: 20 } });
  expect(filtered).toEqual([{ age: 25 }]);
});
```

## Code Organization

### Extract Filter Logic

```typescript
const useUserFilters = (users: User[], filters: UserFilters) => {
  const expression = useMemo(() => ({
    $and: [
      filters.status && { status: { $eq: filters.status } },
      filters.minAge && { age: { $gte: filters.minAge } },
      filters.searchTerm && {
        name: { $regex: new RegExp(filters.searchTerm, 'i') }
      }
    ].filter(Boolean)
  }), [filters]);

  return useFilter(users, expression, { memoize: true });
};
```

### Create Reusable Expressions

```typescript
const ACTIVE_USERS_EXPRESSION = {
  status: { $eq: 'active' }
};

const ADULT_USERS_EXPRESSION = {
  age: { $gte: 18 }
};

const ACTIVE_ADULT_USERS_EXPRESSION = {
  $and: [
    ACTIVE_USERS_EXPRESSION,
    ADULT_USERS_EXPRESSION
  ]
};
```

### Use Configuration Builder

```typescript
import { createFilterConfig } from '@mcabreradev/filter';

const getFilterConfig = () => createFilterConfig()
  .withMemoization(true)
  .withCaseSensitivity(false)
  .withDebug(process.env.NODE_ENV === 'development')
  .build();

const config = getFilterConfig();
```

## Common Pitfalls

### ❌ Creating Objects in Render

```typescript
const { filtered } = useFilter(data, { age: { $gte: 18 } });
```

### ✅ Memoize Expressions

```typescript
const expression = useMemo(() => ({ age: { $gte: 18 } }), []);
const { filtered } = useFilter(data, expression);
```

### ❌ Missing Dependencies

```typescript
useEffect(() => {
  console.log(filtered);
}, []);
```

### ✅ Include All Dependencies

```typescript
useEffect(() => {
  console.log(filtered);
}, [filtered]);
```

### ❌ Not Handling Empty Data

```typescript
const { filtered } = useFilter(data, expression);
```

### ✅ Provide Default Values

```typescript
const { filtered } = useFilter(data ?? [], expression);
```

## Related Resources

- [Configuration Guide](/guide/configuration)
- [Troubleshooting](/guide/troubleshooting)
- [Performance Optimization](/advanced/performance)
- [API Reference](/api/core)

