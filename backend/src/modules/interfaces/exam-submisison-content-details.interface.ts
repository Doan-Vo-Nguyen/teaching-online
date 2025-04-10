import { ExamSubmissionContent } from "../entity/Exam_Submission_Content.entity";
import { ExamSubmissionContentDetails } from "../entity/ExamSubmissionContentDetails.entity";
import { IBaseRepository } from "./base.interface";

export interface IExamSubmissionContentDetailsRepository extends IBaseRepository<ExamSubmissionContentDetails> {
    findById(id: number): Promise<ExamSubmissionContentDetails>;
    findByExamSubmissionContentId(exam_submission_content_id: number): Promise<ExamSubmissionContentDetails[]>;
    findByTestcaseId(testcase_id: number): Promise<ExamSubmissionContentDetails[]>;
    save(examSubmissionContentDetails: ExamSubmissionContentDetails): Promise<ExamSubmissionContentDetails>;
    update(id: number, examSubmissionContentDetails: ExamSubmissionContentDetails): Promise<ExamSubmissionContentDetails>;
    delete(id: number): Promise<ExamSubmissionContentDetails>;
    findByExamSubmissionContentIdAndTestcaseId(
        exam_submission_content_id: number,
        testcase_id: number
    ): Promise<ExamSubmissionContentDetails>;
}