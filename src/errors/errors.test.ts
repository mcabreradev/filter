import { describe, it, expect } from 'vitest';
import {
  FilterError,
  InvalidExpressionError,
  OperatorError,
  ValidationError,
  TypeMismatchError,
  GeospatialError,
  ConfigurationError,
  PerformanceLimitError,
} from './filter-errors';
import {
  isFilterError,
  formatErrorMessage,
  createValidationError,
  createOperatorError,
  createTypeMismatchError,
  createGeospatialError,
  createConfigurationError,
  wrapError,
  extractErrorDetails,
  getUserFriendlyMessage,
  ErrorCodes,
} from './error-helpers';

describe('FilterError', () => {
  it('should create a base filter error', () => {
    const error = new FilterError('Test error', 'TEST_CODE', { foo: 'bar' });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FilterError);
    expect(error.name).toBe('FilterError');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.context).toEqual({ foo: 'bar' });
  });

  it('should convert to JSON', () => {
    const error = new FilterError('Test error', 'TEST_CODE', { foo: 'bar' });
    const json = error.toJSON();

    expect(json).toHaveProperty('name', 'FilterError');
    expect(json).toHaveProperty('message', 'Test error');
    expect(json).toHaveProperty('code', 'TEST_CODE');
    expect(json).toHaveProperty('context', { foo: 'bar' });
    expect(json).toHaveProperty('stack');
  });

  it('should format to string', () => {
    const error = new FilterError('Test error', 'TEST_CODE', { foo: 'bar' });
    const str = error.toString();

    expect(str).toContain('FilterError');
    expect(str).toContain('TEST_CODE');
    expect(str).toContain('Test error');
    expect(str).toContain('Context:');
    expect(str).toContain('foo');
  });
});

describe('InvalidExpressionError', () => {
  it('should create invalid expression error', () => {
    const expression = { invalid: 'expr' };
    const error = new InvalidExpressionError(expression, 'Missing operator');

    expect(error).toBeInstanceOf(FilterError);
    expect(error.name).toBe('InvalidExpressionError');
    expect(error.code).toBe('INVALID_EXPRESSION');
    expect(error.message).toContain('Invalid filter expression');
    expect(error.message).toContain('Missing operator');
    expect(error.context).toHaveProperty('expression', expression);
  });

  it('should include validation errors', () => {
    const errors = ['Field is required', 'Invalid type'];
    const error = new InvalidExpressionError({}, 'Validation failed', errors);

    expect(error.validationErrors).toEqual(errors);
    expect(error.context).toHaveProperty('validationErrors', errors);
  });
});

describe('OperatorError', () => {
  it('should create operator error', () => {
    const error = new OperatorError('$gt', 'invalid', 'Expected number');

    expect(error).toBeInstanceOf(FilterError);
    expect(error.name).toBe('OperatorError');
    expect(error.code).toBe('OPERATOR_ERROR');
    expect(error.operator).toBe('$gt');
    expect(error.message).toContain('$gt');
    expect(error.message).toContain('Expected number');
  });
});

describe('ValidationError', () => {
  it('should create validation error', () => {
    const error = new ValidationError('Value is required', 'age');

    expect(error).toBeInstanceOf(FilterError);
    expect(error.name).toBe('ValidationError');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.field).toBe('age');
    expect(error.message).toContain('age');
  });

  it('should include multiple errors', () => {
    const errors = ['Too short', 'Invalid format'];
    const error = new ValidationError('Multiple issues', 'email', errors);

    expect(error.errors).toEqual(errors);
  });
});

describe('TypeMismatchError', () => {
  it('should create type mismatch error', () => {
    const error = new TypeMismatchError('number', 'string', 'age');

    expect(error).toBeInstanceOf(FilterError);
    expect(error.name).toBe('TypeMismatchError');
    expect(error.code).toBe('TYPE_MISMATCH');
    expect(error.expected).toBe('number');
    expect(error.received).toBe('string');
    expect(error.field).toBe('age');
  });
});

describe('GeospatialError', () => {
  it('should create geospatial error', () => {
    const coords = { lat: 'invalid', lng: 200 };
    const error = new GeospatialError('Invalid coordinates', coords);

    expect(error).toBeInstanceOf(FilterError);
    expect(error.name).toBe('GeospatialError');
    expect(error.code).toBe('GEOSPATIAL_ERROR');
    expect(error.coordinates).toEqual(coords);
  });
});

describe('ConfigurationError', () => {
  it('should create configuration error', () => {
    const error = new ConfigurationError('Invalid value', 'maxDepth');

    expect(error).toBeInstanceOf(FilterError);
    expect(error.name).toBe('ConfigurationError');
    expect(error.code).toBe('CONFIGURATION_ERROR');
    expect(error.option).toBe('maxDepth');
  });
});

describe('PerformanceLimitError', () => {
  it('should create performance limit error', () => {
    const error = new PerformanceLimitError('Execution time exceeded', 1000, 1500);

    expect(error).toBeInstanceOf(FilterError);
    expect(error.name).toBe('PerformanceLimitError');
    expect(error.code).toBe('PERFORMANCE_LIMIT');
    expect(error.limit).toBe(1000);
    expect(error.actual).toBe(1500);
  });
});

describe('Error Helpers', () => {
  describe('isFilterError', () => {
    it('should identify filter errors', () => {
      const filterError = new FilterError('test', 'TEST');
      const regularError = new Error('test');

      expect(isFilterError(filterError)).toBe(true);
      expect(isFilterError(regularError)).toBe(false);
      expect(isFilterError('string')).toBe(false);
      expect(isFilterError(null)).toBe(false);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format message without context', () => {
      const result = formatErrorMessage('Error message');
      expect(result).toBe('Error message');
    });

    it('should format message with context', () => {
      const result = formatErrorMessage('Error message', { foo: 'bar', num: 42 });
      expect(result).toContain('Error message');
      expect(result).toContain('Context:');
      expect(result).toContain('foo');
      expect(result).toContain('bar');
    });
  });

  describe('createValidationError', () => {
    it('should create validation error from field and errors', () => {
      const error = createValidationError('email', ['Required', 'Invalid format']);

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.field).toBe('email');
      expect(error.errors).toEqual(['Required', 'Invalid format']);
    });
  });

  describe('createOperatorError', () => {
    it('should create operator error with type info', () => {
      const error = createOperatorError('$gt', 'text', 'number');

      expect(error).toBeInstanceOf(OperatorError);
      expect(error.operator).toBe('$gt');
      expect(error.message).toContain('Expected number');
      expect(error.message).toContain('received string');
    });
  });

  describe('createTypeMismatchError', () => {
    it('should create type mismatch error', () => {
      const error = createTypeMismatchError('age', 'number', 'text');

      expect(error).toBeInstanceOf(TypeMismatchError);
      expect(error.field).toBe('age');
      expect(error.expected).toBe('number');
      expect(error.received).toBe('string');
    });
  });

  describe('createGeospatialError', () => {
    it('should create geospatial error', () => {
      const coords = { lat: 91, lng: 200 };
      const error = createGeospatialError(coords, 'Latitude out of range');

      expect(error).toBeInstanceOf(GeospatialError);
      expect(error.coordinates).toEqual(coords);
    });
  });

  describe('createConfigurationError', () => {
    it('should create configuration error', () => {
      const error = createConfigurationError('maxDepth', -1, 'Must be positive');

      expect(error).toBeInstanceOf(ConfigurationError);
      expect(error.option).toBe('maxDepth');
      expect(error.message).toContain('Must be positive');
    });
  });

  describe('wrapError', () => {
    it('should return filter error as-is', () => {
      const original = new FilterError('test', 'TEST');
      const wrapped = wrapError(original);

      expect(wrapped).toBe(original);
    });

    it('should wrap regular error', () => {
      const original = new Error('test error');
      const wrapped = wrapError(original);

      expect(isFilterError(wrapped)).toBe(true);
      expect(wrapped.message).toBe('test error');
    });

    it('should wrap non-error values', () => {
      const wrapped = wrapError('string error');

      expect(isFilterError(wrapped)).toBe(true);
      expect(wrapped.message).toBe('string error');
    });
  });

  describe('extractErrorDetails', () => {
    it('should extract filter error details', () => {
      const error = new FilterError('test', 'TEST', { foo: 'bar' });
      const details = extractErrorDetails(error);

      expect(details.message).toBe('test');
      expect(details.code).toBe('TEST');
      expect(details.context).toEqual({ foo: 'bar' });
      expect(details.stack).toBeDefined();
    });

    it('should extract regular error details', () => {
      const error = new Error('test error');
      const details = extractErrorDetails(error);

      expect(details.message).toBe('test error');
      expect(details.code).toBeUndefined();
      expect(details.stack).toBeDefined();
    });

    it('should handle non-error values', () => {
      const details = extractErrorDetails('string error');

      expect(details.message).toBe('string error');
      expect(details.code).toBeUndefined();
      expect(details.stack).toBeUndefined();
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return friendly message for InvalidExpressionError', () => {
      const error = new InvalidExpressionError({}, 'test');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('filter expression is invalid');
    });

    it('should return friendly message for OperatorError', () => {
      const error = new OperatorError('$gt', 'text', 'test');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('Invalid operator usage');
      expect(message).toContain('$gt');
    });

    it('should return friendly message for ValidationError', () => {
      const error = new ValidationError('test', 'field');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('Validation failed');
    });

    it('should return friendly message for TypeMismatchError', () => {
      const error = new TypeMismatchError('number', 'string', 'age');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('Type error');
      expect(message).toContain('number');
      expect(message).toContain('string');
    });

    it('should return friendly message for GeospatialError', () => {
      const error = new GeospatialError('test');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('Invalid geographic coordinates');
    });

    it('should return friendly message for ConfigurationError', () => {
      const error = new ConfigurationError('test');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('Configuration error');
    });

    it('should handle regular errors', () => {
      const error = new Error('test error');
      const message = getUserFriendlyMessage(error);

      expect(message).toBe('test error');
    });

    it('should handle unknown errors', () => {
      const message = getUserFriendlyMessage('string error');

      expect(message).toBe('An unknown error occurred');
    });
  });

  describe('ErrorCodes', () => {
    it('should define all error codes', () => {
      expect(ErrorCodes.INVALID_EXPRESSION).toBe('INVALID_EXPRESSION');
      expect(ErrorCodes.OPERATOR_ERROR).toBe('OPERATOR_ERROR');
      expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCodes.CONFIGURATION_ERROR).toBe('CONFIGURATION_ERROR');
      expect(ErrorCodes.TYPE_MISMATCH).toBe('TYPE_MISMATCH');
      expect(ErrorCodes.GEOSPATIAL_ERROR).toBe('GEOSPATIAL_ERROR');
      expect(ErrorCodes.PERFORMANCE_LIMIT).toBe('PERFORMANCE_LIMIT');
    });
  });
});
