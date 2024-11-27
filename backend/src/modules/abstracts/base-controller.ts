import { Router } from 'express';

abstract class BaseController {
  private readonly _path: string;
  private readonly _router: Router;

  constructor(path: string) {
    this._path = path;
    this._router = Router();
  }

  public abstract initRoutes(): void;

  get path(): string {
    return this._path;
  }

  get router(): Router {
    return this._router;
  }
}

export default BaseController;