import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types/ApiError";
import { SERVER_ERROR } from "../DTO/resDto/BaseErrorDto";
import { Logger } from "../config/logger";
import { HTTP_INTERNAL_SERVER_ERROR } from "../constant/http-status";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Get trace ID from request if available
    const traceId = (req as any).traceId;
    
    // Log the error with minimal info
    if (err instanceof ApiError) {
        Logger.error(`${err.statusCode} ${err.message}`, undefined, {
            traceId,
            ctx: 'error',
            userId: (req as any).user?.id
        });
        
        return res.status(err.statusCode).json(err.toResponse());
    }

    // Handle unexpected errors with concise logging
    Logger.error(`${HTTP_INTERNAL_SERVER_ERROR} ${err.message || 'Unknown error'}`, undefined, {
        traceId,
        ctx: 'error',
        userId: (req as any).user?.id
    });
    
    return res.status(HTTP_INTERNAL_SERVER_ERROR).json({
        ...SERVER_ERROR,
        success: false,
        error: {
            code: HTTP_INTERNAL_SERVER_ERROR,
            message: "Internal Server Error",
            details: err.message || "An unexpected error occurred",
            stackTrace: process.env.NODE_ENV === "development" ? err.stack : null,
            traceId // Include trace ID in response for debugging
        },
    });
};

export default errorHandler;
