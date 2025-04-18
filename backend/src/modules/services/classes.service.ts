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
import { StudentClassesRepository } from "../repositories/student-classes.repository";
class ClassesService {
  private readonly classesRepository: IClassesRepository =
    new ClassesRepository();
  private readonly userRepository: UserRepository = new UserRepository();
  private readonly studentClassesRepository: StudentClassesRepository =
    new StudentClassesRepository();

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
    const teacher = await this.userRepository.findById(classData.teacher_id);
    return {
      ...classData,
      teacher: teacher ? teacher.fullname : null,
    };
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
    const classEntity = {
      ...classData,
      studentClasses: [], // or provide the appropriate value
      lectures: [], // or provide the appropriate value
      assignments: [], // or provide the appropriate value
      exams: [], // or provide the appropriate value
      notifications: [], // or provide the appropriate value
      meets: [], // or provide the appropriate value
    };
    const newClasses = await this.classesRepository.save(classEntity);
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

  public async getClassByTeacherId(teacher_id: number) {
    if (!teacher_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const classes =
      await this.classesRepository.getClassByTeacherId(teacher_id);
    const classesWithTeacher = await Promise.all(
      classes.map(async (classItem) => {
        const teacher = await this.userRepository.findById(teacher_id);
        return {
          ...classItem,
          teacher: teacher ? teacher.fullname : null,
        };
      })
    );
    return classesWithTeacher;
  }

  public async getClassDetailsByTeacher(class_id: number, teacher_id: number) {
    if (!class_id || !teacher_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const classData = await this.classesRepository.getClassDetailsByTeacher(
      class_id,
      teacher_id
    );
    if (!classData) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    const studentClasses = await this.studentClassesRepository.find({
      where: { class_id },
    });
    const teacher = await this.userRepository.findById(teacher_id);
    if (!teacher) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    const students = await Promise.all(
      studentClasses.map(async (studentClass) => {
        const student = await this.userRepository.findById(
          studentClass.student_id
        );
        return student;
      })
    );
    return {
      ...classData,
      teacher: teacher.fullname,
      students,
    };
  }
}
export default ClassesService;
