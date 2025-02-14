import { IUserRepository } from './../interfaces/users.interface';
import { Role, Users } from "../entity/User.entity";
export declare class UserRepository implements IUserRepository {
    private readonly repository;
    find(options: any): Promise<Users[]>;
    findById(user_id: number): Promise<Users>;
    save(user: Users): Promise<Users>;
    update(user_id: number, user: Users): Promise<Users>;
    updateRole(user_id: number, role: Role): Promise<Users>;
    delete(user_id: number): Promise<Users>;
}
