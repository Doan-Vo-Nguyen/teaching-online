import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import "dotenv/config";
import { sendResponse } from "./common/interfaces/base-response";
import { AppDataSource, AppDataSource2 } from "./data-source";
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

export class Application {
  private _app: Express | undefined;
  // private tokenCleanupInterval: NodeJS.Timer | null = null;

  get app(): Express {
    if (!this._app) {
      throw new Error("App not initialized");
    }
    return this._app;
  }

  public init() {
    this._app = express();
    this.initMiddleware();
    this.initControllers();
    this.initSwagger();
    this.initMetricsEndpoint();
    // this.initTokenBlacklistCleanup();
  }

  private initMiddleware() {
    this._app?.use(Logger.requestLogger());
    
    this._app?.use(express.json());
    this._app?.use(express.urlencoded({ extended: true }));
    this._app?.use(
      cors({
        origin: [
          "http://localhost:3000",
          "https://teaching-online-server.onrender.com",
          "http://localhost:10000",
          "http://localhost:5173",
          "https://edu-space-dkn7.vercel.app",
          "https://ghienphim.fun",
          "https://edu-space-i5ks914ll-nguyen-doan-vos-projects.vercel.app",
          "https://api-service-9cy27.ondigitalocean.app",
        ],
                
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );
    this.app?.use(helmet());
    this.app?.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
        },
      })
    );
  }

  private initControllers() {
    // Public routes
    this._app?.get("/", (req: Request, res: Response) => {
      return sendResponse(res, true, 200, "Hello World!");
    });

    // Authentication routes (public)
    const authenController = new AuthenController("/auth");
    this._app?.use(authenController.path, authenController.router);

    // Middleware for authentication
    this._app?.use("/app", authentication);
    
    // Middleware for audit logging page views (after authentication)
    this._app?.use("/app", (req, res, next) => {
      // Skip API endpoints that don't represent page views
      if (req.method === 'GET' && !req.path.includes('/api/')) {
        return logPageView(req as IRequest, res, next);
      }
      return next();
    });

    // Protected routes
    const protectedControllers = [
      new CommentController("/app/comment"),
      new UserController("/app/users"),
      new ClassesController("/app/classes"),
      new LecturesController("/app/lectures"),
      new StudentClassesController("/app/student-classes"),
      new ExamController("/app/exams"),
      new LecturesController("/app/lectures"),
      new NotificationController("/app/notifications"),
      new MeetController("/app/meetings"),
      new ExamSubmissionController("/app/exam-submissions"),
      new TestcaseController("/app/testcases"),
    ];

    // Apply authentication middleware to all protected routes
    protectedControllers.forEach((controller) => {
      this._app?.use(controller.path, authentication, controller.router);
    });

    this._app?.use(errorHandler);
  }

  private initSwagger() {
    const specs = swaggerJsDocs(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initMetricsEndpoint() {
    this.app.get("/metrics", (req: Request, res: Response) => {
      res.setHeader("Content-Type", "text/plain");
      res.send(Logger.getMetricsForPrometheus());
    });
  }

  /* 
  private initTokenBlacklistCleanup() {
    // Run token blacklist cleanup every hour (3600000 ms)
    this.tokenCleanupInterval = setInterval(() => {
      try {
        Logger.debug('Running token blacklist cleanup');
        cleanupBlacklist();
      } catch (error: any) {
        Logger.error('Error during token blacklist cleanup', undefined, { error });
      }
    }, 3600000);
  }
  */

  public async start() {
    const port = parseInt(process.env.PORT || "10000", 10);
    const name = process.env.APP_SERVER || "Teaching_Online_Server";
    try {
      await AppDataSource.initialize();
      await AppDataSource2.initialize();
      Logger.info("MySQL Data Source has been initialized!");
      Logger.info("MongoDB Data Source has been initialized!");
      this.app.listen(port, "0.0.0.0", () => {
        Logger.info(`Server ${name} is running at port ${port}`);
      });
    } catch (error) {
      Logger.error(error);
    }
  }
}
