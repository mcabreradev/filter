/**
 * Base error class for all filter-related errors
 */
export class FilterError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'FilterError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FilterError);
    }
  }

  /**
   * Convert error to JSON for serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
    };
  }

  /**
   * Format error for display
   */
  toString(): string {
    const contextStr = this.context ? `\nContext: ${JSON.stringify(this.context, null, 2)}` : '';
    return `${this.name} [${this.code}]: ${this.message}${contextStr}`;
  }
}

/**
 * Error thrown when filter expression is invalid
 */
export class InvalidExpressionError extends FilterError {
  constructor(
    expression: unknown,
    details: string,
    public readonly validationErrors?: string[],
  ) {
    const message = `Invalid filter expression: ${details}\nReceived: ${JSON.stringify(expression)}`;
    super(message, 'INVALID_EXPRESSION', {
      expression,
      details,
      validationErrors,
    });
    this.name = 'InvalidExpressionError';
  }
}

/**
 * Error thrown when operator usage is incorrect
 */
export class OperatorError extends FilterError {
  constructor(
    public readonly operator: string,
    value: unknown,
    details: string,
  ) {
    const message = `Operator '${operator}' error: ${details}\nValue: ${JSON.stringify(value)}`;
    super(message, 'OPERATOR_ERROR', {
      operator,
      value,
      details,
    });
    this.name = 'OperatorError';
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends FilterError {
  constructor(
    details: string,
    public readonly field?: string,
    public readonly errors?: string[],
  ) {
    const fieldStr = field ? ` for field '${field}'` : '';
    const message = `Validation failed${fieldStr}: ${details}`;
    super(message, 'VALIDATION_ERROR', {
      field,
      details,
      errors,
    });
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class ConfigurationError extends FilterError {
  constructor(
    details: string,
    public readonly option?: string,
  ) {
    const optionStr = option ? ` for option '${option}'` : '';
    const message = `Configuration error${optionStr}: ${details}`;
    super(message, 'CONFIGURATION_ERROR', {
      option,
      details,
    });
    this.name = 'ConfigurationError';
  }
}

/**
 * Error thrown when type mismatch occurs
 */
export class TypeMismatchError extends FilterError {
  constructor(
    public readonly expected: string,
    public readonly received: string,
    public readonly field?: string,
  ) {
    const fieldStr = field ? ` for field '${field}'` : '';
    const message = `Type mismatch${fieldStr}: expected ${expected}, received ${received}`;
    super(message, 'TYPE_MISMATCH', {
      expected,
      received,
      field,
    });
    this.name = 'TypeMismatchError';
  }
}

/**
 * Error thrown when geospatial operation fails
 */
export class GeospatialError extends FilterError {
  constructor(
    details: string,
    public readonly coordinates?: unknown,
  ) {
    const message = `Geospatial error: ${details}`;
    super(message, 'GEOSPATIAL_ERROR', {
      details,
      coordinates,
    });
    this.name = 'GeospatialError';
  }
}

/**
 * Error thrown when performance limits are exceeded
 */
export class PerformanceLimitError extends FilterError {
  constructor(
    details: string,
    public readonly limit?: number,
    public readonly actual?: number,
  ) {
    const message = `Performance limit exceeded: ${details}`;
    super(message, 'PERFORMANCE_LIMIT', {
      details,
      limit,
      actual,
    });
    this.name = 'PerformanceLimitError';
  }
}
