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
                details: this.details, // ✅ Ensure details are included
                stackTrace: process.env.NODE_ENV === "development" ? this.stack : null,
            },
        };
    }
}
