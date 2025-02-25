import { Role, Users } from "../entity/User.entity";
import { UserDTO } from '../DTO/users.dto';
import { BaseRepository } from './base.repository';
import { Like } from "typeorm";
import { StudentClassesRepository } from "./student-classes.repository";

export class UserRepository extends BaseRepository<Users> {
    private readonly studentClassesRepository: StudentClassesRepository = new StudentClassesRepository();
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

    async changePassword(id: number, newPassword: string): Promise<Users> {
        const user = await this.repository.findOne({ where: { user_id: id } });
        user.password = newPassword;
        return this.repository.save(user);
    }

    async forgotPassword(email: string): Promise<Users> {
        const user = await this.repository.findOne({ where: { email } });
        user.password = '123456'; // Reset password to default
        user.updated_at = new Date();
        return this.repository.save(user);
    }

    // Join class by class_join_code (the user with user_id types the code, it will compare with the class_code in classes table, then will join the student_classes table with student_id and class_id)
    async joinClass(user_id: number, class_id: number): Promise<Users> {
        await this.studentClassesRepository.enrollClass(user_id, class_id);
        return this.repository.findOneBy({ user_id });
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