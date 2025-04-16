export class ApiError extends Error {
    statusCode: number;
    details: string | null;

    constructor(statusCode: number, message: string, details?: string) {
        super(message);
        this.statusCode = statusCode;
        this.details = details || null;
    }

    toResponse() {
        return {
            success: false,
            error: {
                code: this.statusCode,
                message: this.message,
                details: this.details,
                stackTrace: process.env.NODE_ENV === "development" ? this.stack : null,
            },
        };
    }
}

// Common API error factory methods
import { 
    HTTP_BAD_REQUEST, 
    HTTP_UNAUTHORIZED, 
    HTTP_FORBIDDEN, 
    HTTP_NOT_FOUND, 
    HTTP_CONFLICT,
    HTTP_UNPROCESSABLE_ENTITY,
    HTTP_INTERNAL_SERVER_ERROR 
} from "../constant/http-status";

export const badRequest = (message: string, details?: string) => 
    new ApiError(HTTP_BAD_REQUEST, message, details);

export const unauthorized = (message: string, details?: string) => 
    new ApiError(HTTP_UNAUTHORIZED, message, details);

export const forbidden = (message: string, details?: string) => 
    new ApiError(HTTP_FORBIDDEN, message, details);

export const notFound = (message: string, details?: string) => 
    new ApiError(HTTP_NOT_FOUND, message, details);

export const conflict = (message: string, details?: string) => 
    new ApiError(HTTP_CONFLICT, message, details);

export const unprocessableEntity = (message: string, details?: string) => 
    new ApiError(HTTP_UNPROCESSABLE_ENTITY, message, details);

export const internalServerError = (message: string, details?: string) => 
    new ApiError(HTTP_INTERNAL_SERVER_ERROR, message, details);
