import { Router, Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../common/interfaces/base-response';
import { Logger } from '../config/logger';

/**
 * Base controller that provides common functionality for all controllers
 */
abstract class BaseController {
  public router: Router;
  public path: string;

  /**
   * Initialize the controller with the specified path
   * @param path The base path for this controller
   */
  constructor(path: string) {
    this.router = Router();
    this.path = path;
  }

  /**
   * Initialize routes - must be implemented by derived classes
   */
  abstract initRoutes(): void;

  /**
   * Helper method to parse ID parameters safely
   * @param id The ID parameter to parse
   * @returns The parsed numeric ID
   */
  protected parseId(id: string): number {
    return parseInt(id, 10);
  }

  /**
   * Standard response wrapper for successful responses
   * @param res Express response object
   * @param statusCode HTTP status code
   * @param message Success message
   * @param data Data to include in response
   */
  protected sendSuccess(
    res: Response,
    statusCode: number = 200,
    message: string = 'Success',
    data: any = null
  ) {
    return sendResponse(res, true, statusCode, message, data);
  }

  /**
   * Standard response wrapper for error responses
   * @param res Express response object
   * @param statusCode HTTP status code
   * @param message Error message
   * @param error Error details
   */
  protected sendError(
    res: Response,
    statusCode: number = 500,
    message: string = 'Error',
    error: any = null
  ) {
    return sendResponse(res, false, statusCode, message, null, error);
  }

  /**
   * Standard try/catch wrapper for controller handlers
   * @param handler The async handler function to wrap
   * @returns A wrapped handler with standardized error handling
   */
  protected asyncHandler(
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        Logger.error(error);
        next(error);
      }
    };
  }
}

export default BaseController;