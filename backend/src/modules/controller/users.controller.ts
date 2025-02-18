import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import UserService from "../services/users.service";
import { UserRepository } from "../repositories/users.repository";
import { NextFunction, Request, Response } from "express";
import { authentication } from "../middleware/auth.middleware";
import { validateCreate } from "../middleware/validate/user.validate";
import { validParamId} from "../middleware/validate/field.validate";
import bcrypt from 'bcrypt';
import { CREATED_USER_FAILED, EMAIL_EXISTS, FIELD_REQUIRED, USER_EXISTS, USER_NOT_EXISTS, USERNAME_EXISTS } from "../DTO/resDto/BaseErrorDto";
import { send } from "process";

const saltRound = 10;
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
        this.router.get('/search', this.getByName);
        this.router.get('/:id',validParamId,this.getById);
        this.router.post('/', authentication, validateCreate, this.create);
        this.router.patch('/:id', authentication, this.update);
        this.router.patch('/:id/roles/:role',authentication, this.updateRole);
        this.router.delete('/:id', authentication, validParamId, this.delete);
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
        const user_id = parseInt(req.params.id, 10);
        const user = await this._service.getById(user_id);
        if(!user) {
            return sendResponse(res, false, 404, "User not found", USER_NOT_EXISTS);
        }
        return sendResponse(res, true, 200, "Get user by id successfully", user);
    }

    private readonly getByName = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const fullname = req.query.name as string;
        if (!fullname) {
            return sendResponse(res, false, 400, "User name is required", FIELD_REQUIRED);
        }
        const user = await this._service.findByName(fullname);

        if(!user) {
            return sendResponse(res, false, 404, "User not found", USER_NOT_EXISTS);
        }
        return sendResponse(res, true, 200, "Get user by name successfully", user);
    }

    private readonly create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const userInput = req.body;
        const { username, email } = userInput;
        const existedUser = await this._service.findByUsernameEmail(username, email);
        if(existedUser) {
            if(existedUser.username === username) {
                return sendResponse(res, false, 400, "Username already exists", USERNAME_EXISTS);
            }
            else if(existedUser.email === email) {
                return sendResponse(res, false, 400, "Email already exists", EMAIL_EXISTS);
            }
            return sendResponse(res, false, 500, "User already exists", USER_EXISTS);
        }

        // hash password
        const hashedPassword = bcrypt.hashSync(userInput.password, saltRound);
        userInput.password = hashedPassword;
        const newUser = await this._service.create(userInput);
        if(!newUser) {
            return sendResponse(res, false, 500, "Create user failed", CREATED_USER_FAILED)
        }
        return sendResponse(res, true, 200, "Create user successfully", newUser);
    }

    private readonly update = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const id = parseInt(req.params.id, 10);
        const user = req.body;
        user.updated_at = new Date();
        const updatedUser = await this._service.update(id, user);
        return sendResponse(res, true, 200, "Update user successfully", updatedUser);
    }

    private readonly updateRole = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const user_id = parseInt(req.params.id, 10);
        const role = req.params.role;
        const updatedUser = await this._service.updateRole(user_id, role);
        return sendResponse(res, true, 200, "Update user role successfully", updatedUser);
    }

    private readonly delete = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const user_id = parseInt(req.params.id, 10);
        const data = await this._service.getById(user_id);
        if(!data) {
            return sendResponse(res, false, 404, "User not found", USER_NOT_EXISTS);
        }
        const result = await this._service.delete(user_id);
        return sendResponse(res, true, 200, "Delete user successfully", result);
    }
}