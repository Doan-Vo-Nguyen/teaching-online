import bcrypt from "bcrypt";
import { IUserRepository } from "../interfaces/users.interface";
import { UserRepository } from "../repositories/users.repository";
import { ClassesRepository } from "../repositories/classes.repository";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
import { generateRandomCode } from "../utils/GenerateCode";
import { ApiError } from "../types/ApiError";
import { Role } from "../entity/User.entity";
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
  NOT_TEACHER,
  CLASS_ALREADY_EXISTS,
} from "../DTO/resDto/BaseErrorDto";

const saltRound = 10;

class UserService {
  private readonly userRepository: IUserRepository = new UserRepository();
  private readonly classesRepository: ClassesRepository =
    new ClassesRepository();
  private readonly studentClassesRepository: StudentClassesRepository =
    new StudentClassesRepository();

  public async getAllUsers() {
    const users = await this.userRepository.find({});
    return users.map(
      ({
        user_id,
        username,
        fullname,
        gender,
        dob,
        email,
        address,
        phone,
        profile_picture,
        role,
      }) => ({
        user_id,
        username,
        fullname,
        gender,
        dob,
        email,
        address,
        phone,
        profile_picture,
        role,
      })
    );
  }

  public async getUserById(userId: number) {
    this.validateField(userId, FIELD_REQUIRED);
    const user = await this.userRepository.findById(userId);
    if (!user)
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    return user;
  }

  public async getUserByName(fullname: string) {
    this.validateField(fullname, FIELD_REQUIRED);
    const user = await this.userRepository.findByName(fullname);
    if (!user)
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    return user;
  }

  public async createUser(userData: any) {
    const { username, email, password } = userData;
    const existedUser = await this.userRepository.findByUsernameEmail(
      username,
      email
    );
    if (existedUser) this.handleExistingUser(existedUser, username, email);
    userData.password = bcrypt.hashSync(password, saltRound);
    const newUser = await this.userRepository.save(userData);
    if (!newUser) throw new ApiError(400, CREATED_USER_FAILED.error.message);
    return newUser;
  }

  public async updateUser(id: number, userData: any) {
    this.validateField(id, FIELD_REQUIRED);
    const user = await this.userRepository.findById(id);
    if (!user)
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    if (userData.password)
      userData.password = bcrypt.hashSync(userData.password, saltRound);
    else delete userData.password;
    return await this.userRepository.update(id, {
      ...userData,
      updated_at: new Date(),
    });
  }

  public async updateUserRole(userId: number, role: Role) {
    this.validateField(userId, FIELD_REQUIRED);
    this.validateField(role, FIELD_REQUIRED);
    const user = await this.userRepository.findById(userId);
    if (!user)
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    return await this.userRepository.update(userId, {
      role,
      updated_at: new Date(),
    });
  }

  public async deleteUser(userId: number) {
    this.validateField(userId, FIELD_REQUIRED);
    const user = await this.userRepository.findById(userId);
    if (!user)
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    return await this.userRepository.delete(userId);
  }

  public async joinClass(userId: number, classJoinCode: string) {
    this.validateField(userId, FIELD_REQUIRED);
    this.validateField(classJoinCode, FIELD_REQUIRED);
    const user = await this.userRepository.findById(userId);
    this.validateUserForClassJoin(user);
    const classData =
      await this.classesRepository.findByClassCode(classJoinCode);
    this.validateClassData(classData);
    await this.checkExistingEnrollment(userId, classData.class_id);
    return await this.userRepository.joinClass(userId, classData.class_id);
  }

  public async addClass(teacherId: number, classData: any) {
    this.validateField(teacherId, FIELD_REQUIRED);
    this.validateField(classData, FIELD_REQUIRED);
    const teacher = await this.userRepository.findById(teacherId);
    this.validateCreatorForClassAdd(teacher);
    await this.validateClassExists(classData);
    classData.class_code = generateRandomCode();
    const newClass = await this.classesRepository.addClass(
      teacherId,
      classData
    );
    return await this.userRepository.addClass(teacherId, newClass);
  }

  public async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ) {
    this.validateField(id, FIELD_REQUIRED);
    this.validateField(oldPassword, FIELD_REQUIRED);
    this.validateField(newPassword, FIELD_REQUIRED);
    const user = await this.userRepository.findById(id);
    if (!user)
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    if (!bcrypt.compareSync(oldPassword, user.password))
      throw new ApiError(
        400,
        WRONG_OLD_PASSWORD.error.message,
        WRONG_OLD_PASSWORD.error.details
      );
    const hashedPassword = bcrypt.hashSync(newPassword, saltRound);
    return await this.userRepository.changePassword(id, hashedPassword);
  }

  private validateField(field: any, error: any) {
    if (!field)
      throw new ApiError(400, error.error.message, error.error.details);
  }

  private handleExistingUser(
    existedUser: any,
    username: string,
    email: string
  ) {
    if (existedUser.username === username)
      throw new ApiError(409, USERNAME_EXISTS.error.message);
    if (existedUser.email === email)
      throw new ApiError(409, EMAIL_EXISTS.error.message);
    throw new ApiError(409, USER_EXISTS.error.message);
  }

  private validateUserForClassJoin(user: any) {
    if (!user)
      throw new ApiError(
        404,
        USER_NOT_EXISTS.error.message,
        USER_NOT_EXISTS.error.details
      );
    if (user.role !== Role.STUDENT)
      throw new ApiError(
        400,
        NOT_STUDENT.error.message,
        NOT_STUDENT.error.details
      );
  }

  private validateClassData(classData: any) {
    if (!classData)
      throw new ApiError(
        404,
        CLASS_NOT_FOUND.error.message,
        CLASS_NOT_FOUND.error.details
      );
  }

  private async checkExistingEnrollment(userId: number, classId: number) {
    const existingEnrollment =
      await this.studentClassesRepository.findByUserIdAndClassId(
        userId,
        classId
      );
    if (existingEnrollment)
      throw new ApiError(
        400,
        ALREADY_ENROLL.error.message,
        ALREADY_ENROLL.error.details
      );
  }

  private async validateClassExists(classData: any) {
    const existingClass = await this.classesRepository.findByClassName(
      classData.class_name
    );
    console.log(existingClass);
    if (existingClass)
      throw new ApiError(
        409,
        CLASS_ALREADY_EXISTS.error.message,
        CLASS_ALREADY_EXISTS.error.details
      );
  }

  private validateCreatorForClassAdd(user: any) {
    if (!user || (user.role !== Role.TEACHER && user.role !== Role.ADMIN))
      throw new ApiError(
        400,
        NOT_TEACHER.error.message,
        NOT_TEACHER.error.details
      );
  }

  public getUserByRole(role: Role) {
    return this.userRepository.getUserByRole(role);
  }
}

export default UserService;
