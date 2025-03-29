import { ApiError } from "../types/ApiError";
import { ExamContentDetailsRepository } from '../repositories/exam-content-details.repository';
import { IExamContentDetailsRepository } from '../interfaces/exam-content-details.interface';
import { ExamContentDetails } from '../entity/ExamContentDetails.entity';
import { EXAM_CONTENT_DETAILS_FIELD_REQUIRED, EXAM_CONTENT_DETAILS_NOT_FOUND } from "../DTO/resDto/BaseErrorDto";

class ExamContentDetailsService {
    private readonly examContentDetailsRepository: IExamContentDetailsRepository = new ExamContentDetailsRepository();

    public async getAllExamContentDetails(): Promise<ExamContentDetails[]> {
        const examContentDetails = await this.examContentDetailsRepository.find({});
        if (examContentDetails.length === 0) {
            throw new ApiError(404, EXAM_CONTENT_DETAILS_NOT_FOUND.error.message, EXAM_CONTENT_DETAILS_NOT_FOUND.error.details);
        }
        return examContentDetails;
    }

    public async createExamContentDetails(exam_content_id: number, examContentDetails: ExamContentDetails): Promise<ExamContentDetails> {
        if (!examContentDetails) {
            throw new ApiError(400, EXAM_CONTENT_DETAILS_FIELD_REQUIRED.error.message, EXAM_CONTENT_DETAILS_FIELD_REQUIRED.error.details);
        }
        // save the examContentDetails
        const createdExamContentDetails = await this.examContentDetailsRepository.createExamContentDetails(exam_content_id, examContentDetails);
        // return the created examContentDetails
        return createdExamContentDetails;
    }

    public async updateExamContentDetails(exam_content_details_id: number, examContentDetails: ExamContentDetails): Promise<ExamContentDetails> {
        if (!examContentDetails) {
            throw new ApiError(400, EXAM_CONTENT_DETAILS_FIELD_REQUIRED.error.message, EXAM_CONTENT_DETAILS_FIELD_REQUIRED.error.details);
        }
        return await this.examContentDetailsRepository.update(exam_content_details_id, examContentDetails);
    }

    public async deleteExamContentDetails(exam_content_details_id: number): Promise<ExamContentDetails> {
        if (!exam_content_details_id) {
            throw new ApiError(400, EXAM_CONTENT_DETAILS_FIELD_REQUIRED.error.message, EXAM_CONTENT_DETAILS_FIELD_REQUIRED.error.details);
        }
        return await this.examContentDetailsRepository.delete(exam_content_details_id);
    }
}

export default ExamContentDetailsService;