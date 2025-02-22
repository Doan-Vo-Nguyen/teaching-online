import { Request, Response, NextFunction } from 'express';
import BaseController from "../abstracts/base-controller";
import UserService from "../services/users.service";
import { authentication } from "../middleware/auth.middleware";
import { validateCreate, validatePhoneAndEMail } from "../middleware/validate/user.validate";
import { validParamId } from "../middleware/validate/field.validate";
import { sendResponse } from '../../common/interfaces/base-response';
import { Role } from '../entity/User.entity';

export class UserController extends BaseController {
    private readonly userService: UserService;

    constructor(path: string) {
        super(path);
        this.userService = new UserService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this.getAllUsers);
        this.router.get('/search', this.getUserByName);
        this.router.get('/:id', validParamId, this.getUserById);
        this.router.post('/', authentication, validateCreate, this.createUser);
        this.router.patch('/:id', authentication, validatePhoneAndEMail, this.updateUser);
        this.router.patch('/:id/roles/:role', authentication, this.updateUserRole);
        this.router.delete('/:id', authentication, validParamId, this.deleteUser);
    }

    private readonly getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAllUsers();
            return sendResponse(res, true, 200, "Get all users successfully", users);
        } catch (error) {
            next(error);
        }
    }

    private readonly getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await this.userService.getUserById(userId);
            return sendResponse(res, true, 200, "Get user by id successfully", user);
        } catch (error) {
            next(error);
        }
    }

    private readonly getUserByName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fullname = req.query.name as string;
            const user = await this.userService.getUserByName(fullname);
            return sendResponse(res, true, 200, "Get user by name successfully", user);
        } catch (error) {
            next(error);
        }
    }

    private readonly createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newUser = await this.userService.createUser(req.body);
            return sendResponse(res, true, 200, "Create user successfully", newUser);
        } catch (error) {
            next(error);
        }
    }

    private readonly updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const updatedUser = await this.userService.updateUser(userId, req.body);
            return sendResponse(res, true, 200, "Update user successfully", updatedUser);
        } catch (error) {
            next(error);
        }
    }

    private readonly updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const role = req.params.role as Role;
            const updatedUser = await this.userService.updateUserRole(userId, role);
            return sendResponse(res, true, 200, "Update user role successfully", updatedUser);
        } catch (error) {
            next(error);
        }
    }

    private readonly deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = await this.userService.deleteUser(userId);
            return sendResponse(res, true, 200, "Delete user successfully", result);
        } catch (error) {
            next(error);
        }
    }
}