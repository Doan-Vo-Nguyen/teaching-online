import 'reflect-metadata';
import express from 'express';
import {Express} from 'express-serve-static-core';
import 'dotenv/config'
import { sendResponse } from './common/interfaces/base-response';

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
  }
}
