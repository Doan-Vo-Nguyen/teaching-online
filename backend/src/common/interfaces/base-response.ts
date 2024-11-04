import { Response } from "express";

interface IBaseResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

export function sendResponse(
  res: Response,
  success: boolean,
  httpStatus: number,
  message: string,
  data?: any,
  error?: any
) {
  const response: IBaseResponse = {
    success,
    message,
    data,
    error,
  };
  return res.status(httpStatus).send(response);
}