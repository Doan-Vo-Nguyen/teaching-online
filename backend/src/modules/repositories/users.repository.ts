import { Role, Users } from "../entity/User.entity";
import { UserDTO } from '../DTO/users.dto';
import { BaseRepository } from './base.repository';
import { Like } from "typeorm";

export class UserRepository extends BaseRepository<Users> {
    constructor() {
        super(Users);
    }

    async find(options: any): Promise<UserDTO[]> {
        return this.repository.find(options);
    }

    async findById(user_id: number): Promise<UserDTO> {
        return this.repository.findOneBy({ user_id });
    }

    async save(user: UserDTO): Promise<UserDTO> {
        return this.repository.save(user);
    }

    async update(user_id: number, user: UserDTO): Promise<UserDTO> {
        await this.repository.update(user_id, user);
        return this.repository.findOneBy({ user_id });
    }

    async delete(user_id: number): Promise<UserDTO> {
        const user = await this.repository.findOneBy({ user_id });
        return this.repository.remove(user);
    }

    async updateRole(user_id: number, role: Role): Promise<UserDTO> {
        const user = await this.repository.findOneBy({ user_id });
        user.role = role;
        return this.repository.save(user);
    }

    async findByName(fullname: string): Promise<Users> {
        const user = await this.repository.findOne({
            where: { fullname: Like(`%${fullname}%`) }  // Using Like for partial matches
        });
        if (!user) {
            throw new Error(`User with name ${fullname} not found`);
        }
        return user;
    }
}