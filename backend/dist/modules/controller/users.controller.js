import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import UserService from "../services/users.service";
import { UserRepository } from "../repositories/users.repository";
import { authentication } from "../middleware/auth.middleware";
export class UserController extends BaseController {
    _service;
    constructor(path) {
        super(path);
        const userRepository = new UserRepository();
        this._service = new UserService(userRepository);
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getById);
        this.router.post('/', authentication, this.create);
        this.router.patch('/:id', authentication, this.update);
        this.router.patch('/:id/roles/:role', authentication, this.updateRole);
        this.router.delete('/:id', authentication, this.delete);
    }
    getAll = async (req, res, next) => {
        const listUser = await this._service.getAll();
        return sendResponse(res, true, 200, "Get all user successfully", listUser);
    };
    getById = async (req, res, next) => {
        const user_id = parseInt(req.params.id, 10);
        const user = await this._service.getById(user_id);
        return sendResponse(res, true, 200, "Get user by id successfully", user);
    };
    create = async (req, res, next) => {
        const user = req.body;
        const newUser = await this._service.create(user);
        return sendResponse(res, true, 200, "Create user successfully", newUser);
    };
    update = async (req, res, next) => {
        const id = parseInt(req.params.id, 10);
        const user = req.body;
        user.updated_at = new Date();
        const updatedUser = await this._service.update(id, user);
        return sendResponse(res, true, 200, "Update user successfully", updatedUser);
    };
    updateRole = async (req, res, next) => {
        const user_id = parseInt(req.params.id, 10);
        const role = req.body.role;
        const updatedUser = await this._service.updateRole(user_id, role);
        return sendResponse(res, true, 200, "Update user role successfully", updatedUser);
    };
    delete = async (req, res, next) => {
        const user_id = parseInt(req.params.user_id, 10);
        const user = await this._service.delete(user_id);
        return sendResponse(res, true, 200, "Delete user successfully", user);
    };
}
//# sourceMappingURL=users.controller.js.map