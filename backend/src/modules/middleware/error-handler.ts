import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types/ApiError";
import { SERVER_ERROR } from "../DTO/resDto/BaseErrorDto";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toResponse());
    }

    // Handle unexpected errors
    return res.status(500).json({
        ...SERVER_ERROR,
        success: false,
        error: {
            code: 500,
            message: "Internal Server Error",
            details: err.message || "An unexpected error occurred",
            stackTrace: process.env.NODE_ENV === "development" ? err.stack : null,
        },
    });
};

export default errorHandler;
