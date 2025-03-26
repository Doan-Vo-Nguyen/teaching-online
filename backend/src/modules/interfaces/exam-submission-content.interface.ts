import { ExamSubmissionContent } from "../entity/Exam_Submission_Content.entity";
import { IBaseRepository } from "./base.interface";

export interface IExamSubmissionContentRepository extends IBaseRepository<ExamSubmissionContent> {
    findByExamSubmissionId(exam_submission_id: number): Promise<ExamSubmissionContent[]>;
    createExamSubmissionContentByExamSubmissionId(exam_submission_id: number, data: ExamSubmissionContent): Promise<ExamSubmissionContent>;
    deleteExamSubmissionContent(exam_submission_id: number, exam_submission_content_id: number): Promise<ExamSubmissionContent>
}