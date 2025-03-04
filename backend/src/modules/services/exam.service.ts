import { EXAM_FIELD_REQUIRED, EXAM_NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { Exam } from "../entity/Exam.entity";
import { ExamContent } from "../entity/ExamContent.entity";
import { IExamContentRepository } from "../interfaces/exam-content.interface";
import { IExamRepository } from "../interfaces/exam.interface";
import { ExamContentRepository } from "../repositories/exam-content.repository";
import { ExamRepository } from "../repositories/exam.repository";
import { ApiError } from "../types/ApiError";

class ExamService {
    private readonly examRepository: IExamRepository = new ExamRepository();
    private readonly examContentRepository: IExamContentRepository = new ExamContentRepository();

    constructor() {
        this.examRepository = new ExamRepository();
    }

    public async getAllExams(): Promise<Exam[]> {
        const exams = await this.examRepository.find({});
        if (exams.length === 0) {
            throw new ApiError(404, EXAM_NOT_FOUND.error.message, EXAM_NOT_FOUND.error.details);
        }
        return exams;
    }

    public async getExamById(exam_id: number): Promise<Exam> {
        return await this.examRepository.findById(exam_id);
    }

    public async createExam(exam: Exam): Promise<Exam> {
        if(!exam) {
            throw new ApiError(400, EXAM_FIELD_REQUIRED.error.message, EXAM_FIELD_REQUIRED.error.details);
        }
        return await this.examRepository.save(exam);
    }

    public async updateExam(exam_id: number, exam: Exam): Promise<Exam> {
        return await this.examRepository.update(exam_id, exam);
    }

    public async deleteExam(exam_id: number): Promise<Exam> {
        const exam = await this.examRepository.findById(exam_id);
        if (!exam) {
            throw new ApiError(404, EXAM_NOT_FOUND.error.message, EXAM_NOT_FOUND.error.details);
        }
        return await this.examRepository.delete(exam_id);
    }

    public async getExamContentById(exam_id: number): Promise<ExamContent[]> {
        const examContent = await this.examContentRepository.findByExamId(exam_id);
        if(!examContent) {
            throw new ApiError(404, EXAM_NOT_FOUND.error.message, EXAM_NOT_FOUND.error.details);
        }
        return examContent;
    }

    public async createExamContentByExamId(exam_id: number, data: ExamContent): Promise<ExamContent> {
        const exam = await this.examRepository.findById(exam_id);
        if (!exam) {
            throw new ApiError(404, EXAM_NOT_FOUND.error.message, EXAM_NOT_FOUND.error.details);
        }
        return await this.examContentRepository.save({ ...data, exam_id });
    }

    public async deleteExamContent(examContentId: number): Promise<ExamContent> {
        const examContent = await this.examContentRepository.findById(examContentId);
        if (!examContent) {
            throw new ApiError(404, EXAM_NOT_FOUND.error.message, EXAM_NOT_FOUND.error.details);
        }

        return await this.examContentRepository.delete(examContentId);
    }
}

export default ExamService;