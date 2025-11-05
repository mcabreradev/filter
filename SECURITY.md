# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 5.6.x   | :white_check_mark: |
| 5.5.x   | :white_check_mark: |
| 5.4.x   | :warning: Critical fixes only |
| < 5.4   | :x: No longer supported |

## Reporting a Vulnerability

We take the security of @mcabreradev/filter seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT Create a Public Issue

**Please do not report security vulnerabilities through public GitHub issues.**

### 2. Report Privately

Send your vulnerability report to:

**Email:** security@mcabreradev.com

**Subject:** [SECURITY] Brief description of the issue

### 3. Include These Details

- **Description:** Clear description of the vulnerability
- **Impact:** What an attacker could achieve
- **Steps to Reproduce:** Detailed steps to reproduce the issue
- **Proof of Concept:** Code example demonstrating the vulnerability
- **Environment:** Version of @mcabreradev/filter affected
- **Suggested Fix:** If you have ideas for fixing the issue

### Example Report

```
Subject: [SECURITY] SQL-like injection via filter expression

Description:
Unsanitized user input in filter expressions could allow malicious patterns
that cause excessive memory usage or CPU consumption.

Impact:
Denial of Service (DoS) through resource exhaustion

Steps to Reproduce:
1. Create a filter with deeply nested operators
2. Pass extremely large arrays in $in operator
3. Observe memory/CPU spike

Proof of Concept:
[Code example]

Environment:
- @mcabreradev/filter: 5.6.0
- Node.js: 20.0.0

Suggested Fix:
Add limits on expression depth and array sizes
```

## Response Timeline

- **Acknowledgment:** Within 48 hours of your report
- **Initial Assessment:** Within 7 days
- **Regular Updates:** Every 7 days until resolution
- **Disclosure:** Coordinated disclosure after fix is released

## Security Best Practices

When using @mcabreradev/filter in production:

### 1. Validate User Input

```typescript
import { validateExpression, InvalidExpressionError } from '@mcabreradev/filter';

try {
  const expression = validateExpression(userInput);
  const results = filter(data, expression);
} catch (error) {
  if (error instanceof InvalidExpressionError) {
    // Handle invalid expression
  }
}
```

### 2. Sanitize Expressions

```typescript
const ALLOWED_OPERATORS = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte'];
const ALLOWED_FIELDS = ['name', 'price', 'category'];

function sanitizeExpression(expr: any): any {
  // Only allow whitelisted operators and fields
  if (typeof expr !== 'object') return expr;
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(expr)) {
    if (key.startsWith('$') && !ALLOWED_OPERATORS.includes(key)) {
      continue; // Skip dangerous operators
    }
    if (!key.startsWith('$') && !ALLOWED_FIELDS.includes(key)) {
      continue; // Skip non-whitelisted fields
    }
    sanitized[key] = sanitizeExpression(value);
  }
  return sanitized;
}
```

### 3. Set Resource Limits

```typescript
import { filter } from '@mcabreradev/filter';

const MAX_ARRAY_SIZE = 10000;
const MAX_EXPRESSION_DEPTH = 5;

if (data.length > MAX_ARRAY_SIZE) {
  throw new Error('Dataset too large');
}

// Limit expression depth
function checkDepth(expr: any, depth = 0): void {
  if (depth > MAX_EXPRESSION_DEPTH) {
    throw new Error('Expression too deep');
  }
  if (typeof expr === 'object') {
    Object.values(expr).forEach(v => checkDepth(v, depth + 1));
  }
}

checkDepth(expression);
const results = filter(data, expression);
```

### 4. Rate Limiting

```typescript
// Express.js example
import rateLimit from 'express-rate-limit';

const filterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many filter requests, please try again later'
});

app.get('/api/products', filterLimiter, (req, res) => {
  // Filter logic
});
```

### 5. Use TypeScript

TypeScript provides compile-time type safety:

```typescript
import { filter, Expression } from '@mcabreradev/filter';

interface Product {
  id: number;
  name: string;
  price: number;
}

const safeFilter = (data: Product[], expr: Expression) => {
  return filter<Product>(data, expr);
};
```

## Known Security Considerations

### 1. Regular Expression Operators

The `$regex` operator uses JavaScript's `RegExp`. Be aware of:

- **ReDoS (Regular Expression Denial of Service):** Complex patterns can cause exponential backtracking
- **Mitigation:** Validate and limit regex patterns from user input

```typescript
// Don't allow arbitrary regex from users
const SAFE_REGEX_PATTERN = /^[a-zA-Z0-9\s-_]+$/;

if (!SAFE_REGEX_PATTERN.test(userPattern)) {
  throw new Error('Invalid regex pattern');
}
```

### 2. Deep Object Nesting

Deeply nested objects can cause stack overflow:

- **Default:** maxDepth is set to 3
- **Recommendation:** Keep default or lower for untrusted input

```typescript
filter(data, expression, { maxDepth: 3 }); // Default is safe
```

### 3. Large Datasets

Processing very large datasets can cause memory issues:

- **Use lazy evaluation** for large datasets
- **Implement pagination** in your API

```typescript
import { filterLazy, take } from '@mcabreradev/filter';

const results = filterLazy(largeDataset, expression);
const firstPage = take(results, 20); // Lazy evaluation
```

## Vulnerability Disclosure Policy

- We follow **coordinated disclosure**
- Security advisories published on GitHub Security Advisories
- CVE IDs assigned for applicable vulnerabilities
- Credit given to reporters (unless you prefer anonymity)

## Security Updates

Security updates are released as:

- **Patch versions** for non-breaking security fixes (e.g., 5.6.1 → 5.6.2)
- **Minor versions** if breaking changes are required (e.g., 5.6.x → 5.7.0)

Subscribe to releases to stay informed:
https://github.com/mcabreradev/filter/releases

## Questions?

For security-related questions that are not vulnerability reports:

- Open a [GitHub Discussion](https://github.com/mcabreradev/filter/discussions)
- Email: security@mcabreradev.com

## Hall of Fame

We thank the following security researchers for responsible disclosure:

<!-- Security researchers who have helped will be listed here -->

---

**Last updated:** November 4, 2025
