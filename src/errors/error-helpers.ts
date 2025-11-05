import type { FilterError } from './filter-errors.js';
import {
  InvalidExpressionError,
  OperatorError,
  ValidationError,
  TypeMismatchError,
  GeospatialError,
  ConfigurationError,
} from './filter-errors.js';

/**
 * Error code constants
 */
export const ErrorCodes = {
  INVALID_EXPRESSION: 'INVALID_EXPRESSION',
  OPERATOR_ERROR: 'OPERATOR_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  TYPE_MISMATCH: 'TYPE_MISMATCH',
  GEOSPATIAL_ERROR: 'GEOSPATIAL_ERROR',
  PERFORMANCE_LIMIT: 'PERFORMANCE_LIMIT',
} as const;

/**
 * Check if error is a FilterError
 */
export function isFilterError(error: unknown): error is FilterError {
  return error instanceof Error && 'code' in error;
}

/**
 * Format error message with context
 */
export function formatErrorMessage(message: string, context?: Record<string, unknown>): string {
  if (!context) return message;

  const contextStr = Object.entries(context)
    .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
    .join('\n');

  return `${message}\n\nContext:\n${contextStr}`;
}

/**
 * Create detailed error from validation result
 */
export function createValidationError(field: string, errors: string[]): ValidationError {
  const details = errors.join(', ');
  return new ValidationError(details, field, errors);
}

/**
 * Create error for invalid operator usage
 */
export function createOperatorError(
  operator: string,
  value: unknown,
  expected: string,
): OperatorError {
  const details = `Expected ${expected}, received ${typeof value}`;
  return new OperatorError(operator, value, details);
}

/**
 * Create error for type mismatch
 */
export function createTypeMismatchError(
  field: string,
  expected: string,
  received: unknown,
): TypeMismatchError {
  return new TypeMismatchError(expected, typeof received, field);
}

/**
 * Create error for invalid coordinates
 */
export function createGeospatialError(coordinates: unknown, reason: string): GeospatialError {
  return new GeospatialError(reason, coordinates);
}

/**
 * Create error for invalid configuration
 */
export function createConfigurationError(
  option: string,
  value: unknown,
  reason: string,
): ConfigurationError {
  return new ConfigurationError(`${reason}. Received: ${JSON.stringify(value)}`, option);
}

/**
 * Wrap unknown errors in FilterError
 */
export function wrapError(error: unknown, context?: Record<string, unknown>): FilterError {
  if (isFilterError(error)) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  const filterError = new (class extends Error {
    code = 'UNKNOWN_ERROR';
    context = context;
  })(message) as FilterError;

  if (stack) {
    filterError.stack = stack;
  }

  return filterError;
}

/**
 * Extract error details for logging
 */
export function extractErrorDetails(error: unknown): {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
  stack?: string;
} {
  if (isFilterError(error)) {
    return {
      message: error.message,
      code: error.code,
      context: error.context,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}

/**
 * Create user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof InvalidExpressionError) {
    return 'The filter expression is invalid. Please check the syntax and try again.';
  }

  if (error instanceof OperatorError) {
    return `Invalid operator usage: ${error.operator}. Please check the documentation for correct usage.`;
  }

  if (error instanceof ValidationError) {
    return `Validation failed: ${error.message}`;
  }

  if (error instanceof TypeMismatchError) {
    return `Type error: Expected ${error.expected} but received ${error.received}`;
  }

  if (error instanceof GeospatialError) {
    return 'Invalid geographic coordinates. Please provide valid latitude and longitude values.';
  }

  if (error instanceof ConfigurationError) {
    return `Configuration error: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}
