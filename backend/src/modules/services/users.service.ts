import { Logger } from "../config/logger";
import { UserDTO } from "../DTO/users.dto";
import { Users } from "../entity/User.entity";
import { IUserRepository } from "../interfaces/users.interface";
import dotenv from 'dotenv';
dotenv.config();
class UserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async getAll(options: Partial<UserDTO> = {}): Promise<UserDTO[]> {
        try {
            return await this.userRepository.find(options);
        } catch (error) {
            Logger.error(error);
        }
    }

    async getById(user_id: number): Promise<UserDTO> {
        try {
            const user = await this.userRepository.findById(user_id);
            return user;
        } catch (error) {
            Logger.error(error);
        }
    }

    async create(user: UserDTO): Promise<Users> {
        try {
            const userEntity = new Users();
            Object.assign(userEntity, user);
            const newUser = await this.userRepository.save(userEntity);
            return newUser;
        } catch (error) {
            Logger.error(error);
        }
    }

    async update(user_id: number, user: UserDTO): Promise<Users> {
        try {
            await this.userRepository.update(user_id, user);
            const updatedUser = await this.userRepository.findById(user_id);
            return updatedUser;
        } catch (error) {
            Logger.error(error);
        }
    }

    async delete(user_id: number): Promise<Users> {
        try {
            const deletedUser = await this.userRepository.delete(user_id);
            return deletedUser;
        } catch (error) {
            Logger.error(error);
        }
    }

    async updateRole(user_id: number, role: string): Promise<Users> {
        try {
            const updatedUser = await this.userRepository.updateRole(user_id, role);
            return updatedUser;
        } catch (error) {
            Logger.error(error);
        }
    }

    async findByName(fullname: string): Promise<Users> {
        try {
            const user = await this.userRepository.findByName(fullname);
            return user;
        } catch (error) {
            Logger.error(error);
        }
    }

    async findByUsernameEmail(username: string, email: string): Promise<Users> {
        try {
            const user = await this.userRepository.findByUsernameEmail(username, email);
            return user;
        } catch (error) {
            Logger.error(error);
        }
    }
}

export default UserService;