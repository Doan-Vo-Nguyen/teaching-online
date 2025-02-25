import { StudentClasses } from "../entity/Student_classes.entity";
import { IBaseRepository } from "./base.interface";

export interface IStudentClassesRepository extends IBaseRepository<StudentClasses> {
    findByUserIdAndClassId(student_id: number, class_id: number): Promise<StudentClasses>
    enrollClass(student_id: number, class_id: number): Promise<StudentClasses>
}   