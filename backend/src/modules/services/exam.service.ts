import { EXAM_FIELD_REQUIRED, EXAM_NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { Exam } from "../entity/Exam.entity";
import { IExamRepository } from "../interfaces/exam.interface";
import { ExamRepository } from "../repositories/exam.repository";
import { ApiError } from "../types/ApiError";

class ExamService {
    private readonly examRepository: IExamRepository = new ExamRepository();

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
}

export default ExamService;