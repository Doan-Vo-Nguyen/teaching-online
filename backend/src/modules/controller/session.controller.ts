import { Router, Request, Response } from "express";
import { sendResponse } from "../../common/interfaces/base-response";
import { Logger } from "../config/logger";
import { DuplicateLoginService } from "../services/duplicate-login.service";
import { IRequest } from "../types/IRequest";

interface UserSession {
  userId: string;
  fingerprint: string;
  socketId: string;
  lastActive: Date;
  deviceInfo?: string;
}

/**
 * Controller to manage user sessions
 */
export class SessionController {
  public router: Router;
  public path: string;
  private duplicateLoginService: DuplicateLoginService;

  constructor(path: string) {
    this.router = Router();
    this.path = path;
    this.duplicateLoginService = DuplicateLoginService.getInstance();
    this.initializeRoutes();
  }

  /**
   * Initialize all routes for session management
   */
  private initializeRoutes() {
    this.router.get("/active", this.getActiveSessions);
    this.router.get("/user/:userId", this.getUserActiveSessions);
    this.router.delete("/user/:userId/socket/:socketId", this.terminateSession);
  }

  /**
   * Check if the user has admin role
   */
  private hasAdminRole(user: any): boolean {
    return user?.role && (
      Array.isArray(user.role) 
        ? user.role.includes('admin') 
        : user.role === 'admin'
    );
  }

  /**
   * Get all active sessions
   */
  private getActiveSessions = async (req: Request, res: Response) => {
    try {
      const request = req as IRequest;
      if (!request.user || !this.hasAdminRole(request.user)) {
        Logger.warn(`Unauthorized access to active sessions by user: ${request.user?.id || 'unknown'}`);
        return sendResponse(res, false, 403, "Unauthorized access");
      }
      
      const sessions: Record<string, UserSession[]> = {};
      const app = req.app;
      const activeSockets = Array.from(app.locals.activeSockets || []);
      const userIds = Array.from(new Set<string>(
        activeSockets
          .map((s: any) => s.userId)
          .filter((id: any) => typeof id === 'string')
      ));
      
      for (const userId of userIds) {
        sessions[userId] = this.duplicateLoginService.getActiveSessions(userId);
      }
      
      return sendResponse(res, true, 200, "Active sessions retrieved successfully", sessions);
    } catch (error) {
      Logger.error("Error retrieving active sessions");
      return sendResponse(res, false, 500, "Error retrieving active sessions");
    }
  };

  /**
   * Get active sessions for a specific user
   */
  private getUserActiveSessions = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const request = req as IRequest;
      const userIdNum = parseInt(userId);
      
      if (!request.user || (request.user.id !== userIdNum && !this.hasAdminRole(request.user))) {
        return sendResponse(res, false, 403, "Unauthorized access");
      }
      
      const sessions = this.duplicateLoginService.getActiveSessions(userId);
      return sendResponse(res, true, 200, "User sessions retrieved successfully", sessions);
    } catch (error) {
      return sendResponse(res, false, 500, "Error retrieving user sessions");
    }
  };

  /**
   * Terminate a specific session
   */
  private terminateSession = async (req: Request, res: Response) => {
    try {
      const { userId, socketId } = req.params;
      const request = req as IRequest;
      const userIdNum = parseInt(userId);
      
      if (!request.user || (request.user.id !== userIdNum && !this.hasAdminRole(request.user))) {
        return sendResponse(res, false, 403, "Unauthorized access");
      }
      
      // Get socket server from app
      const io = req.app.locals.io;
      if (!io) {
        return sendResponse(res, false, 500, "Socket server not initialized");
      }
      
      // Force disconnect the socket
      io.sockets.sockets.get(socketId)?.disconnect(true);
      
      // Remove from session tracking
      this.duplicateLoginService.handleLogout(userId, socketId);
      
      return sendResponse(res, true, 200, "Session terminated successfully");
    } catch (error) {
      return sendResponse(res, false, 500, "Error terminating session");
    }
  };
} 