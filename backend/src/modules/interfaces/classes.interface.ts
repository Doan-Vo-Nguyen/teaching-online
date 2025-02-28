import { Classes } from "../entity/Classes.entity";
import { IBaseRepository } from "./base.interface";

export interface IClassesRepository extends IBaseRepository<Classes> {
  getClassByTeacherId(teacher_id: number): Promise<Classes[]>;
  getClassDetailsByTeacher(
    class_id: number,
    teacher_id: number
  ): Promise<Classes>;
  findByClassCode(class_code: string): Promise<Classes>;
  addClass(teacher_id: number, classes: Classes): Promise<Classes>;
}
