import { IBaseError } from "../types/IBaseError";
import { BaseResDto } from "./BaseResDto";

const BaseErrorDto = (message: string | null = null, details: string | null = null): IBaseError => {
    return {
        ...BaseResDto,
        error: {
            code: 0,
            message,
            details,
            validationErrors: [],
            stackTrace: null,
        },
        success: false,
    }
}

export const baseError = BaseErrorDto;
export const INVALID_TOKEN = BaseErrorDto("Invalid token", "Token is invalid");
export const INVALID_CREDENTIALS = BaseErrorDto("Invalid credentials", "Username or password is incorrect");
export const AUTHEN_ERROR = BaseErrorDto("Authentication error", "You are not authorized to access this resource");
export const NOT_FOUND = BaseErrorDto("Not found", "Resource not found");
export const SERVER_ERROR = BaseErrorDto("Server error", "An error occurred on the server");
export const BAD_REQUEST = BaseErrorDto("Bad request", "Request is invalid");
export const UNAUTHORIZED = BaseErrorDto("Unauthorized", "You are not authorized to access this resource");
export const FORBIDDEN = BaseErrorDto("Forbidden", "You are not allowed to access this resource");