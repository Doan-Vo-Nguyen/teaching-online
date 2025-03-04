import { Exam } from "../entity/Exam.entity"
import { IBaseRepository } from "./base.interface";

export interface IExamRepository extends IBaseRepository<Exam> {
    createExamByClassAndTeacher(class_id: number, teacher_id: number, exam: Exam): Promise<Exam>
}