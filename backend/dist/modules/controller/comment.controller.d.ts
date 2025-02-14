import BaseController from "../abstracts/base-controller";
export declare class CommentController extends BaseController {
    private readonly _service;
    constructor(path: string);
    initRoutes(): void;
    private readonly getAll;
}
