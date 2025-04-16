import { Request, Response, NextFunction } from 'express';
import { Logger } from '../config/logger';

/**
 * Simplified middleware for tracking specific API actions
 */
export const trackApiAction = (actionType: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get trace ID from request (set by Logger.requestLogger middleware)
    const traceId = (req as any).traceId;
    
    if (traceId) {
      // Extract user information if available
      const userId = (req as any).user?.id;
      
      // Log the API action concisely
      Logger.info(`${actionType}`, {
        traceId,
        ctx: 'action',
        userId
      });
    }
    
    next();
  };
};

/**
 * Simplified controller action tracking
 */
export const trackControllerAction = (controllerName: string) => {
  return (actionName: string) => {
    return trackApiAction(`${controllerName}.${actionName}`);
  };
}; 