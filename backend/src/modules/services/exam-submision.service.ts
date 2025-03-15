import { EXAM_SUBMISSION_FIELD_REQUIRED } from "../DTO/resDto/BaseErrorDto";
import { ExamSubmission } from "../entity/Exam_submission.entity";
import { IExamSubmissionRepository } from "../interfaces/exam-submission.interface";
import { IStudentClassesRepository } from "../interfaces/student-classes.interface";
import { ExamSubmissionRepository } from "../repositories/exam-submission.repository";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
import { ApiError } from "../types/ApiError";

class ExamSubmissionService {
    private readonly examSubmissionRepository: IExamSubmissionRepository = new ExamSubmissionRepository();
    private readonly studentClassRepository: IStudentClassesRepository = new StudentClassesRepository();

    constructor() {
        this.studentClassRepository = new StudentClassesRepository();
    }

    public async getExamSubmissionByExamId(exam_id: number): Promise<ExamSubmission[]> {
        if (!exam_id) {
            throw new ApiError(400, EXAM_SUBMISSION_FIELD_REQUIRED.error.message, EXAM_SUBMISSION_FIELD_REQUIRED.error.details);
        }
        const exam = await this.examSubmissionRepository.findById(exam_id);
        if (!exam) {
            throw new ApiError(404, "Exam not found", "Exam not found");
        }
        return await this.examSubmissionRepository.getExamSubmissionByExamId(exam_id);
    }

    public async createExamSubmission(exam_id: number, student_class_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission> {
        if (!examSubmission) {
            throw new ApiError(400, EXAM_SUBMISSION_FIELD_REQUIRED.error.message, EXAM_SUBMISSION_FIELD_REQUIRED.error.details);
        }
        const studentClass = await this.studentClassRepository.findById(student_class_id);
        const existedUser = studentClass?.student_id;
        const existedClass = studentClass?.class_id;
        if (!studentClass) {
            throw new ApiError(404, "Student class not found", "Student class not found");
        }
        if (!existedUser) {
            throw new ApiError(404, "User not found", "User not found");
        }
        if (!existedClass) {
            throw new ApiError(404, "Class not found", "Class not found");
        }
        const existedUSerAndClass = await this.studentClassRepository.findByUserIdAndClassId(existedUser, existedClass);
        if (!existedUSerAndClass) {
            throw new ApiError(404, "User not in class", "User not in class");
        }

        return await this.examSubmissionRepository.createExamSubmission(exam_id, student_class_id, examSubmission);
    }

    public async createExamSubmissionByStudentAndClass(exam_id: number, student_id: number, class_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission> {
        if (!examSubmission) {
            throw new ApiError(400, EXAM_SUBMISSION_FIELD_REQUIRED.error.message, EXAM_SUBMISSION_FIELD_REQUIRED.error.details);
        }
        const studentClass = await this.studentClassRepository.findByUserIdAndClassId(student_id, class_id);
        if (!studentClass) {
            throw new ApiError(404, "Student class not found", "Student class not found");
        }
        const student_class_id = studentClass.student_class_id;

        return await this.examSubmissionRepository.createExamSubmission(exam_id, student_class_id, examSubmission);
    }

    public async updateExamSubmission(exam_submission_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission> {    
        if (!examSubmission) {
            throw new ApiError(400, EXAM_SUBMISSION_FIELD_REQUIRED.error.message, EXAM_SUBMISSION_FIELD_REQUIRED.error.details);
        }
        const existedExamSubmission = await this.examSubmissionRepository.findById(exam_submission_id);
        if (!existedExamSubmission) {
            throw new ApiError(404, "Exam submission not found", "Exam submission not found");
        }
        // just update the updated_at field
        examSubmission.updated_at = new Date();
        return await this.examSubmissionRepository.updateExamSubmission(exam_submission_id, examSubmission);
    }

    public async deleteExamSubmission(exam_submission_id: number): Promise<ExamSubmission> {
        const existedExamSubmission = await this.examSubmissionRepository.findById(exam_submission_id);
        if (!existedExamSubmission) {
            throw new ApiError(404, "Exam submission not found", "Exam submission not found");
        }
        return await this.examSubmissionRepository.delete(exam_submission_id);
    }
}

export default ExamSubmissionService;