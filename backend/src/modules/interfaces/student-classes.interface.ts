import { StudentClasses } from "../entity/Student_classes.entity";
import { IBaseRepository } from "./base.interface";

export interface IStudentClassesRepository
  extends IBaseRepository<StudentClasses> {
  getStudentJoinedClasses(
    student_id: number,
    class_id: number
  ): Promise<StudentClasses[]>; // Get student joined classes
  findByClassId(class_id: number): Promise<StudentClasses[]>; // Find by class id
  findByUserIdAndClassId(
    student_id: number,
    class_id: number
  ): Promise<StudentClasses>; // Find by user id and class id
  getAllStudentByClass(class_id: number): Promise<StudentClasses[]>; // Get all students by class id
  getAllClassesByStudentJoined(student_id: number): Promise<StudentClasses[]>; // Get all classes by student joined
  enrollClass(student_id: number, class_id: number): Promise<StudentClasses>; // Enroll a class
  leaveClass(student_id: number, class_id: number): Promise<StudentClasses>;
}
