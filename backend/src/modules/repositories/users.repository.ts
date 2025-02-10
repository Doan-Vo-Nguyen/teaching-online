import { IUserRepository } from './../interfaces/users.interface';
import { AppDataSource } from "../../data-source";
import { Role, Users } from "../entity/User.entity";

export class UserRepository implements IUserRepository {
    private readonly repository = AppDataSource.getRepository(Users);

    async find(options: any): Promise<Users[]> {
        return this.repository.find(options);
    }

    async findById(user_id: number): Promise<Users> {
        return this.repository.findOneBy({ user_id });
    }

    async save(user: Users): Promise<Users> {
        return this.repository.save(user);
    }

    async update(user_id: number, user: Users): Promise<Users> {
        await this.repository.update(user_id, user);
        return this.repository.findOneBy({ user_id });
    }

    async updateRole(user_id: number, role: Role): Promise<Users> {
        const user = await this.repository.findOneBy({ user_id });
        user.role = role;
        return this.repository.save(user);
    }

    async delete(user_id: number): Promise<Users> {
        const user = await this.repository.findOneBy({ user_id });
        return this.repository.remove(user);
    }
}