import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import { validate } from "../middleware/validate/field.validate";
import AuthenService from "../services/authen.service";
import { sendResponse } from "../../common/interfaces/base-response";

export class AuthenController extends BaseController {
    private readonly _authenService: AuthenService;

    constructor(path: string) {
        super(path);
        this._authenService = new AuthenService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.post('/login', validate(['email', 'password']) ,this.authenticate);
        this.router.post('/register', validate(['username', 'email', 'password']), this.register);
    }

    private readonly authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const accessToken = await this._authenService.authenticate(email, password);
            return sendResponse(res, true, 200, "Login successfully", accessToken);
        } catch (error) {
            next(error);
        }
        return sendResponse(res, true, 200, "Login successfully", null);
    }

    private readonly register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newUser = await this._authenService.register(req.body);
            return sendResponse(res, true, 200, "Register successfully", newUser);
        } catch (error) {
            next(error);
        }
    }
}