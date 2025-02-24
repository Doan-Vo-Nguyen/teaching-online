import { Users } from "../entity/User.entity";
import { IBaseRepository } from "./base.interface";

export interface IUserRepository extends IBaseRepository<Users> {
    updateRole(user_id: number, role: string): Promise<Users>
    findByName(fullname: string): Promise<Users>
    findByEmail(email: string): Promise<Users>
    comparePassword(email: string, plainPass: string): Promise<boolean>
    generateToken(email: string): Promise<string>
    findByUsernameEmail(username: string, email: string): Promise<Users>
    changePassword(id: number, newPassword: string): Promise<Users>
    forgotPassword(email: string): Promise<Users>
}