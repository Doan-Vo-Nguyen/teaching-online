import { ApiError } from "../types/ApiError";
import { FIELD_REQUIRED, NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { Logger } from "../config/logger";

export abstract class BaseService {
  /**
   * Validates that a required field is provided
   * @param value The value to check
   * @param fieldName The name of the field (for error message)
   * @throws ApiError if the field is missing
   */
  protected validateRequired(value: any, fieldName: string = 'field'): void {
    if (value === undefined || value === null) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        `The ${fieldName} is required`
      );
    }
  }

  /**
   * Validates that an entity exists
   * @param entity The entity to check
   * @param entityName The name of the entity (for error message)
   * @throws ApiError if the entity doesn't exist
   */
  protected validateExists(entity: any, entityName: string = 'entity'): void {
    if (!entity) {
      throw new ApiError(
        404,
        NOT_FOUND.error.message,
        `The ${entityName} was not found`
      );
    }
  }

  /**
   * Safely parses an ID to a number
   * @param id The ID to parse
   * @returns The parsed number
   * @throws ApiError if the ID is invalid
   */
  protected parseId(id: string | number): number {
    if (typeof id === 'number') return id;
    
    const parsedId = parseInt(id as string, 10);
    if (isNaN(parsedId)) {
      throw new ApiError(400, 'Invalid ID', 'The ID must be a valid number');
    }
    return parsedId;
  }

  /**
   * Handles and logs errors
   * @param error The error to handle
   * @param context Additional context information
   * @throws The original error or a wrapped ApiError
   */
  protected handleError(error: any, context: string = ''): never {
    if (error instanceof Error) {
      Logger.error(error);
    } else {
      Logger.error(error);
    }
    
    // If it's already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Otherwise wrap it
    throw new ApiError(
      500,
      'Internal Server Error',
      error.message || 'An unexpected error occurred'
    );
  }
} 