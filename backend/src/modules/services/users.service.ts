import { Request, Response, NextFunction } from 'express';
import { IUserRepository } from "../interfaces/users.interface";
import dotenv from 'dotenv';
import { sendResponse } from '../../common/interfaces/base-response';
import bcrypt from 'bcrypt';
import { CREATED_USER_FAILED, EMAIL_EXISTS, FIELD_REQUIRED, USER_EXISTS, USER_NOT_EXISTS, USERNAME_EXISTS } from '../DTO/resDto/BaseErrorDto';
import { UserRepository } from '../repositories/users.repository';
dotenv.config();

const saltRound = 10;

class UserService {
    private readonly userRepository: IUserRepository = new UserRepository();


    public readonly getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const listUser = await this.userRepository.find({});
            return sendResponse(res, true, 200, "Get all user successfully", listUser);
        } catch (error) {
            next(error);
        }
    }

    public readonly getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = parseInt(req.params.id, 10);
            const user = await this.userRepository.findById(user_id);
            if (!user) {
                return sendResponse(res, false, 404, "User not found", USER_NOT_EXISTS);
            }
            return sendResponse(res, true, 200, "Get user by id successfully", user);
        } catch (error) {
            next(error);
        }
    }

    public readonly getByName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fullname = req.query.name as string;
            if (!fullname) {
                return sendResponse(res, false, 400, "User name is required", FIELD_REQUIRED);
            }
            const user = await this.userRepository.findByName(fullname);
            if (!user) {
                return sendResponse(res, false, 404, "User not found", USER_NOT_EXISTS);
            }
            return sendResponse(res, true, 200, "Get user by name successfully", user);
        } catch (error) {
            next(error);
        }
    }

    public readonly create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userInput = req.body;
            const { username, email } = userInput;
            const existedUser = await this.userRepository.findByUsernameEmail(username, email);
            if (existedUser) {
                if (existedUser.username === username) {
                    return sendResponse(res, false, 400, "Username already exists", USERNAME_EXISTS);
                } else if (existedUser.email === email) {
                    return sendResponse(res, false, 400, "Email already exists", EMAIL_EXISTS);
                }
                return sendResponse(res, false, 500, "User already exists", USER_EXISTS);
            }

            // hash password
            userInput.password = bcrypt.hashSync(userInput.password, saltRound);
            const newUser = await this.userRepository.save(userInput);
            if (!newUser) {
                return sendResponse(res, false, 500, "Create user failed", CREATED_USER_FAILED);
            }
            return sendResponse(res, true, 200, "Create user successfully", newUser);
        } catch (error) {
            next(error);
        }
    }

    public readonly update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            const user = { ...req.body, updated_at: new Date() };
            const updatedUser = await this.userRepository.update(id, user);
            return sendResponse(res, true, 200, "Update user successfully", updatedUser);
        } catch (error) {
            next(error);
        }
    }

    public readonly updateRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = parseInt(req.params.id, 10);
            const role = req.body.role;
            const updatedUser = await this.userRepository.updateRole(user_id, role);
            return sendResponse(res, true, 200, "Update user role successfully", updatedUser);
        } catch (error) {
            next(error);
        }
    }

    public readonly delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id = parseInt(req.params.id, 10);
            const data = await this.userRepository.findById(user_id);
            if (!data) {
                return sendResponse(res, false, 404, "User not found", USER_NOT_EXISTS);
            }
            const result = await this.userRepository.delete(user_id);
            return sendResponse(res, true, 200, "Delete user successfully", result);
        } catch (error) {
            next(error);
        }
    }
}

export default UserService;