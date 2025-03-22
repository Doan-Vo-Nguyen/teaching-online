import { ExamSubmissionContent } from "../entity/ExamSubmissionContent.entity";
import { IBaseRepository } from "./base.interface";

export interface IExamSubmissionContentRepository extends IBaseRepository<ExamSubmissionContent> {
    findByExamSubmissionId(exam_submission_id: number): Promise<ExamSubmissionContent[]>;
    createExamSubmissionContentByExamSubmissionId(exam_submission_id: number, data: ExamSubmissionContent): Promise<ExamSubmissionContent>;
}