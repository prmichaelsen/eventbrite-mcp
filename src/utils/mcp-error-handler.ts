import { serializeError } from './error-serializer.js';
import { logger } from './logger.js';

/**
 * Eventbrite API Error
 * Represents an error from the Eventbrite API with structured error information
 */
export class EventbriteAPIError extends Error {
  constructor(
    public readonly errorCode: string,
    public readonly errorDescription: string,
    public readonly statusCode: number,
    public readonly details?: any
  ) {
    super(errorDescription);
    this.name = 'EventbriteAPIError';
  }

  toJSON() {
    return {
      name: this.name,
      errorCode: this.errorCode,
      errorDescription: this.errorDescription,
      statusCode: this.statusCode,
      details: this.details,
      message: this.message
    };
  }
}

/**
 * MCP Tool Error Response
 * Standardized error response format for MCP tools
 */
export interface MCPErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode?: number;
    details?: any;
    stack?: string;
  };
  tool: string;
  timestamp: string;
}

/**
 * Create an MCP-compatible error response
 */
export function createMCPErrorResponse(
  toolName: string,
  error: unknown
): MCPErrorResponse {
  logger.error(`Tool ${toolName} failed:`, error);

  // Handle Eventbrite API errors
  if (error instanceof EventbriteAPIError) {
    return {
      success: false,
      error: {
        code: error.errorCode,
        message: error.errorDescription,
        statusCode: error.statusCode,
        details: error.details
      },
      tool: toolName,
      timestamp: new Date().toISOString()
    };
  }

  // Handle standard errors
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        code: error.name || 'UNKNOWN_ERROR',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        details: serializeError(error)
      },
      tool: toolName,
      timestamp: new Date().toISOString()
    };
  }

  // Handle unknown errors
  return {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: String(error),
      details: error
    },
    tool: toolName,
    timestamp: new Date().toISOString()
  };
}

/**
 * Parse Eventbrite API error from response
 */
export function parseEventbriteError(
  statusCode: number,
  responseData: any
): EventbriteAPIError {
  // Eventbrite API error format:
  // {
  //   "error": "ERROR_CODE",
  //   "error_description": "Human readable description",
  //   "status_code": 400
  // }
  
  const errorCode = responseData?.error || 'UNKNOWN_ERROR';
  const errorDescription = responseData?.error_description || responseData?.message || 'An unknown error occurred';
  const apiStatusCode = responseData?.status_code || statusCode;
  
  return new EventbriteAPIError(
    errorCode,
    errorDescription,
    apiStatusCode,
    responseData
  );
}

/**
 * Handle tool execution with proper error propagation
 */
export async function handleToolExecution<T>(
  toolName: string,
  executor: () => Promise<T>
): Promise<T | MCPErrorResponse> {
  try {
    const result = await executor();
    return result;
  } catch (error) {
    return createMCPErrorResponse(toolName, error);
  }
}

/**
 * Check if a value is an MCP error response
 */
export function isMCPErrorResponse(value: any): value is MCPErrorResponse {
  return (
    value &&
    typeof value === 'object' &&
    value.success === false &&
    value.error &&
    typeof value.error === 'object' &&
    value.tool &&
    typeof value.tool === 'string'
  );
}

/**
 * Format error for user-friendly display
 */
export function formatErrorForDisplay(error: MCPErrorResponse): string {
  const lines: string[] = [
    `❌ ${error.tool} failed`,
    '',
    `Error: ${error.error.code}`,
    `Message: ${error.error.message}`
  ];

  if (error.error.statusCode) {
    lines.push(`Status Code: ${error.error.statusCode}`);
  }

  if (error.error.details) {
    lines.push('', 'Details:', JSON.stringify(error.error.details, null, 2));
  }

  return lines.join('\n');
}
