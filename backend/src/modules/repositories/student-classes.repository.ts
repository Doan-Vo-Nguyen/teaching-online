import { StudentClasses } from "../entity/Student_classes.entity";
import { BaseRepository } from "./base.repository";

export class StudentClassesRepository extends BaseRepository<StudentClasses> {
  constructor() {
    super(StudentClasses);
  }

  async find(options: any): Promise<StudentClasses[]> {
    return this.repository.find(options);
  }

  async findById(student_class_id: number): Promise<StudentClasses> {
    return this.repository.findOneBy({ student_class_id });
  }

  async findByClassId(class_id: number): Promise<StudentClasses[]> {
    return this.repository.find({ where: { class_id } });
  }

  async findByStudentId(student_id: number): Promise<StudentClasses[]> {
    return this.repository.find({ where: { student_id } });
  }

  async findByUserIdAndClassId(
    student_id: number,
    class_id: number
  ): Promise<StudentClasses> {
    return this.repository.findOneBy({ student_id, class_id });
  }

  async enrollClass(
    student_id: number,
    class_id: number
  ): Promise<StudentClasses> {
    const studentClass = new StudentClasses();
    studentClass.student_id = student_id;
    studentClass.class_id = class_id;
    return this.repository.save(studentClass);
  }

  async getStudentJoinedClasses(
    student_id: number,
    class_id: number
  ): Promise<StudentClasses[]> {
    return this.repository.find({ where: { student_id, class_id } });
  }

  async getAllStudentByClass(class_id: number): Promise<StudentClasses[]> {
    return this.repository.find({ where: { class_id } });
  }

  async getAllClassesByStudentJoined(
    student_id: number
  ): Promise<StudentClasses[]> {
    return this.repository.find({ where: { student_id } });
  }

  async leaveClass(
    student_id: number,
    class_id: number
  ): Promise<StudentClasses> {
    const studentClass = await this.repository.findOneBy({ student_id, class_id });
    return this.repository.remove(studentClass);
  }
}
