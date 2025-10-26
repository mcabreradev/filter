# Operator Autocomplete

The library provides intelligent operator autocomplete based on the type of each property. TypeScript will automatically suggest only the valid operators for each data type.

## Preview

```typescript
// When you type this in your editor:
filter(users, {
  age: { $ // <- Press Ctrl+Space here

// TypeScript shows:
// ┌─────────────────────────────────────┐
// │ ✓ $gt     - Greater than           │
// │ ✓ $gte    - Greater than or equal  │
// │ ✓ $lt     - Less than              │
// │ ✓ $lte    - Less than or equal     │
// │ ✓ $eq     - Equal                  │
// │ ✓ $ne     - Not equal              │
// └─────────────────────────────────────┘
```

Only valid operators for numbers! You won't see `$startsWith` or `$regex` because they don't make sense for numbers.

## How It Works

The type system analyzes each property of your interface and provides the appropriate operators:

- **Strings**: `$startsWith`, `$endsWith`, `$contains`, `$regex`, `$match`, `$eq`, `$ne`
- **Numbers**: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`
- **Dates**: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`
- **Arrays**: `$in`, `$nin`, `$contains`, `$size`
- **Booleans**: `$eq`, `$ne`

## Usage Examples

### Numeric Operators

```typescript
interface User {
  age: number;
  score: number;
}

const users: User[] = [];

// TypeScript autocompletes: $gt, $gte, $lt, $lte, $eq, $ne
filter(users, {
  age: {
    $gte: 18,  // ✅ Valid
    $lt: 65    // ✅ Valid
  }
});
```

### String Operators

```typescript
interface Product {
  name: string;
  category: string;
}

const products: Product[] = [];

// TypeScript autocompletes: $startsWith, $endsWith, $contains, $regex, $match, $eq, $ne
filter(products, {
  name: {
    $startsWith: 'Laptop',  // ✅ Valid
    $regex: /^Lap/i         // ✅ Valid
  }
});
```

### Array Operators

```typescript
interface User {
  tags: string[];
  roles: string[];
}

const users: User[] = [];

// TypeScript autocompletes: $in, $nin, $contains, $size
filter(users, {
  tags: {
    $contains: 'admin',  // ✅ Valid
    $size: 3             // ✅ Valid
  }
});
```

### Boolean Operators

```typescript
interface User {
  isActive: boolean;
  isPremium: boolean;
}

const users: User[] = [];

// TypeScript autocompletes: $eq, $ne
filter(users, {
  isActive: {
    $eq: true  // ✅ Valid
  }
});
```

### Date Operators

```typescript
interface Event {
  createdAt: Date;
  updatedAt: Date;
}

const events: Event[] = [];

// TypeScript autocompletes: $gt, $gte, $lt, $lte, $eq, $ne
filter(events, {
  createdAt: {
    $gte: new Date('2024-01-01'),  // ✅ Valid
    $lt: new Date('2025-01-01')    // ✅ Valid
  }
});
```

## Combining Operators

You can combine multiple operators in a single query:

```typescript
interface User {
  name: string;
  age: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
}

const users: User[] = [];

filter(users, {
  name: { $startsWith: 'John' },
  age: { $gte: 18, $lt: 65 },
  tags: { $contains: 'verified' },
  isActive: { $eq: true },
  createdAt: { $gte: new Date('2024-01-01') }
});
```

## Logical Operators

Logical operators are also available with autocomplete:

```typescript
filter(users, {
  $or: [
    { age: { $lt: 18 } },
    { age: { $gte: 65 } }
  ],
  isActive: { $eq: true }
});

filter(users, {
  $and: [
    { name: { $startsWith: 'A' } },
    { score: { $gt: 100 } }
  ]
});

filter(users, {
  $not: {
    isActive: { $eq: false }
  }
});
```

## Type Safety

The type system prevents errors at compile time:

```typescript
interface User {
  age: number;
  name: string;
}

// ❌ Error: $startsWith is not valid for numbers
filter(users, {
  age: {
    $startsWith: '25'  // TypeScript marks this as an error
  }
});

// ❌ Error: $gt is not valid for strings (although it technically works)
filter(users, {
  name: {
    $gt: 'John'  // TypeScript marks this as an error
  }
});
```

## Editor Support

Autocomplete works in any editor with TypeScript support:

- **VS Code/Cursor**: Press `Ctrl+Space` (Windows/Linux) or `Cmd+Space` (Mac)
- **WebStorm**: Autocomplete appears automatically
- **Vim/Neovim**: With LSP configured (coc.nvim, nvim-lsp)
- **Sublime Text**: With LSP-typescript

## Benefits

1. **Discovery**: Discover available operators without consulting documentation
2. **Error Prevention**: TypeScript prevents the use of incorrect operators
3. **Productivity**: Write code faster with intelligent suggestions
4. **Maintainability**: Code is easier to understand and maintain
5. **Safe Refactoring**: Type changes propagate automatically

## Notes

- Autocomplete is only a TypeScript feature at development time
- It doesn't affect bundle size or runtime performance
- It's 100% backward compatible with existing code
- Works with TypeScript interfaces, types, and classes

