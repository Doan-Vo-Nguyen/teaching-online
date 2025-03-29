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
        this.router.post('/register', validate(['fullname', 'email', 'password']), this.register);
        this.router.post('/forgot-password', this.forgotPassword)
        this.router.put('/reset-password', validate(['code', 'password']), this.resetPassword);
        this.router.post('/refresh-token', this.refreshToken);
    }

    private readonly authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const accessToken = await this._authenService.authenticate(email, password);
            return sendResponse(res, true, 200, "Login successfully", accessToken);
        } catch (error) {
            next(error);
        }
    }

    private readonly register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newUser = await this._authenService.register(req.body);
            return sendResponse(res, true, 200, "Register successfully", newUser);
        } catch (error) {
            next(error);
        }
    }

    private readonly forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            await this._authenService.forgotPassword(email);
            sendResponse(res, true, 200, "Reset code sent successfully", { redirect: '/reset-password' });
        } catch (error) {
             next(error);
        }
    }

    private readonly resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the email from query
            const email = req.query.email as string;
            const { code, password } = req.body;
            await this._authenService.resetPassword(email, code, password);
            return sendResponse(res, true, 200, "Reset password successfully", { redirect: '/login' });
        } catch (error) {
            next(error);
        }
    }

    private readonly refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            const accessToken = await this._authenService.generateRefreshToken(refreshToken);
            return sendResponse(res, true, 200, "Refresh token successfully", accessToken);
        } catch (error) {
            next(error);
        }
    }

}