import 'reflect-metadata';
import express from 'express';
import {Express} from 'express-serve-static-core';
import 'dotenv/config'
import { sendResponse } from './common/interfaces/base-response';
import { AppDataSource, AppDataSource2 } from './data-source';
import { Comment, Type } from './modules/entity/Comment.mongo';
import { CommentController } from './modules/controller/comment.controller';

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
  }

  public init() {
    this._app = express();
    this.initControllers()
  }

  public async start() {
    const port = process.env.APP_PORT || 3000;
    const name = process.env.APP_SERVER || 'Server 44b';
    this.app.listen(port, () => {
      console.info(`Server ${name} is running at port ${port}`);
    });
    await AppDataSource.initialize()
    await AppDataSource2.initialize()
    console.info("Data Source has been initialized!")
  }
  public async exampleaddData() {
    const user = new Comment()
    user.comment_id = 1
    user.user_id = 1
    user.target_id = 2
    user.target_type = Type.ASSIGNMENT
    user.content = "Tree School"
    user.is_private = true
    user.created_id = new Date()

  const manager = AppDataSource2.mongoManager
  await manager.save(user)
  }
}
