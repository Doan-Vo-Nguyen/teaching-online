import "reflect-metadata";
import express, { Express, Request, Response, NextFunction } from "express";
import "dotenv/config";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { sendResponse } from "./common/interfaces/base-response";
import { initializeDataSources, closeDataSources } from "./data-source";
import { CommentController } from "./modules/controller/comment.controller";
import { UserController } from "./modules/controller/users.controller";
import { ClassesController } from "./modules/controller/classes.controller";
import { LecturesController } from "./modules/controller/lectures.controller";
import { AuthenController } from "./modules/controller/authen.controller";
import { authentication } from "./modules/middleware/auth.middleware";
import { Logger } from "./modules/config/logger";
import swaggerJsDocs from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import options from "./docs/swagger/config/swagger.config";
import cors from "cors";
import errorHandler from "./modules/middleware/error-handler";
import helmet from "helmet";
import { StudentClassesController } from "./modules/controller/student-classes.controller";
import { ExamController } from "./modules/controller/exam.controller";
import { NotificationController } from "./modules/controller/notification.controller";
import { MeetController } from "./modules/controller/meet.controller";
import { ExamSubmissionController } from "./modules/controller/exam-submission.controller";
import { TestcaseController } from "./modules/controller/testcase.controller";
import { logPageView } from "./modules/middleware/audit-log.middleware";
import { IRequest } from "./modules/types/IRequest";
import { AuditLogController } from "./modules/controller/audit-log.controller";
import { DuplicateLoginSocket } from "./modules/socket/duplicate-login.socket";
import { SessionController } from "./modules/controller/session.controller";

/**
 * Main application class that handles the Express server setup and configuration
 * This class follows the Singleton pattern to ensure only one instance exists
 */
export class Application {
  private static instance: Application;
  private _app: Express | undefined;
  private _server: any;
  private _io: Server | undefined;
  private readonly DEFAULT_PORT = 10000;
  private readonly DEFAULT_SERVER_NAME = "Teaching_Online_Server";
  private isInitialized = false;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance of Application
   */
  public static getInstance(): Application {
    if (!Application.instance) {
      Application.instance = new Application();
    }
    return Application.instance;
  }

  /**
   * Get the Express application instance
   * @throws Error if app is not initialized
   */
  get app(): Express {
    if (!this._app) {
      throw new Error("App not initialized");
    }
    return this._app;
  }

  /**
   * Initialize the application with all necessary middleware, controllers, and configurations
   * @throws Error if initialization fails
   */
  public init(): void {
    if (this.isInitialized) {
      throw new Error("Application already initialized");
    }

    try {
      this._app = express();
      this._server = createServer(this._app);
      this.initializeSocketServer();
      this.initMiddleware();
      this.initControllers();
      this.initSwagger();
      this.initMetricsEndpoint();
      this.isInitialized = true;

      // Set up graceful shutdown handlers
      process.on('SIGTERM', () => this.gracefulShutdown());
      process.on('SIGINT', () => this.gracefulShutdown());

    } catch (error: any) {
      Logger.error("Failed to initialize application:", error);
      throw new Error("Application initialization failed");
    }
  }

  /**
   * Initialize Socket.IO server
   */
  private initializeSocketServer(): void {
    this._io = new Server(this._server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://teaching-online-server.onrender.com",
          "http://localhost:10000",
          "http://localhost:5173",
          "https://edu-space-dkn7.vercel.app",
          "https://ghienphim.fun",
          "https://api-service-2e9tk.ondigitalocean.app",
          "https://edu-space-psi.vercel.app",
          "https://api-service-2e9tk.ondigitalocean.app/api-docs"
        ],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Make io accessible to controllers
    if (this._app && this._io) {
      this._app.locals.io = this._io;
      this._app.locals.activeSockets = new Set();

      // Track connected sockets
      this._io.on('connection', (socket) => {
        // Add socket to tracking set
        this._app?.locals.activeSockets.add(socket);
        
        // Store userId with socket when session is registered
        socket.on('register_session', (data) => {
          if (data && data.userId) {
            socket['userId'] = data.userId;
          }
        });
        
        // Remove socket from tracking on disconnect
        socket.on('disconnect', () => {
          this._app?.locals.activeSockets.delete(socket);
        });
      });

      // Initialize duplicate login detection
      DuplicateLoginSocket.getInstance().initialize(this._io);
    }
  }

  /**
   * Initialize all middleware for the application
   * Includes logging, body parsing, CORS, security headers, etc.
   */
  private initMiddleware(): void {
    if (!this._app) return;

    // Request logging
    this._app.use(Logger.requestLogger());
    
    // Body parsing
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    
    // CORS configuration
    this._app.use(this.getCorsConfig());
    
    // Security headers
    this._app.use(helmet());
    this._app.use(this.getSecurityPolicy());
    
  }

  /**
   * Get CORS configuration
   */
  private getCorsConfig() {
    return cors({
      origin: [
        "http://localhost:3000",
        "https://teaching-online-server.onrender.com",
        "http://localhost:10000",
        "http://localhost:5173",
        "https://edu-space-dkn7.vercel.app",
        "https://api-service-2e9tk.ondigitalocean.app",
        "https://edu-space-psi.vercel.app",
        "https://api-service-2e9tk.ondigitalocean.app/api-docs",
        "https://hpedtechcenter.vercel.app"
        
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });
  }

  /**
   * Get security policy configuration
   */
  private getSecurityPolicy() {
    return helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    });
  }

  /**
   * Initialize all controllers and routes
   */
  private initControllers(): void {
    if (!this._app) return;

    // Public routes
    this._app.get("/", (req: Request, res: Response) => {
      return sendResponse(res, true, 200, "Hello World!");
    });

    // Authentication routes (public)
    const authenController = new AuthenController("/auth");
    this._app.use(authenController.path, authenController.router);

    // Middleware for authentication
    this._app.use("/app", authentication);
    
    // Middleware for audit logging page views
    this._app.use("/app", this.getAuditLogMiddleware());

    // Initialize protected routes
    this.initProtectedRoutes();

    // Error handling
    this._app.use(errorHandler);
  }

  /**
   * Get audit log middleware configuration
   */
  private getAuditLogMiddleware() {
    return (req: Request, res: Response, next: express.NextFunction) => {
      if (req.method === 'GET' && !req.path.includes('/api/')) {
        return logPageView(req as IRequest, res, next);
      }
      return next();
    };
  }

  /**
   * Initialize all protected routes with authentication
   */
  private initProtectedRoutes(): void {
    if (!this._app) return;

    const protectedControllers = [
      new CommentController("/app/comment"),
      new UserController("/app/users"),
      new ClassesController("/app/classes"),
      new LecturesController("/app/lectures"),
      new StudentClassesController("/app/student-classes"),
      new ExamController("/app/exams"),
      new NotificationController("/app/notifications"),
      new MeetController("/app/meetings"),
      new ExamSubmissionController("/app/exam-submissions"),
      new TestcaseController("/app/testcases"),
      new AuditLogController("/app/audit-logs"),
      new SessionController("/app/sessions")
    ];

    protectedControllers.forEach((controller) => {
      this._app?.use(controller.path, authentication, controller.router);
    });

    
  }

  /**
   * Initialize Swagger documentation
   */
  private initSwagger(): void {
    if (!this._app) return;
    const specs = swaggerJsDocs(options);
    this._app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  /**
   * Initialize metrics endpoint for monitoring
   */
  private initMetricsEndpoint(): void {
    if (!this._app) return;
    this._app.get("/metrics", (req: Request, res: Response) => {
      res.setHeader("Content-Type", "text/plain");
      res.send(Logger.getMetricsForPrometheus());
    });
  }

  /**
   * Start the application server
   * @throws Error if database initialization fails
   */
  public async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("Application not initialized. Call init() first.");
    }

    const port = parseInt(process.env.PORT || this.DEFAULT_PORT.toString(), 10);
    const name = process.env.APP_SERVER || this.DEFAULT_SERVER_NAME;

    try {
      await initializeDataSources();
      
      return new Promise((resolve, reject) => {
        this._server?.listen(port, "0.0.0.0", () => {
          Logger.info(`Server ${name} is running at port ${port}`);
          resolve();
        });
      });
    } catch (error: any) {
      Logger.error("Failed to start server:", error);
      throw error;
    }
  }

  /**
   * Handle graceful shutdown of the application
   */
  private async gracefulShutdown(): Promise<void> {
    Logger.info('Received shutdown signal, initiating graceful shutdown...');
    
    try {
      // Close the socket server first if it exists
      if (this._io) {
        await new Promise<void>((resolve) => {
          this._io?.close(() => {
            Logger.info('Socket.IO server closed');
            resolve();
          });
        });
      }
      
      // Close the HTTP server
      if (this._server) {
        await new Promise<void>((resolve) => {
          this._server.close(() => {
            Logger.info('HTTP server closed');
            resolve();
          });
        });
      }

      // Then close database connections
      await closeDataSources();
      Logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error: any) {
      Logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
}
