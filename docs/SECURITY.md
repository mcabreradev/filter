# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | ✅ Yes             |
| 5.0.x   | ✅ Yes             |
| 3.x     | ⚠️ Critical fixes only (until April 2026) |
| < 3.0   | ❌ No              |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

1. **Email**: Send details to [mcabrera.dev@gmail.com](mailto:mcabrera.dev@gmail.com)
2. **Subject**: Use "SECURITY: [Brief Description]"
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Status Updates**: Every 7 days until resolved
- **Resolution Timeline**: Critical issues within 14 days, others within 30 days

### Disclosure Policy

- We follow **coordinated disclosure**
- Security fixes are released ASAP
- Public disclosure after fix is available
- Credit given to reporters (unless anonymity requested)

## Security Best Practices

### Input Validation

```typescript
// ✅ Always validate user input before filtering
import { validateExpression } from '@mcabreradev/filter';

try {
  const validated = validateExpression(userInput);
  const results = filter(data, validated);
} catch (error) {
  console.error('Invalid filter expression');
}
```

### Avoid Unsafe Expressions

```typescript
// ❌ Dangerous: User-provided predicates can execute arbitrary code
const userPredicate = eval(userInput);
filter(data, userPredicate);

// ✅ Safe: Use operators or validated expressions
filter(data, { price: { $gte: userInput.minPrice } });
```

### Regex DoS Prevention

```typescript
// ⚠️ Vulnerable: Complex regex can cause ReDoS
filter(data, {
  text: { $regex: '(a+)+$' }
});

// ✅ Safe: Use simple patterns or timeout
const safePattern = /^[a-z]+$/;
filter(data, { text: { $regex: safePattern } });
```

### Limit Dataset Size

```typescript
// ⚠️ Risk: Filtering huge datasets can cause memory issues
filter(millionRecords, expression);

// ✅ Better: Use pagination or lazy evaluation
filterFirst(millionRecords, expression, 100);
```

### Sanitize Data

```typescript
// ✅ Sanitize before filtering
import DOMPurify from 'dompurify';

const sanitized = data.map(item => ({
  ...item,
  html: DOMPurify.sanitize(item.html)
}));

filter(sanitized, expression);
```

## Known Security Considerations

### 1. Regular Expressions

**Risk**: ReDoS (Regular Expression Denial of Service)

**Mitigation**:
- Avoid complex patterns with nested quantifiers
- Use simple patterns when possible
- Consider implementing regex timeout (not built-in)

### 2. Deep Object Traversal

**Risk**: Stack overflow with deeply nested objects

**Mitigation**:
- Default `maxDepth: 3` prevents excessive recursion
- Maximum `maxDepth: 10` enforced
- Validate data structure before filtering

### 3. Memory Consumption

**Risk**: Large datasets can exhaust memory

**Mitigation**:
- Use lazy evaluation for large datasets
- Implement pagination
- Monitor memory usage in production

### 4. User-Provided Expressions

**Risk**: Malicious expressions can cause issues

**Mitigation**:
- Runtime validation with Zod
- Never use `eval()` or `Function()` with user input
- Whitelist allowed operators
- Validate expression structure

## Security Features

### Runtime Validation

All expressions and options are validated at runtime using Zod:

```typescript
// Invalid expressions are rejected
filter(data, undefined);
filter(data, { price: { $invalid: 100 } });
```

### Strict TypeScript

Built with strict TypeScript mode to catch type errors at compile time.

### No eval() or Function()

The library never uses `eval()` or `Function()` constructor, preventing code injection.

### Configurable Limits

```typescript
// Limit recursion depth
filter(data, expression, { maxDepth: 2 });

// Disable caching for sensitive data
filter(sensitiveData, expression, { enableCache: false });
```

## Dependency Security

### Production Dependencies

- **Zod**: Runtime validation (regularly audited)

### Security Audits

```bash
# Run security audit
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

### Automated Scanning

- **Dependabot**: Automated dependency updates
- **GitHub Security Advisories**: Monitored
- **npm audit**: Run in CI/CD

## Compliance

### Data Privacy

- No data is collected or transmitted
- No telemetry or analytics
- All processing is local

### License

MIT License - see [LICENSE.md](../LICENSE.md)

## Security Checklist for Users

- [ ] Validate all user input before filtering
- [ ] Never use `eval()` with user-provided expressions
- [ ] Sanitize HTML/dangerous content before filtering
- [ ] Use lazy evaluation for large datasets
- [ ] Set appropriate `maxDepth` for your data structure
- [ ] Keep dependencies updated
- [ ] Run `pnpm audit` regularly
- [ ] Monitor memory usage in production
- [ ] Implement rate limiting for API endpoints using filter
- [ ] Use TypeScript for compile-time type safety

## Contact

- **Security Issues**: [mcabrera.dev@gmail.com](mailto:mcabrera.dev@gmail.com)
- **General Issues**: [GitHub Issues](https://github.com/mcabreradev/filter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mcabreradev/filter/discussions)

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who report vulnerabilities (unless anonymity is requested).

---

**Last Updated**: October 25, 2025
**Next Review**: January 2026
