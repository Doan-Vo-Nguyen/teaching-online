import { Request, Response, NextFunction } from "express";
import {
  INVALID_REQUEST,
  INVALID_VALUE,
} from "../../DTO/resDto/BaseErrorDto";

export const validate = (requestField: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body };
    const REQUIRE_FIELDS = requestField;
    const INVALID_ERROR = { ...INVALID_REQUEST };
    INVALID_ERROR.error.validationErrors = [];

    // checking missing fields
    const invalidField = checkField(REQUIRE_FIELDS || []);

    if (invalidField) {
      res.status(400).json(INVALID_REQUEST);
    }

    next();

    function checkField(arr: Array<string>) {
      arr.forEach((item) => {
        if (data[item] === undefined) {
          errorMess(item);
        }
      });

      if (INVALID_ERROR.error.validationErrors.length) {
        return true;
      }
      return false;
    }

    function errorMess(
      field: string,
      errMess: string = `field ${field} is required`
    ) {
      let error = {
        message: `The ${errMess}`,
        members: [field],
      };

      INVALID_ERROR.error.validationErrors.push(error);
      INVALID_ERROR.error.details += ` ${errMess}`;
    }
  };
};

export const validParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const paramValue = parseInt(req.params[paramName], 10);

    if (Number.isNaN(paramValue) || paramValue <= 0) {
      return res.status(400).json(INVALID_VALUE);
    }

    next();
  };
};
export const validQueryParam = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const value = req.query[paramName];
        
        if (!value || typeof value !== "string") {
            const errorResponse = { ...INVALID_REQUEST };
            errorResponse.error.details = `Invalid ${paramName} query parameter`;
            return res.status(400).json(errorResponse);
        }
        
        if (paramName === 'id' && !Number.isInteger(Number(value)) || Number(value) <= 0) {
            return res.status(400).json(INVALID_VALUE);
        }
        
        next();
    };
};

export const validQueryInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const input = req.query.input as string;
  if (!input) {
    return res.status(400).json(INVALID_REQUEST);
  }
  next();
};
