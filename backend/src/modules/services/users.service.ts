import { IUserRepository } from "../interfaces/users.interface";
import { UserRepository } from "../repositories/users.repository";
import bcrypt from "bcrypt";
import {
    USER_NOT_EXISTS,
    FIELD_REQUIRED,
    USERNAME_EXISTS,
    EMAIL_EXISTS,
    USER_EXISTS,
    CREATED_USER_FAILED,
    WRONG_OLD_PASSWORD,
    INVALID_RESET_CODE,
} from "../DTO/resDto/BaseErrorDto";
import { ApiError } from "../types/ApiError";
import { Role } from "../entity/User.entity";
import sendMail from "../utils/mailer";

const saltRound = 10;

class UserService {
    private readonly userRepository: IUserRepository = new UserRepository();

    public async getAllUsers() {
        const users = await this.userRepository.find({});
        return users.map(user => {
            const { user_id, username, fullname, gender, dob, address, phone, profile_picture, role} = user;
            return { user_id, username, fullname, gender, dob, address, phone, profile_picture, role};
        });
    }

    public async getUserById(userId: number) {
        if (!userId) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        return user;
    }

    public async getUserByName(fullname: string) {
        if (!fullname) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findByName(fullname);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        return user;
    }

    public async createUser(userData: any) {
        const { username, email } = userData;
        const existedUser = await this.userRepository.findByUsernameEmail(username, email);

        if (existedUser) {
            if (existedUser.username === username) {
                throw new ApiError(400, USERNAME_EXISTS.error.message);
            } else if (existedUser.email === email) {
                throw new ApiError(400, EMAIL_EXISTS.error.message);
            }
            throw new ApiError(400, USER_EXISTS.error.message);
        }

        userData.password = bcrypt.hashSync(userData.password, saltRound);
        const newUser = await this.userRepository.save(userData);

        if (!newUser) {
            throw new ApiError(400, CREATED_USER_FAILED.error.message);
        }
        return newUser;
    }

    public async updateUser(id: number, userData: any) {
        if (!id) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        const updatedUser = { ...userData, updated_at: new Date() };
        return await this.userRepository.update(id, updatedUser);
    }

    public async updateUserRole(userId: number, role: Role) {
        if (!userId || !role) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        const updateRole = { role, updated_at: new Date() };
        return await this.userRepository.update(userId, updateRole);
    }

    public async deleteUser(userId: number) {
        if (!userId) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        return await this.userRepository.delete(userId);
    }

    public async changePassword(id: number, oldPassword: string, newPassword: string) {
        if (!id || !oldPassword || !newPassword ) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        if(!bcrypt.compareSync(oldPassword, user.password)) {
            throw new ApiError(400, WRONG_OLD_PASSWORD.error.message, WRONG_OLD_PASSWORD.error.details);
        }
        const hashedPassword = bcrypt.hashSync(newPassword, saltRound);
        return await this.userRepository.changePassword(id, hashedPassword);
    }
}

export default UserService;
