import 'reflect-metadata';
import express from 'express';
import {Express} from 'express-serve-static-core';
import 'dotenv/config'
import { sendResponse } from './common/interfaces/base-response';
import { AppDataSource} from './data-source';
import { CommentController } from './modules/controller/comment.controller';
import { UserController } from './modules/controller/users.controller';
import { ClassesController } from './modules/controller/classes.controller';
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

  private initControllers() {
    this._app?.get('/',(req: express.Request, res: express.Response) => {
        return sendResponse(res, true, 200, 'Hello World!');
    })
    const commentController = new CommentController('/comment');
    this._app?.use(commentController.path, commentController.router);

    const userController = new UserController('/users');
    this._app?.use(userController.path, userController.router);

    const classesController = new ClassesController('/classes');
    this._app?.use(classesController.path, classesController.router);
  }

  public init() {
    this._app = express();
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

  private initSwagger() {
    const specs = swaggerJsDocs(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  public async start() {
    const port = process.env.PORT || 10000;
    const name = process.env.APP_SERVER || 'Teaching_Online_Server';
    try {
      
      await AppDataSource.initialize();
      console.info('Data Source has been initialized!');
      this.app.listen(port, () => {
        Logger.info(`Server ${name} is running at port ${port}`);
      });
    } catch (error) {
      Logger.error(error);
    }
  }
}
