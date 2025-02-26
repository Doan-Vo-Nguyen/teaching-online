import { UserRepository } from "./../repositories/users.repository";
import { ClassesDTO } from "../DTO/classes.dto";
import { IClassesRepository } from "../interfaces/classes.interface";
import { ClassesRepository } from "../repositories/classes.repository";
import { ApiError } from "../types/ApiError";
import {
  CREATE_FAILED,
  FIELD_REQUIRED,
  NOT_FOUND,
} from "../DTO/resDto/BaseErrorDto";
import { generateRandomCode } from "../utils/GenerateCode";

class ClassesService {
  private readonly classesRepository: IClassesRepository =
    new ClassesRepository();
  private readonly userRepository: UserRepository = new UserRepository();

  public async getAllClasses() {
    const classes = await this.classesRepository.find({});
    const classesWithTeachers = await Promise.all(
      classes.map(async (classItem) => {
        const teacher = await this.userRepository.findById(
          classItem.teacher_id
        );
        return {
          ...classItem,
          teacher: teacher ? teacher.fullname : null,
        };
      })
    );
    return classesWithTeachers;
  }

  public async getClassById(class_id: number) {
    if (!class_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const classData = await this.classesRepository.findById(class_id);
    if (!classData) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    return classData;
  }

  public async createClass(classData: ClassesDTO) {
    if (!classData) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    classData.class_code = generateRandomCode();
    const newClasses = await this.classesRepository.save(classData);
    if (!newClasses) {
      throw new ApiError(
        400,
        CREATE_FAILED.error.message,
        CREATE_FAILED.error.details
      );
    }
    return newClasses;
  }

  public async updateClass(id: number, classData: ClassesDTO) {
    if (!id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const existedClass = await this.classesRepository.findById(id);
    if (!existedClass) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    const updatedClass = await this.classesRepository.update(id, classData);
    return updatedClass;
  }

  public async deleteClass(id: number) {
    if (!id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const existedClass = await this.classesRepository.findById(id);
    if (!existedClass) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    await this.classesRepository.delete(id);
  }

  public async findByClassCode(class_code: string) {
    if (!class_code) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const classes = await this.classesRepository.findByClassCode(class_code);
    return classes;
  }
}
export default ClassesService;
