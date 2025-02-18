import { NextFunction, Request, Response } from "express";
import { INVALID_REQUEST, WRONG_BOTH_PHONE_EMAIL, WRONG_EMAIL_FORMAT, WRONG_PHONE_FORMAT } from "../../DTO/resDto/BaseErrorDto";

const REQUIRE_FIELDS = ['username', 'password', 'email', 'fullname', 'phone', 'address'];   // Required fields for user creation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   // Email format regex
const phoneRegex = /^0\d{9}$/;  // Phone format regex

export const validateCreate = (req: Request, res: Response, next: NextFunction) => {
    const data = {...req.body};
    const { email } = data as { email: string };
    const { phone } = data as { phone: string };
    let RESPONSE_JSON = {... INVALID_REQUEST};
    RESPONSE_JSON.error.validationErrors = [];

    // checking for missing fields
    const invalidFields = checkFields(REQUIRE_FIELDS);
    if(invalidFields.length > 0) {
        RESPONSE_JSON.error.message = "Missing required fields";
        RESPONSE_JSON.error.validationErrors = invalidFields.map(field => ({
            field,
            message: `${field} is required`
        }));
        return res.status(400).json(RESPONSE_JSON);
    }

    const invalidEmail = checkFormatEmail(email);
    if(invalidEmail) {
        return res.status(400).json(RESPONSE_JSON);
    }

    const invalidPhone = checkFormatPhone(phone);
    if(invalidPhone) {
        return res.status(400).json(RESPONSE_JSON);
    }

    next();
    
    function checkFields(fields: string[]) {
        return fields.filter(field => !data[field]);
    }

    function checkFormatEmail(email: string) {
        if(!emailRegex.test(email)) {
            RESPONSE_JSON.error.message = "Invalid email format";
            RESPONSE_JSON.error.validationErrors.push({
                field: 'email',
                message: 'Invalid email format',
            });
            return true;
        }
        return false;
    }

    function checkFormatPhone(phone: string) {
        if(!phoneRegex.test(phone)) {
            RESPONSE_JSON.error.message = "Invalid phone format";
            RESPONSE_JSON.error.validationErrors.push({
                field: 'phone',
                message: 'Invalid phone format',
            });
            return true;
        }
        return false;
    }
}

export const validatePhoneAndEMail = (req: Request, res: Response, next: NextFunction) => {
    const phone = req.body.phone as string;
    const email = req.body.email as string;

    // If both phone and email are not provided, skip validation
    if (!phone && !email) {
        return next();
    }

    // If phone is provided but invalid
    if (phone && !phoneRegex.test(phone)) {
        return res.status(400).json(WRONG_PHONE_FORMAT);
    }

    // If email is provided but invalid
    if (email && !emailRegex.test(email)) {
        return res.status(400).json(WRONG_EMAIL_FORMAT);
    }

    // If both phone and email are provided but both are invalid
    if (phone && email && !phoneRegex.test(phone) && !emailRegex.test(email)) {
        return res.status(400).json(WRONG_BOTH_PHONE_EMAIL);
    }

    next();
}