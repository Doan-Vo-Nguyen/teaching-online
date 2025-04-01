import { ExamContent } from "../entity/ExamContent.entity";
import { IBaseRepository } from "./base.interface";

export interface IExamContentRepository extends IBaseRepository<ExamContent> {
    findByExamId(exam_id: number): Promise<ExamContent[]>; // Get exam content by exam id
    findByExamIdAndContentId(exam_id: number, content_id: number): Promise<ExamContent>; // Get exam content by exam id and content id
    updateExamContent(examContentId: number, data: ExamContent): Promise<ExamContent>; // Update exam content
    deleteExamContent(examContentId: number): Promise<ExamContent>; // Delete exam content
}