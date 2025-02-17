import { Logger } from "../config/logger";
import dotenv from 'dotenv';
dotenv.config();
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAll() {
        try {
            const listUser = await this.userRepository.find({
                select: ['user_id', 'username', 'fullname', 'email', 'phone', 'role'],
            });
            return listUser;
        }
        catch (error) {
            throw new Error('Error fetching users');
        }
    }
    async getById(user_id) {
        try {
            const user = await this.userRepository.findById(user_id);
            return user;
        }
        catch (error) {
            Logger.error(error);
        }
    }
    async create(user) {
        try {
            const newUser = await this.userRepository.save(user);
            return newUser;
        }
        catch (error) {
            throw new Error('Error creating user');
        }
    }
    async update(user_id, user) {
        try {
            await this.userRepository.update(user_id, user);
            const updatedUser = await this.userRepository.findById(user_id);
            return updatedUser;
        }
        catch (error) {
            throw new Error('Error updating user');
        }
    }
    async updateRole(user_id, role) {
        try {
            const updatedUser = await this.userRepository.updateRole(user_id, role);
            return updatedUser;
        }
        catch (error) {
            throw new Error('Error updating user role');
        }
    }
    async delete(user_id) {
        try {
            const deletedUser = await this.userRepository.delete(user_id);
            return deletedUser;
        }
        catch (error) {
            throw new Error('Error deleting user');
        }
    }
}
export default UserService;
//# sourceMappingURL=users.service.js.map