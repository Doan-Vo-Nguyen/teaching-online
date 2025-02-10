import { Users } from "../entity/User.entity";

export interface IUserRepository {
    find(options: any): Promise<Users[]>
    findById(user_id: number): Promise<Users>
    save(user: Users): Promise<Users>
    update(user_id: number, user: Users): Promise<Users>
    updateRole(user_id: number, role: string): Promise<Users>
    delete(user_id: number): Promise<Users>
}