import { Users } from "../entity/User.entity";
import { Role } from "../constant/index";
import { UserDTO } from '../DTO/users.dto';
import { BaseRepository } from './base.repository';
import { Like, In } from "typeorm";
import { StudentClassesRepository } from "./student-classes.repository";
import { ClassesRepository } from "./classes.repository";
import { Classes } from "../entity/Classes.entity";

export class UserRepository extends BaseRepository<Users> {
    private readonly studentClassesRepository: StudentClassesRepository = new StudentClassesRepository();
    private readonly classRepository: ClassesRepository = new ClassesRepository();
    constructor() {
        super(Users);
    }

    async find(options: any): Promise<Users[]> {
        return this.repository.find(options);
    }

    async findWithRelations(options: any, relations: string[] = []): Promise<Users[]> {
        return this.repository.find({
            ...options,
            relations
        });
    }

    async findById(user_id: number): Promise<Users> {
        return this.repository.findOneBy({ user_id });
    }

    async findByIds(ids: number[]): Promise<Users[]> {
        return this.repository.findBy({ user_id: In(ids) });
    }

    async save(user: UserDTO): Promise<Users> {
        return this.repository.save(user);
    }

    async update(user_id: number, user: UserDTO): Promise<Users> {
        await this.repository.update(user_id, user);
        return this.findById(user_id);
    }

    async delete(user_id: number): Promise<Users> {
        const user = await this.findById(user_id);
        return this.repository.remove(user);
    }

    async updateRole(user_id: number, role: Role): Promise<Users> {
        const user = await this.findById(user_id);
        user.role = role;
        return this.repository.save(user);
    }

    async findByName(fullname: string): Promise<Users> {
        const user = await this.repository.findOne({
            where: { fullname: Like(`%${fullname}%`) }  // Using Like for partial matches
        });
        return user;
    }

    async findByUsername(username: string): Promise<Users> {
        const user = await this.repository.findOne({
            where: { username }
        });
        return user;
    }

    async findByUsernameEmail(identifier: string): Promise<Users> {
        const user = await this.repository.findOne({
            where: [
                { username: identifier },
                { email: identifier }
            ]
        });
        return user;
    }

    async findByEmail(email: string): Promise<Users> {
        const user = await this.repository.findOne({
            where: { email }
        });
        return user;
    }

    async findByParentPhone(parent_phone: string): Promise<Users> {
        const user = await this.repository.findOne({
            where: { parent_phone }
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

    // Leave class by class_id (the user with user_id will leave the class with class_id)
    async leaveClass(user_id: number, class_id: number): Promise<Users> {
        await this.studentClassesRepository.leaveClass(user_id, class_id);
        return this.repository.findOneBy({ user_id });
    }

    async addClass(teacher_id: number, classes: Classes): Promise<Users> {
        classes.teacher_id = teacher_id;
        await this.classRepository.addClass(teacher_id, classes);
        return this.repository.findOneBy({ user_id: teacher_id });
    }

    async getUserByRole(role: Role): Promise<Users[]> {
        return this.repository.find({ where: { role } });
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