import { IBaseError } from "../../types/IBaseError";
import { BaseResDto } from "./BaseResDto";
import {
    HTTP_BAD_REQUEST,
    HTTP_UNAUTHORIZED,
    HTTP_FORBIDDEN,
    HTTP_NOT_FOUND,
    HTTP_CONFLICT,
    HTTP_INTERNAL_SERVER_ERROR
} from "../../constant/http-status";

const BaseErrorDto = (message: string | null = null, details: string | null = null, code: number = 0): IBaseError => {
    return {
        ...BaseResDto,
        error: {
            code,
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
export const INVALID_REQUEST = BaseErrorDto("Invalid request", "Request is invalid during validation", HTTP_BAD_REQUEST);
export const INVALID_VALUE = BaseErrorDto("Invalid value", "Value is invalid or empty", HTTP_BAD_REQUEST);
export const SERVER_ERROR = BaseErrorDto("Server error", "An error occurred on the server", HTTP_INTERNAL_SERVER_ERROR);
export const BAD_REQUEST = BaseErrorDto("Bad request", "Request is invalid", HTTP_BAD_REQUEST);
export const NOT_FOUND = BaseErrorDto("Not found", "Resource not found", HTTP_NOT_FOUND);
export const CREATE_FAILED = BaseErrorDto("Create failed", "Create resource failed", HTTP_INTERNAL_SERVER_ERROR);
export const TIME_EXPIRED = BaseErrorDto("Time expired", "Resource time is expired", HTTP_BAD_REQUEST);

// Authentication Errors
export const INVALID_TOKEN = BaseErrorDto("Invalid token", "Token is invalid", HTTP_UNAUTHORIZED);
export const INVALID_CREDENTIALS = BaseErrorDto("Invalid credentials", "Username or password is incorrect", HTTP_UNAUTHORIZED);
export const INVALID_RESET_CODE = BaseErrorDto("Invalid reset code", "Reset code is invalid", HTTP_BAD_REQUEST);
export const AUTHENTICATION_ERROR = BaseErrorDto("Authentication error", "You are not authorized to access this resource", HTTP_UNAUTHORIZED);
export const UNAUTHORIZED = BaseErrorDto("Unauthorized", "You are not authorized to access this resource", HTTP_UNAUTHORIZED);
export const FORBIDDEN = BaseErrorDto("Forbidden", "You are not allowed to access this resource", HTTP_FORBIDDEN);

// User Errors
export const USER_NOT_EXISTS = BaseErrorDto("User does not exist", null, HTTP_NOT_FOUND);
export const USER_EXISTS = BaseErrorDto("User have already existed", null, HTTP_CONFLICT);
export const USERNAME_EXISTS = BaseErrorDto("Username is already taken", null, HTTP_CONFLICT);
export const EMAIL_EXISTS = BaseErrorDto("Email is already existed", null, HTTP_CONFLICT);
export const PARENT_PHONE_EXISTS = BaseErrorDto("Parent phone is already used", "Số điện thoại phụ huynh đã được sử dụng", HTTP_CONFLICT);
export const CREATED_USER_FAILED = BaseErrorDto("Create user failed", null, HTTP_INTERNAL_SERVER_ERROR);
export const WRONG_OLD_PASSWORD = BaseErrorDto("Wrong old password", "Old password is incorrect", HTTP_BAD_REQUEST);
export const NOT_STUDENT = BaseErrorDto("Not a student", "You are not a student", HTTP_FORBIDDEN);
export const NOT_TEACHER = BaseErrorDto("Not a teacher", "You are not a teacher", HTTP_FORBIDDEN);

// Class Errors
export const CLASS_NOT_EXISTS = BaseErrorDto("Class does not exist", null, HTTP_NOT_FOUND);
export const CLASS_NOT_FOUND = BaseErrorDto("Class not found", "Class not found", HTTP_NOT_FOUND);
export const ALREADY_ENROLL = BaseErrorDto("Already enroll", "You have already enroll this class", HTTP_CONFLICT);
export const CLASS_ALREADY_EXISTS = BaseErrorDto("Class already exists", "Class is already existed", HTTP_CONFLICT);
export const STUDENT_NOT_FOUND = BaseErrorDto("Student not found", "Student not found in this class", HTTP_NOT_FOUND);

// Exam Errors
export const EXAM_NOT_FOUND = BaseErrorDto("Exam not found", "No exam was found", HTTP_NOT_FOUND);
export const EXAM_ALREADY_EXISTS = BaseErrorDto("Exam already exists", "Exam is already existed", HTTP_CONFLICT);
export const EXAM_FIELD_REQUIRED = BaseErrorDto("Exam field is required", "You must provide a value for this field", HTTP_BAD_REQUEST);
export const EXAM_NOT_FOUND_IN_CLASS = BaseErrorDto("Exam not found in class", "Exam not found in this class", HTTP_NOT_FOUND);

// Meeting Errors
export const MEET_NOT_FOUND = BaseErrorDto("Meeting not found", "No meeting was found", HTTP_NOT_FOUND);
export const MEET_ALREADY_EXISTS = BaseErrorDto("Meeting already exists", "Meeting is already existed", HTTP_CONFLICT);
export const MEET_ERROR = BaseErrorDto("Something went wrong", "An error occurred while processing this action with meeting", HTTP_INTERNAL_SERVER_ERROR);

// Exam Submission Errors
export const EXAM_SUBMISSION_NOT_FOUND = BaseErrorDto("Exam submission not found", "No exam submission was found", HTTP_NOT_FOUND);
export const EXAM_SUBMISSION_FIELD_REQUIRED = BaseErrorDto("Exam submission field is required", "You must provide a value for this field", HTTP_BAD_REQUEST);
export const CODE_EXECUTION_FAILED = BaseErrorDto("Code execution failed", "An error occurred while executing the code", HTTP_INTERNAL_SERVER_ERROR);
export const EXAM_SUBMISSION_ALREADY_EXISTS = BaseErrorDto("Exam submission already exists", "You have already submitted the exam", HTTP_CONFLICT);
export const EXAM_SUBMISSION_ERROR = BaseErrorDto("Exam submission error", "An error occurred while processing this action with exam submission", HTTP_INTERNAL_SERVER_ERROR);

// Validation Errors
export const FIELD_REQUIRED = BaseErrorDto("Field is required", "You must provide a value for this field", HTTP_BAD_REQUEST);
export const WRONG_PASSWORD = BaseErrorDto("Wrong password", "Password is incorrect", HTTP_BAD_REQUEST);
export const WRONG_PHONE_FORMAT = BaseErrorDto("Wrong phone format", "Phone number is invalid", HTTP_BAD_REQUEST);
export const WRONG_EMAIL_FORMAT = BaseErrorDto("Wrong email format", "Email is invalid", HTTP_BAD_REQUEST);
export const WRONG_BOTH_PHONE_EMAIL = BaseErrorDto("Wrong phone and email format", "Phone number and email are invalid", HTTP_BAD_REQUEST);

// Login Errors
export const LOGIN_FAILED = BaseErrorDto("Login failed", "Email or password is incorrect", HTTP_UNAUTHORIZED);
