import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import UserService from "../services/users.service";
import { UserRepository } from "../repositories/users.repository";
import { NextFunction, Request, Response } from "express";
import { authentication } from "../middleware/auth.middleware";

export class UserController extends BaseController {
    private readonly _service: UserService;

    constructor(path: string) {
        super(path);
        const userRepository = new UserRepository();
        this._service = new UserService(userRepository);
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/' ,this.getAll);
        this.router.get('/:user_id', authentication,this.getById);
        this.router.post('/', authentication,this.create);
        this.router.put('/:user_id', authentication, this.update);
        this.router.put('/:user_id',authentication ,this.updateRole);
        this.router.delete('/:user_id', authentication ,this.delete);
    }

    private readonly getAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const listUser = await this._service.getAll();
        return sendResponse(res, true, 200, "Get all user successfully", listUser);
    }

    private readonly getById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const user_id = parseInt(req.params.user_id, 10);
        const user = await this._service.getById(user_id);
        return sendResponse(res, true, 200, "Get user by id successfully", user);
    }

    private readonly create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const user = req.body;
        const newUser = await this._service.create(user);
        return sendResponse(res, true, 200, "Create user successfully", newUser);
    }

    private readonly update = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const user_id = parseInt(req.params.user_id, 10);
        const user = req.body;
        user.updated_at = new Date();
        const updatedUser = await this._service.update(user_id, user);
        return sendResponse(res, true, 200, "Update user successfully", updatedUser);
    }

    private readonly updateRole = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const user_id = parseInt(req.params.user_id, 10);
        const role = req.body.role;
        const updatedUser = await this._service.updateRole(user_id, role);
        return sendResponse(res, true, 200, "Update user role successfully", updatedUser);
    }

    private readonly delete = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const user_id = parseInt(req.params.user_id, 10);
        const user = await this._service.delete(user_id);
        return sendResponse(res, true, 200, "Delete user successfully", user);
    }
}