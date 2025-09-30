import { ClassesRepository } from "./../repositories/classes.repository";
import { STUDENT_NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { IStudentClassesRepository } from "../interfaces/student-classes.interface";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
import { ApiError } from "../types/ApiError";

class StudentClassesService {
  private readonly studentClassesRepository: IStudentClassesRepository =
    new StudentClassesRepository();
  private readonly classesRepository: ClassesRepository =
    new ClassesRepository();

  public async getAllStudentClasses() {
    return await this.studentClassesRepository.find({});
  }

  public async getStudentClassById(student_class_id: number) {
    return await this.studentClassesRepository.findById(student_class_id);
  }

  public async getStudentClassByUserIdAndClassId(
    student_id: number,
    class_id: number
  ) {
    return await this.studentClassesRepository.findByUserIdAndClassId(
      student_id,
      class_id
    );
  }

  public async enrollClass(student_id: number, class_id: number) {
    return await this.studentClassesRepository.enrollClass(
      student_id,
      class_id
    );
  }

  public async getStudentJoinedClasses(student_id: number, class_id: number) {
    const classes = await this.classesRepository.findById(class_id);
    this.throwIfClassNotFound(classes);
    return await this.studentClassesRepository.getStudentJoinedClasses(
      student_id,
      class_id
    );
  }

  public async getAllStudentByClass(class_id: number) {
    const classes = await this.classesRepository.findById(class_id);
    this.throwIfClassNotFound(classes);
    const studentClasses = await this.studentClassesRepository.getAllStudentByClass(class_id);
    return studentClasses;
  }

  public async getAllClassesByStudentJoined(student_id: number) {
    return await this.studentClassesRepository.getAllClassesByStudentJoined(student_id);
  }

  public async getALlStudentClassesByClassSignature(class_signature: string) {
    return await this.studentClassesRepository.getAllStudentClassesByClassSignature(class_signature);
  }

  private throwIfClassNotFound(classData: any): void {
    if (!classData) {
      throw new ApiError(
        404,
        STUDENT_NOT_FOUND.error.message,
        STUDENT_NOT_FOUND.error.details
      );
    }
  }
}

export default StudentClassesService;
