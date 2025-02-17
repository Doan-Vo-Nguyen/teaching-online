import { Router } from 'express';
declare abstract class BaseController {
    private readonly _path;
    private readonly _router;
    constructor(path: string);
    abstract initRoutes(): void;
    get path(): string;
    get router(): Router;
}
export default BaseController;
