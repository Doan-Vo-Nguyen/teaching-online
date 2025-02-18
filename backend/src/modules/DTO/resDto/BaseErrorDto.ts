import { IBaseError } from "../../types/IBaseError";
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
export const INVALID_REQUEST = BaseErrorDto("Invalid request", "Request is invalid during validation");
export const AUTHENTICATION_ERROR = BaseErrorDto("Authentication error", "You are not authorized to access this resource");
export const NOT_FOUND = BaseErrorDto("Not found", "Resource not found");
export const SERVER_ERROR = BaseErrorDto("Server error", "An error occurred on the server");
export const BAD_REQUEST = BaseErrorDto("Bad request", "Request is invalid");
export const UNAUTHORIZED = BaseErrorDto("Unauthorized", "You are not authorized to access this resource");
export const FORBIDDEN = BaseErrorDto("Forbidden", "You are not allowed to access this resource");
export const FIELD_REQUIRED = BaseErrorDto("Field is required", "You must provide a value for this field");

export const USER_NOT_EXISTS = BaseErrorDto("User does not exist");
export const USER_EXISTS = BaseErrorDto("User have already existed");
export const USERNAME_EXISTS = BaseErrorDto("Username is already taken");
export const EMAIL_EXISTS = BaseErrorDto("Email is already existed");
export const CREATED_USER_FAILED = BaseErrorDto("Create user failed");
