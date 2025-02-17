import BaseController from "../abstracts/base-controller";
export declare class UserController extends BaseController {
    private readonly _service;
    constructor(path: string);
    initRoutes(): void;
    private readonly getAll;
    private readonly getById;
    private readonly create;
    private readonly update;
    private readonly updateRole;
    private readonly delete;
}
