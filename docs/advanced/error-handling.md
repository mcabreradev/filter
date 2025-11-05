# Error Handling Guide

@mcabreradev/filter provides comprehensive error handling with custom error classes that provide detailed context and helpful messages.

## Error Classes

### FilterError (Base Class)

Base error class for all filter-related errors.

```typescript
import { FilterError } from '@mcabreradev/filter';

try {
  // Your filter code
} catch (error) {
  if (error instanceof FilterError) {
    console.log(error.code);      // Error code
    console.log(error.context);   // Additional context
    console.log(error.toJSON());  // Serializable format
  }
}
```

### InvalidExpressionError

Thrown when filter expression is invalid.

```typescript
import { filter, InvalidExpressionError } from '@mcabreradev/filter';

try {
  filter(users, { age: { $invalidOp: 30 } });
} catch (error) {
  if (error instanceof InvalidExpressionError) {
    console.log(error.validationErrors);  // Array of validation errors
    console.log(error.context.expression); // The invalid expression
  }
}
```

### OperatorError

Thrown when operator usage is incorrect.

```typescript
import { filter, OperatorError } from '@mcabreradev/filter';

try {
  filter(users, { age: { $gt: 'not-a-number' } });
} catch (error) {
  if (error instanceof OperatorError) {
    console.log(error.operator);  // '$gt'
    console.log(error.context.value); // 'not-a-number'
  }
}
```

### ValidationError

Thrown when validation fails.

```typescript
import { validateExpression, ValidationError } from '@mcabreradev/filter';

try {
  validateExpression(invalidExpression);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.field);   // Field that failed
    console.log(error.errors);  // Array of error messages
  }
}
```

### TypeMismatchError

Thrown when type mismatch occurs.

```typescript
import { filter, TypeMismatchError } from '@mcabreradev/filter';

try {
  filter('not-an-array', { name: 'John' });
} catch (error) {
  if (error instanceof TypeMismatchError) {
    console.log(error.expected);  // 'array'
    console.log(error.received);  // 'string'
    console.log(error.field);     // Field name if applicable
  }
}
```

### GeospatialError

Thrown when geospatial operation fails.

```typescript
import { filter, GeospatialError } from '@mcabreradev/filter';

try {
  filter(locations, {
    location: {
      $near: {
        center: { lat: 91, lng: 200 },  // Invalid coordinates
        maxDistanceMeters: 1000
      }
    }
  });
} catch (error) {
  if (error instanceof GeospatialError) {
    console.log(error.coordinates);  // Invalid coordinates
  }
}
```

### ConfigurationError

Thrown when configuration is invalid.

```typescript
import { filter, ConfigurationError } from '@mcabreradev/filter';

try {
  filter(users, { name: 'John' }, { maxDepth: -1 });
} catch (error) {
  if (error instanceof ConfigurationError) {
    console.log(error.option);  // 'maxDepth'
  }
}
```

### PerformanceLimitError

Thrown when performance limits are exceeded.

```typescript
import { PerformanceLimitError } from '@mcabreradev/filter';

try {
  // Operation that exceeds performance limits
} catch (error) {
  if (error instanceof PerformanceLimitError) {
    console.log(error.limit);   // Performance limit
    console.log(error.actual);  // Actual value
  }
}
```

## Error Helpers

### isFilterError

Check if error is a FilterError.

```typescript
import { isFilterError } from '@mcabreradev/filter';

try {
  // Your code
} catch (error) {
  if (isFilterError(error)) {
    console.log('Filter error:', error.code);
  }
}
```

### getUserFriendlyMessage

Get user-friendly error message.

```typescript
import { getUserFriendlyMessage } from '@mcabreradev/filter';

try {
  filter(users, invalidExpression);
} catch (error) {
  const friendlyMessage = getUserFriendlyMessage(error);
  // Display to user: "The filter expression is invalid. Please check the syntax and try again."
}
```

### extractErrorDetails

Extract error details for logging.

```typescript
import { extractErrorDetails } from '@mcabreradev/filter';

try {
  filter(users, expression);
} catch (error) {
  const details = extractErrorDetails(error);
  console.log({
    message: details.message,
    code: details.code,
    context: details.context,
    stack: details.stack
  });
}
```

### wrapError

Wrap unknown errors in FilterError.

```typescript
import { wrapError } from '@mcabreradev/filter';

try {
  // Third-party code
} catch (error) {
  const wrappedError = wrapError(error, { operation: 'filter' });
  throw wrappedError;
}
```

## Error Codes

All errors have standardized error codes:

```typescript
import { ErrorCodes } from '@mcabreradev/filter';

console.log(ErrorCodes.INVALID_EXPRESSION);    // 'INVALID_EXPRESSION'
console.log(ErrorCodes.OPERATOR_ERROR);        // 'OPERATOR_ERROR'
console.log(ErrorCodes.VALIDATION_ERROR);      // 'VALIDATION_ERROR'
console.log(ErrorCodes.CONFIGURATION_ERROR);   // 'CONFIGURATION_ERROR'
console.log(ErrorCodes.TYPE_MISMATCH);         // 'TYPE_MISMATCH'
console.log(ErrorCodes.GEOSPATIAL_ERROR);      // 'GEOSPATIAL_ERROR'
console.log(ErrorCodes.PERFORMANCE_LIMIT);     // 'PERFORMANCE_LIMIT'
```

## Best Practices

### 1. Type-Safe Error Handling

```typescript
import {
  filter,
  InvalidExpressionError,
  OperatorError,
  ValidationError
} from '@mcabreradev/filter';

try {
  const result = filter(users, expression);
} catch (error) {
  if (error instanceof InvalidExpressionError) {
    // Handle invalid expression
    console.error('Invalid expression:', error.context.expression);
  } else if (error instanceof OperatorError) {
    // Handle operator error
    console.error('Operator error:', error.operator);
  } else if (error instanceof ValidationError) {
    // Handle validation error
    console.error('Validation error:', error.errors);
  } else {
    // Handle unknown error
    console.error('Unknown error:', error);
  }
}
```

### 2. Error Logging

```typescript
import { filter, extractErrorDetails } from '@mcabreradev/filter';

try {
  filter(users, expression);
} catch (error) {
  const details = extractErrorDetails(error);
  
  // Log to monitoring service
  logger.error('Filter error', {
    code: details.code,
    message: details.message,
    context: details.context,
    stack: details.stack
  });
}
```

### 3. User-Friendly Messages

```typescript
import { filter, getUserFriendlyMessage } from '@mcabreradev/filter';

try {
  filter(users, expression);
} catch (error) {
  // Show friendly message to user
  toast.error(getUserFriendlyMessage(error));
  
  // Log technical details for debugging
  console.error(error);
}
```

### 4. Error Recovery

```typescript
import { filter, InvalidExpressionError } from '@mcabreradev/filter';

function safeFilter<T>(array: T[], expression: unknown, fallback: T[] = []) {
  try {
    return filter(array, expression);
  } catch (error) {
    if (error instanceof InvalidExpressionError) {
      console.warn('Invalid expression, using fallback:', error.message);
      return fallback;
    }
    throw error;
  }
}
```

### 5. Validation Before Filtering

```typescript
import { validateExpression, filter } from '@mcabreradev/filter';

function filterWithValidation<T>(array: T[], expression: unknown) {
  try {
    // Validate expression first
    const validated = validateExpression(expression);
    
    // Then filter
    return filter(array, validated);
  } catch (error) {
    // Handle validation errors
    console.error('Validation failed:', error);
    throw error;
  }
}
```

## Error Serialization

All errors can be serialized to JSON:

```typescript
import { filter } from '@mcabreradev/filter';

try {
  filter(users, expression);
} catch (error) {
  if (error instanceof FilterError) {
    const json = error.toJSON();
    
    // Send to API
    fetch('/api/error-report', {
      method: 'POST',
      body: JSON.stringify(json)
    });
  }
}
```

## TypeScript Support

Full TypeScript support with type guards:

```typescript
import type { FilterError } from '@mcabreradev/filter';
import { isFilterError } from '@mcabreradev/filter';

function handleError(error: unknown): void {
  if (isFilterError(error)) {
    // TypeScript knows error is FilterError
    console.log(error.code);
    console.log(error.context);
  }
}
```

## Integration Examples

### React

```typescript
import { useState } from 'react';
import { filter, getUserFriendlyMessage } from '@mcabreradev/filter';

function UserList({ users }) {
  const [error, setError] = useState<string | null>(null);

  const handleFilter = (expression: unknown) => {
    try {
      const filtered = filter(users, expression);
      setError(null);
      return filtered;
    } catch (err) {
      setError(getUserFriendlyMessage(err));
      return [];
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* ... */}
    </div>
  );
}
```

### Express.js

```typescript
import { filter, extractErrorDetails } from '@mcabreradev/filter';

app.post('/api/filter', (req, res) => {
  try {
    const result = filter(data, req.body.expression);
    res.json({ success: true, data: result });
  } catch (error) {
    const details = extractErrorDetails(error);
    
    res.status(400).json({
      success: false,
      error: {
        code: details.code,
        message: details.message
      }
    });
  }
});
```

---

**See Also:**
- [Performance Monitoring Guide](./performance-monitoring.md)
- [API Reference](../api/reference.md)
- [Troubleshooting](./wiki.md#troubleshooting)
