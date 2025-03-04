import { ExamContent } from "../entity/ExamContent.entity";
import { IBaseRepository } from "./base.interface";

export interface IExamContentRepository extends IBaseRepository<ExamContent> {
    findByExamId(exam_id: number): Promise<ExamContent[]>; // Get exam content by exam id
}