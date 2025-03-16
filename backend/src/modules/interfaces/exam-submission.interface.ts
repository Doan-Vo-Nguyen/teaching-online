import { ExamSubmission } from "../entity/Exam_submission.entity";
import { IBaseRepository } from "./base.interface";

export interface IExamSubmissionRepository extends IBaseRepository<ExamSubmission> {
    findByExamId(exam_id: number): Promise<ExamSubmission[]>;
    getExamSubmissionByExamId(exam_id: number): Promise<ExamSubmission[]>
    createExamSubmission(exam_id: number, student_class_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission>
    createExamSubmissionByStudentAndClass(exam_id: number, student_id: number, class_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission>
    updateExamSubmission(exam_submission_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission>
}