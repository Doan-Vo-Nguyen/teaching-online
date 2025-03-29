import { IBaseRepository } from "./base.interface";
import { ExamContentDetails } from "../entity/ExamContentDetails.entity";

export interface IExamContentDetailsRepository extends IBaseRepository<ExamContentDetails> {
    findByExamContentId(exam_content_id: number): Promise<ExamContentDetails[]>;
    createExamContentDetails(exam_content_id: number, data: ExamContentDetails): Promise<ExamContentDetails>;
    updateExamContentDetails(exam_content_id: number, data: ExamContentDetails): Promise<ExamContentDetails>;
    deleteExamContentDetails(exam_content_id: number, exam_content_details_id: number): Promise<ExamContentDetails>;
}
