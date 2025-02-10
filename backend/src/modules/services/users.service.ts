import { UserDTO } from "../DTO/users.dto";
import { IUserRepository } from "../interfaces/users.interface";

class UserService {
    private readonly userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async getAll(): Promise<UserDTO[]> {
        try {
            const listUser = await this.userRepository.find({
                select: ['user_id', 'username' ,'fullname' ,'email', 'phone', 'role'],
            });
            return listUser;
        } catch (error) {
            throw new Error('Error fetching users');
        }
    }

    async getById(user_id: number): Promise<UserDTO> {
        try {
            const user = await this.userRepository.findById(user_id);
            return user;
        } catch (error) {
            throw new Error('Error fetching user');
        }
    }

    async create(user: UserDTO): Promise<UserDTO> {
        try {
            const newUser = await this.userRepository.save(user);
            return newUser;
        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    async update(user_id: number, user: UserDTO): Promise<UserDTO> {
        try {
            const updatedUser = await this.userRepository.update(user_id, user);
            return updatedUser;
        } catch (error) {
            throw new Error('Error updating user');
        }
    }

    async updateRole(user_id: number, role: string): Promise<UserDTO> {
        try {
            const updatedUser = await this.userRepository.updateRole(user_id, role);
            return updatedUser;
        } catch (error) {
            throw new Error('Error updating user role');
        }
    }

    async delete(user_id: number): Promise<UserDTO> {
        try {
            const deletedUser = await this.userRepository.delete(user_id);
            return deletedUser;
        } catch (error) {
            throw new Error('Error deleting user');
        }
    }
}

export default UserService;