import { Request, Response, NextFunction } from "express";
import { INVALID_REQUEST } from "../../DTO/resDto/BaseErrorDto";

export const validate = (requestField) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = {...req.body};
        const REQUIRE_FIELDS = requestField;
        const INVALID_ERROR = {...INVALID_REQUEST};
        INVALID_ERROR.error.validationErrors = [];

        // checking missing fields
        const invalidField = checkField(REQUIRE_FIELDS);

        if(invalidField) {
            res.status(400).json(INVALID_REQUEST);
        }

        next();

        function checkField(arr: Array<string>) {
            arr.forEach((item) => {
                if(data[item] === undefined) {
                    errorMess(item);
                }
            });

            if(INVALID_ERROR.error.validationErrors.length) {
                return true;
            }
            return false;
        }

        function errorMess(field: string, errMess: string = `field ${field} is required`) {
            let error = {
                message: `The ${errMess}`,
                members: [field],
            };

            INVALID_ERROR.error.validationErrors.push(error);
            INVALID_ERROR.error.details += ` ${errMess}`;
        }
    }
}

export const validParamId = (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json(INVALID_REQUEST);
    }

    next();
};



export const validQueryInput = (req: Request, res: Response, next: NextFunction) => {
    const input = req.query.input as string;
    if (!input) {
        return res.status(400).json(INVALID_REQUEST);
    }
    next(); 
}