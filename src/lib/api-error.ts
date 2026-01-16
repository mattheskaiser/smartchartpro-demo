import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

/**
 * Error codes for consistent client-side handling
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number,
  code?: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError): NextResponse<ApiErrorResponse> {
  const details = error.issues.map(err => ({
    path: err.path.join('.'),
    message: err.message,
  }));

  return createErrorResponse('Validation failed', 400, ErrorCodes.VALIDATION_ERROR, details);
}

/**
 * Handle common API errors
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Development mode: log full error
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // Zod validation error
  if (error instanceof ZodError) {
    return handleValidationError(error);
  }

  // Known error with message
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('Unique constraint')) {
      return createErrorResponse(
        'A record with this information already exists',
        409,
        ErrorCodes.CONFLICT
      );
    }

    if (error.message.includes('Foreign key constraint')) {
      return createErrorResponse(
        'Referenced record does not exist',
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Generic error with message
    return createErrorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR);
  }

  // Unknown error
  return createErrorResponse('An unexpected error occurred', 500, ErrorCodes.INTERNAL_ERROR);
}

/**
 * Common error responses
 */
export const CommonErrors = {
  unauthorized: () => createErrorResponse('Unauthorized', 401, ErrorCodes.UNAUTHORIZED),

  forbidden: () => createErrorResponse('Forbidden', 403, ErrorCodes.FORBIDDEN),

  notFound: (resource = 'Resource') =>
    createErrorResponse(`${resource} not found`, 404, ErrorCodes.NOT_FOUND),

  conflict: (message: string) => createErrorResponse(message, 409, ErrorCodes.CONFLICT),

  validationError: (message: string, details?: unknown) =>
    createErrorResponse(message, 400, ErrorCodes.VALIDATION_ERROR, details),
};
