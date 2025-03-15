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

// General Errors
export const baseError = BaseErrorDto;
export const INVALID_REQUEST = BaseErrorDto("Invalid request", "Request is invalid during validation");
export const INVALID_VALUE = BaseErrorDto("Invalid value", "Value is invalid or empty");
export const SERVER_ERROR = BaseErrorDto("Server error", "An error occurred on the server");
export const BAD_REQUEST = BaseErrorDto("Bad request", "Request is invalid");
export const NOT_FOUND = BaseErrorDto("Not found", "Resource not found");
export const CREATE_FAILED = BaseErrorDto("Create failed", "Create resource failed");
export const TIME_EXPIRED = BaseErrorDto("Time expired", "Resource time is expired");

// Authentication Errors
export const INVALID_TOKEN = BaseErrorDto("Invalid token", "Token is invalid");
export const INVALID_CREDENTIALS = BaseErrorDto("Invalid credentials", "Username or password is incorrect");
export const INVALID_RESET_CODE = BaseErrorDto("Invalid reset code", "Reset code is invalid");
export const AUTHENTICATION_ERROR = BaseErrorDto("Authentication error", "You are not authorized to access this resource");
export const UNAUTHORIZED = BaseErrorDto("Unauthorized", "You are not authorized to access this resource");
export const FORBIDDEN = BaseErrorDto("Forbidden", "You are not allowed to access this resource");

// User Errors
export const USER_NOT_EXISTS = BaseErrorDto("User does not exist");
export const USER_EXISTS = BaseErrorDto("User have already existed");
export const USERNAME_EXISTS = BaseErrorDto("Username is already taken");
export const EMAIL_EXISTS = BaseErrorDto("Email is already existed");
export const CREATED_USER_FAILED = BaseErrorDto("Create user failed");
export const WRONG_OLD_PASSWORD = BaseErrorDto("Wrong old password", "Old password is incorrect");
export const NOT_STUDENT = BaseErrorDto("Not a student", "You are not a student");
export const NOT_TEACHER = BaseErrorDto("Not a teacher", "You are not a teacher");

// Class Errors
export const CLASS_NOT_EXISTS = BaseErrorDto("Class does not exist");
export const CLASS_NOT_FOUND = BaseErrorDto("Class not found", "Class not found");
export const ALREADY_ENROLL = BaseErrorDto("Already enroll", "You have already enroll this class");
export const CLASS_ALREADY_EXISTS = BaseErrorDto("Class already exists", "Class is already existed");
export const STUDENT_NOT_FOUND = BaseErrorDto("Student not found", "Student not found in this class");

// Exam Errors
export const EXAM_NOT_FOUND = BaseErrorDto("Exam not found", "No exam was found");
export const EXAM_ALREADY_EXISTS = BaseErrorDto("Exam already exists", "Exam is already existed");
export const EXAM_FIELD_REQUIRED = BaseErrorDto("Exam field is required", "You must provide a value for this field");
export const EXAM_NOT_FOUND_IN_CLASS = BaseErrorDto("Exam not found in class", "Exam not found in this class");

// Meeting Errors
export const MEET_NOT_FOUND = BaseErrorDto("Meeting not found", "No meeting was found");
export const MEET_ALREADY_EXISTS = BaseErrorDto("Meeting already exists", "Meeting is already existed");
export const MEET_ERROR = BaseErrorDto("Something went wrong", "An error occurred while processing this action with meeting");

// Exam Submission Errors
export const EXAM_SUBMISSION_NOT_FOUND = BaseErrorDto("Exam submission not found", "No exam submission was found");
export const EXAM_SUBMISSION_FIELD_REQUIRED = BaseErrorDto("Exam submission field is required", "You must provide a value for this field");

// Validation Errors
export const FIELD_REQUIRED = BaseErrorDto("Field is required", "You must provide a value for this field");
export const WRONG_PASSWORD = BaseErrorDto("Wrong password", "Password is incorrect");
export const WRONG_PHONE_FORMAT = BaseErrorDto("Wrong phone format", "Phone number is invalid");
export const WRONG_EMAIL_FORMAT = BaseErrorDto("Wrong email format", "Email is invalid");
export const WRONG_BOTH_PHONE_EMAIL = BaseErrorDto("Wrong phone and email format", "Phone number and email are invalid");

// Login Errors
export const LOGIN_FAILED = BaseErrorDto("Login failed", "Email or password is incorrect");
