import { Role, Users } from "../entity/User.entity";
import { UserDTO } from '../DTO/users.dto';
import { BaseRepository } from './base.repository';
import { Like } from "typeorm";

export class UserRepository extends BaseRepository<Users> {
    constructor() {
        super(Users);
    }

    async find(options: any): Promise<Users[]> {
        return this.repository.find(options);
    }

    async findById(user_id: number): Promise<Users> {
        return this.repository.findOneBy({ user_id });
    }

    async save(user: UserDTO): Promise<Users> {
        return this.repository.save(user);
    }

    async update(user_id: number, user: UserDTO): Promise<Users> {
        await this.repository.update(user_id, user);
        return this.repository.findOneBy({ user_id });
    }

    async delete(user_id: number): Promise<Users> {
        const user = await this.repository.findOneBy({ user_id });
        return this.repository.remove(user);
    }

    async updateRole(user_id: number, role: Role): Promise<Users> {
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

    async findByUsernameEmail(username: string, email: string): Promise<Users> {
        const user = await this.repository.findOne({
            where: { username}
        });
        if (user) {
            return user;
        }

        let userByEmail = await this.repository.findOne({
            where: { email}
        });
        if (userByEmail) {
            return userByEmail;
        }
        return null;
    }

    async findByEmail(email: string): Promise<Users> {
        const user = await this.repository.findOne({
            where: { email }
        });
        return user;
    }

    async comparePassword(email: string, plainPass: string): Promise<boolean> {
        const user = await this.repository.findOne({ where: { email } });
        return await user.comparePassHash(plainPass);
    }

    async generateToken(email: string): Promise<string> {
        const user = await this.repository.findOne({ where: { email } });
        return await user.generateAuthToken();
    }
}