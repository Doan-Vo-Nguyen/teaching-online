import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import { validate } from "../middleware/validate/field.validate";
import { AuthenService } from "../services/authen.service";
import { sendResponse } from "../../common/interfaces/base-response";
import { HTTP_OK, HTTP_CREATED } from "../constant/http-status";
import { logLogin, logLogout } from "../middleware/audit-log.middleware";
import { IRequest } from "../types/IRequest";
import { UserRepository } from "../repositories/users.repository";
export class AuthenController extends BaseController {
    private readonly _authenService: AuthenService;
    private readonly _userRepository: UserRepository;

    constructor(path: string) {
        super(path);
        this._authenService = new AuthenService();
        this._userRepository = new UserRepository();
        this.initRoutes();
    }

    public initRoutes(): void {
        // Cho phép đăng nhập bằng email hoặc username: chỉ bắt buộc password, identifier sẽ tự kiểm tra
        this.router.post('/login', validate(['password']), this.authenticate);
        this.router.post('/register', validate(['fullname', 'email', 'password']), this.register);
        this.router.post('/forgot-password', this.forgotPassword)
        this.router.put('/reset-password', validate(['code', 'password']), this.resetPassword);
        this.router.post('/refresh-token', this.refreshToken);
        this.router.post('/logout', this.logout);
    }

    private readonly authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { password } = req.body;
            const identifier = (req.body.email || req.body.username || '').trim();
            const authResult = await this._authenService.authenticate(identifier, password);
            
            // Attach user data to the response for audit logging middleware
            res.locals.userData = {
                id: authResult.user.user_id,
                username: authResult.user.username,
                fullname: authResult.user.fullname,
                email: authResult.user.email,
                role: [authResult.user.role]
            };
            
            // Add audit logging middleware for this specific request
            return logLogin(req as IRequest, res, () => {
                return sendResponse(res, true, HTTP_OK, "Login successfully", {
                    accessToken: authResult.accessToken,
                    refreshToken: authResult.refreshToken
                });
            });
        } catch (error) {
            next(error);
        }
    }

    private readonly register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newUser = await this._authenService.register(req.body);
            return sendResponse(res, true, HTTP_CREATED, "Register successfully", newUser);
        } catch (error) {
            next(error);
        }
    }

    private readonly forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string;
            await this._authenService.forgotPassword(email);
            sendResponse(res, true, HTTP_OK, "Reset code sent successfully", { redirect: '/reset-password' });
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
            return sendResponse(res, true, HTTP_OK, "Reset password successfully", { redirect: '/login' });
        } catch (error) {
            next(error);
        }
    }

    private readonly refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            const accessToken = await this._authenService.generateRefreshToken(refreshToken);
            return sendResponse(res, true, HTTP_OK, "Refresh token successfully", accessToken);
        } catch (error) {
            next(error);
        }
    }

    private readonly logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.body;
            
            // Extract the access token from the Authorization header
            // const accessToken = getTokenFromHeader(req.headers.authorization) || '';
            
            // For audit logging
            const user = await this._userRepository.findById(user_id);
            if (user) {
                (req as IRequest).user = {
                    id: user.user_id,
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email,
                    role: [user.role]
                };
                
                // Add audit logging middleware for this specific request
                return logLogout(req as IRequest, res, async () => {
                    // Pass the access token to the logout service
                    // await this._authenService.logout(user_id, accessToken);
                    await this._authenService.logout(user_id);
                    return sendResponse(res, true, HTTP_OK, "Logout successfully");
                });
            } else {
                // Pass the access token to the logout service
                // await this._authenService.logout(user_id, accessToken);
                await this._authenService.logout(user_id);
                return sendResponse(res, true, HTTP_OK, "Logout successfully");
            }
        } catch (error) {
            next(error);
        }
    }
}