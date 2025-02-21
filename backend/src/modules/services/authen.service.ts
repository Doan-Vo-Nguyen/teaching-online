import bcrypt from 'bcrypt';
import { IUserRepository } from "../interfaces/users.interface";
import { UserRepository } from "../repositories/users.repository";
import { ApiError } from "../types/ApiError";
import { LOGIN_FAILED, FIELD_REQUIRED, USER_EXISTS, CREATED_USER_FAILED } from "../DTO/resDto/BaseErrorDto";

class AuthenService {
    private readonly userRepository: IUserRepository = new UserRepository();

    public async authenticate(email: string, password: string) {
        if (!email || !password) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const existedUser = await this.userRepository.findByEmail(email);
        if (!existedUser) {
            throw new ApiError(500, LOGIN_FAILED.error.message, LOGIN_FAILED.error.details);
        }

        const checkPass = await this.userRepository.comparePassword(email, password);
        if (!checkPass) {
            throw new ApiError(500, LOGIN_FAILED.error.message, LOGIN_FAILED.error.details);
        }

        const accessToken = await this.userRepository.generateToken(email);
        return { accessToken };
    }

    public async register(userData: any) {
        const saltRound = 10;
        const {fullname, email} = userData;
        const existedUser = await this.userRepository.findByEmail(email);
        if(existedUser) {
            throw new ApiError(500, USER_EXISTS.error.message, USER_EXISTS.error.details);
        }

        userData.password = bcrypt.hashSync(userData.password, saltRound);
        userData.fullname = fullname;
        const newUser = await this.userRepository.save(userData);
        if(!newUser) {
            throw new ApiError(400, CREATED_USER_FAILED.error.message, CREATED_USER_FAILED.error.details);
        }
        return newUser;
    }
}

export default AuthenService;
