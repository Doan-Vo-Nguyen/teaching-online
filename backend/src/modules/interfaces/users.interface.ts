import { Users } from "../entity/User.entity";
import { IBaseRepository } from "./base.interface";

export interface IUserRepository extends IBaseRepository<Users> {
    updateRole(user_id: number, role: string): Promise<Users>
    findByName(fullname: string): Promise<Users>
}