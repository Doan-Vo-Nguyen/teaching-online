import { IUserRepository } from "../interfaces/users.interface";
import { UserRepository } from "../repositories/users.repository";
import bcrypt from "bcrypt";
import {
    USER_NOT_EXISTS,
    FIELD_REQUIRED,
    USERNAME_EXISTS,
    EMAIL_EXISTS,
    USER_EXISTS,
    CREATED_USER_FAILED,
    WRONG_OLD_PASSWORD,
    NOT_STUDENT,
    CLASS_NOT_FOUND,
    ALREADY_ENROLL,
} from "../DTO/resDto/BaseErrorDto";
import { ApiError } from "../types/ApiError";
import { Role } from "../entity/User.entity";
import { ClassesRepository } from "../repositories/classes.repository";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
const saltRound = 10;
class UserService {
    private readonly userRepository: IUserRepository = new UserRepository();
    private readonly classesRepository: ClassesRepository = new ClassesRepository();
    private readonly studentClassesRepository: StudentClassesRepository = new StudentClassesRepository();

    public async getAllUsers() {
        const users = await this.userRepository.find({});
        return users.map(user => {
            const { user_id, username, fullname, gender, dob, email, address, phone, profile_picture, role} = user;
            return { user_id, username, fullname, gender, dob, email, address, phone, profile_picture, role};
        });
    }

    public async getUserById(userId: number) {
        if (!userId) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        return user;
    }

    public async getUserByName(fullname: string) {
        if (!fullname) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findByName(fullname);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        return user;
    }

    public async createUser(userData: any) {
        const { username, email } = userData;
        const existedUser = await this.userRepository.findByUsernameEmail(username, email);

        if (existedUser) {
            if (existedUser.username === username) {
                throw new ApiError(409, USERNAME_EXISTS.error.message);
            } else if (existedUser.email === email) {
                throw new ApiError(409, EMAIL_EXISTS.error.message);
            }
            throw new ApiError(409, USER_EXISTS.error.message);
        }

        userData.password = bcrypt.hashSync(userData.password, saltRound);
        const newUser = await this.userRepository.save(userData);

        if (!newUser) {
            throw new ApiError(400, CREATED_USER_FAILED.error.message);
        }
        return newUser;
    }

    public async updateUser(id: number, userData: any) {
        if (!id) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        // Only hash the password if it's provided
        if (userData.password) {
            userData.password = bcrypt.hashSync(userData.password, saltRound);
        } else {
            delete userData.password;
        }
    
        const updatedUser = { ...userData, updated_at: new Date() };
        return await this.userRepository.update(id, updatedUser);
    }
    

    public async updateUserRole(userId: number, role: Role) {
        if (!userId || !role) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        const updateRole = { role, updated_at: new Date() };
        return await this.userRepository.update(userId, updateRole);
    }

    public async deleteUser(userId: number) {
        if (!userId) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        return await this.userRepository.delete(userId);
    }

    public async joinClass(userId: number, classJoinCode: string) {
        this.validateJoinClassInputs(userId, classJoinCode);

        const user = await this.userRepository.findById(userId);
        this.validateUserForClassJoin(user);

        const classData = await this.classesRepository.findByClassCode(classJoinCode);
        this.validateClassData(classData);

        const classId = classData.class_id;
        await this.checkExistingEnrollment(userId, classId);

        return await this.userRepository.joinClass(userId, classId);
    }

    private validateJoinClassInputs(userId: number, classJoinCode: string) {
        if (!userId || !classJoinCode) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
    }

    private validateUserForClassJoin(user: any) {
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        if (user.role !== Role.STUDENT) {
            throw new ApiError(400, NOT_STUDENT.error.message, NOT_STUDENT.error.details);
        }
    }

    private validateClassData(classData: any) {
        if (!classData) {
            throw new ApiError(404, CLASS_NOT_FOUND.error.message, CLASS_NOT_FOUND.error.details);
        }
    }

    private async checkExistingEnrollment(userId: number, classId: number) {
        const existingEnrollment = await this.studentClassesRepository.findByUserIdAndClassId(userId, classId);
        if (existingEnrollment) {
            throw new ApiError(400, ALREADY_ENROLL.error.message, ALREADY_ENROLL.error.details);
        }
    }

    public async changePassword(id: number, oldPassword: string, newPassword: string) {
        if (!id || !oldPassword || !newPassword ) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApiError(404, USER_NOT_EXISTS.error.message, USER_NOT_EXISTS.error.details);
        }
        if(!bcrypt.compareSync(oldPassword, user.password)) {
            throw new ApiError(400, WRONG_OLD_PASSWORD.error.message, WRONG_OLD_PASSWORD.error.details);
        }
        const hashedPassword = bcrypt.hashSync(newPassword, saltRound);
        return await this.userRepository.changePassword(id, hashedPassword);
    }
}

export default UserService;
