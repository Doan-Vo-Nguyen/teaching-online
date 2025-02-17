import { Response } from "express";
export declare function sendResponse(res: Response, success: boolean, httpStatus: number, message: string, data?: any, error?: any): Response<any, Record<string, any>>;
