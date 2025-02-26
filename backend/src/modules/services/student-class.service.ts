import { IStudentClassesRepository } from "../interfaces/student-classes.interface";
import { StudentClassesRepository } from "../repositories/student-classes.repository";

class StudentClassesService {
  private readonly studentClassesRepository: IStudentClassesRepository =
    new StudentClassesRepository();

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
}

export default StudentClassesService;
