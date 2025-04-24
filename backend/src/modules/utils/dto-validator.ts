import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiError } from '../types/ApiError';
import { Logger } from '../config/logger';

/**
 * Validates a data object against a DTO class using class-validator
 * @param dto The DTO class to validate against
 * @param data The data object to validate
 * @returns The validated DTO object
 * @throws ApiError if validation fails
 */
export async function validateDto<T extends object, V>(
  dto: new () => T,
  data: V
): Promise<T> {
  try {
    // Transform plain object to class instance
    const instance = plainToClass(dto, data);
    
    // Validate the instance
    const errors = await validate(instance, {
      whitelist: true, // Remove additional properties not in the DTO
      forbidNonWhitelisted: true, // Throw errors for additional properties
      skipMissingProperties: false, // Require all properties to be present
    });
    
    // If validation errors exist, throw an error
    if (errors.length > 0) {
      const errorMessage = 'The provided data is invalid';
      Logger.error(errorMessage);
      
      const details = errors.map(error => {
        return `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`;
      }).join('; ');
      
      throw new ApiError(400, 'Validation Error', details);
    }
    
    return instance;
  } catch (error) {
    // If error is already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Otherwise log and wrap it
    Logger.error(error instanceof Error ? error : 'Unexpected error during DTO validation');
    throw new ApiError(
      500,
      'Validation Error',
      'An error occurred during data validation'
    );
  }
}

/**
 * Type-safe wrapper around validateDto for partial updates
 * @param dto The DTO class to validate against
 * @param data The partial data to validate
 * @returns The validated partial DTO object
 */
export async function validatePartialDto<T extends object, V>(
  dto: new () => T,
  data: V
): Promise<Partial<T>> {
  return validateDto(dto, data);
}

/**
 * Metadata helper to register validation metadata
 * Use with NestJS or in combination with reflect-metadata
 */
export function registerValidationMetadata() {
  require('reflect-metadata');
} 