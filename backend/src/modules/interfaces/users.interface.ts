import { Classes } from "../entity/Classes.entity";
import { Users } from "../entity/User.entity";
import { Role } from "../constant/index";
import { IBaseRepository } from "./base.interface";

export interface IUserRepository extends IBaseRepository<Users> {
    getUserByRole(role: Role): Promise<Users[]>
    updateRole(user_id: number, role: string): Promise<Users>
    findByName(fullname: string): Promise<Users>
    findByEmail(email: string): Promise<Users>
    comparePassword(email: string, plainPass: string): Promise<boolean>
    generateToken(email: string): Promise<string>
    findByUsernameEmail(username: string, email: string): Promise<Users>
    changePassword(id: number, newPassword: string): Promise<Users>
    forgotPassword(email: string): Promise<Users>
    joinClass(user_id: number, class_join_code: number): Promise<Users>
    leaveClass(user_id: number, class_id: number): Promise<Users>
    addClass(teacher_id: number, classes: Classes): Promise<Users>
}