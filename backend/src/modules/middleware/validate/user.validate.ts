import { NextFunction, Request, Response } from "express";
import { INVALID_REQUEST } from "../../DTO/resDto/BaseErrorDto";

const REQUIRE_FIELDS = ['username', 'password', 'email', 'fullname', 'phone', 'address'];   // Required fields for user creation

export const validateCreate = (req: Request, res: Response, next: NextFunction) => {
    const data = {...req.body};
    const { email } = data as { email: string };
    let RESPONSE_JSON = {... INVALID_REQUEST};
    RESPONSE_JSON.error.validationErrors = [];

    // checking for missing fields
    const invalidFields = checkFields(REQUIRE_FIELDS);
    if(invalidFields.length > 0) {
        return res.status(400).json({RESPONSE_JSON});
    }

    const invalidEmail = checkFormatEmail(email);
    if(invalidEmail) {
        return res.status(400).json({RESPONSE_JSON});
    }

    next();
    
    function checkFields(fields: string[]) {
        return fields.filter(field => !data[field]);
    }

    function checkFormatEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            RESPONSE_JSON.error.validationErrors.push({
                field: 'email',
                message: 'Invalid email format',
            });
            return true;
        }
        return false;
    }
}