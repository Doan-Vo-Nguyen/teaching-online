import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import { sendResponse } from './common/interfaces/base-response';
import { AppDataSource } from './data-source';
import { CommentController } from './modules/controller/comment.controller';
import { UserController } from './modules/controller/users.controller';
import { ClassesController } from './modules/controller/classes.controller';
import { LecturesController } from './modules/controller/lectures.controller';
import { Logger } from './modules/config/logger';
import swaggerJsDocs from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import options from './docs/swagger/config/swagger.config';
import cors from 'cors';

export class Application {
  private _app: Express | undefined;

  get app(): Express {
    if (!this._app) {
      throw new Error('App not initialized');
    }
    return this._app;
  }

  public init() {
    this._app = express();
    this.initMiddleware();
    this.initControllers();
    this._app.use(express.json()); // Add this to parse JSON payloads
    this._app.use(express.urlencoded({ extended: true })); // Optional for form-encoded payloads
    this._app.use(cors({
      origin: ['http://localhost:3000', 'https://teaching-online-server.onrender.com/','http://localhost:10000', 'http://localhost:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
  }));
    this.initControllers()
    this.initSwagger();
  }

  private initMiddleware() {
    this._app?.use(express.json());
    this._app?.use(express.urlencoded({ extended: true }));
    this._app?.use(cors({
      origin: [
        'http://localhost:3000',
        'https://teaching-online-server.onrender.com/',
        'http://localhost:10000',
        'http://localhost:5173'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));
  }

  private initControllers() {
    this._app?.get('/', (req: Request, res: Response) => {
      return sendResponse(res, true, 200, 'Hello World!');
    });

    const controllers = [
      new CommentController('/comment'),
      new UserController('/users'),
      new ClassesController('/classes'),
      new LecturesController('/lectures')
    ];

    controllers.forEach(controller => {
      this._app?.use(controller.path, controller.router);
    });
  }

  private initSwagger() {
    const specs = swaggerJsDocs(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  public async start() {
    const port = process.env.PORT || 10000;
    const name = process.env.APP_SERVER || 'Teaching_Online_Server';
    try {
      await AppDataSource.initialize();
      Logger.info('Data Source has been initialized!');
      this.app.listen(port, () => {
        Logger.info(`Server ${name} is running at port ${port}`);
      });
    } catch (error) {
      Logger.error(error);
    }
  }
}
