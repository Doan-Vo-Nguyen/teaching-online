import { Request, Response, NextFunction } from "express";
import { IUserRepository } from "../interfaces/users.interface";
import { UserRepository } from "../repositories/users.repository";
import { sendResponse } from "../../common/interfaces/base-response";
import { LOGIN_FAILED } from "../DTO/resDto/BaseErrorDto";

class AuthenService {
    private readonly _repository: IUserRepository = new UserRepository();

    public authenticate = async (req: Request, res: Response, next: NextFunction) => {
        const {email, password} = req.body;
        try {
            const existedUser = await this._repository.findByEmail(email);
            if(!existedUser) {
                return sendResponse(res, false, 500, "Login failed", LOGIN_FAILED);
            }

            const checkPass = await this._repository.comparePassword(email, password);
            if(!checkPass) {
                return sendResponse(res, false, 500, "Login failed", LOGIN_FAILED);
            }

            const accessToken = await this._repository.generateToken(email);

            return sendResponse(res, true, 200, "Login successfully", {accessToken});
        } catch (error) {
            next(error);
        }
    }
}

export default AuthenService;