import { Response } from "express";

interface IBaseResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

/**
 * Standard HTTP response helper using correct status codes
 * 
 * @param res Express response object
 * @param success Success status
 * @param httpStatus HTTP status code (use constants from http-status.ts)
 * @param message Response message
 * @param data Optional response data
 * @param error Optional error information
 * @returns Express response
 */
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