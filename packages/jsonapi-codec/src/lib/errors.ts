import { BlockErrorException, type BlockError } from '@23blocks/contracts';
import type { JsonApiDocument, JsonApiError } from './types.js';
import { isErrorDocument } from './types.js';

/**
 * Convert a JSON:API error to a BlockError
 */
export function jsonApiErrorToBlockError(error: JsonApiError): BlockError {
  return {
    code: error.code ?? 'unknown_error',
    message: error.detail ?? error.title ?? 'An unknown error occurred',
    status: error.status ? parseInt(error.status, 10) : 500,
    source: error.source?.pointer ?? error.source?.parameter,
    meta: error.meta,
  };
}

/**
 * Convert multiple JSON:API errors to a single BlockError
 * Uses the first error as the primary error, includes others in meta
 */
export function jsonApiErrorsToBlockError(errors: JsonApiError[]): BlockError {
  if (errors.length === 0) {
    return {
      code: 'unknown_error',
      message: 'An unknown error occurred',
      status: 500,
    };
  }

  const primary = jsonApiErrorToBlockError(errors[0]);

  if (errors.length > 1) {
    primary.meta = {
      ...primary.meta,
      additionalErrors: errors.slice(1).map(jsonApiErrorToBlockError),
    };
  }

  return primary;
}

/**
 * Create a BlockErrorException from JSON:API errors
 */
export function blockErrorFromJsonApi(errors: JsonApiError[]): BlockErrorException {
  return new BlockErrorException(jsonApiErrorsToBlockError(errors));
}

/**
 * Check if a document is an error document and throw if so
 */
export function throwIfError(document: JsonApiDocument): void {
  if (isErrorDocument(document)) {
    throw blockErrorFromJsonApi(document.errors);
  }
}

/**
 * Assert that a document is not an error document
 */
export function assertNotError<T extends JsonApiDocument>(document: T): asserts document is T {
  throwIfError(document);
}
