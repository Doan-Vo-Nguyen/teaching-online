import 'reflect-metadata';
import express from 'express';
import {Express} from 'express-serve-static-core';
import 'dotenv/config'
import { sendResponse } from './common/interfaces/base-response';
import { AppDataSource, AppDataSource2 } from './data-source';
import { CommentController } from './modules/controller/comment.controller';
import { UserController } from './modules/controller/users.controller';
import { ClassesController } from './modules/controller/classes.controller';

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

    const userController = new UserController('/user');
    this._app?.use(userController.path, userController.router);

    const classesController = new ClassesController('/classes');
    this._app?.use(classesController.path, classesController.router);
  }

  public init() {
    this._app = express();
    this._app.use(express.json()); // Add this to parse JSON payloads
    this._app.use(express.urlencoded({ extended: true })); // Optional for form-encoded payloads
    this.initControllers()
  }

  public async start() {
    const port = process.env.APP_PORT || 3000;
    const name = process.env.APP_SERVER || 'Server 44b';
    try {
      
      await AppDataSource.initialize();
      await AppDataSource2.initialize();
      console.info('Data Source has been initialized!');
      this.app.listen(port, () => {
        console.info(`Server ${name} is running at port ${port}`);
      });
    } catch (error) {
      console.error('Error during app startup:', error);
    }
  }
}
