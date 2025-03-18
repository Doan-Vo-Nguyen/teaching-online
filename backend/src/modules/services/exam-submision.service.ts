import { EXAM_SUBMISSION_FIELD_REQUIRED } from "../DTO/resDto/BaseErrorDto";
import { ExamSubmission } from "../entity/Exam_submission.entity";
import { IClassesRepository } from "../interfaces/classes.interface";
import { IExamSubmissionContentRepository } from "../interfaces/exam-submission-content.interface";
import { IExamSubmissionRepository } from "../interfaces/exam-submission.interface";
import { IStudentClassesRepository } from "../interfaces/student-classes.interface";
import { ClassesRepository } from "../repositories/classes.repository";
import { ExamSubmissionContentRepository } from "../repositories/exam-submission-content.repository";
import { ExamSubmissionRepository } from "../repositories/exam-submission.repository";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
import { ApiError } from "../types/ApiError";

class ExamSubmissionService {
    private readonly examSubmissionRepository: IExamSubmissionRepository = new ExamSubmissionRepository();
    private readonly studentClassRepository: IStudentClassesRepository = new StudentClassesRepository();
    private readonly classRepository: IClassesRepository = new ClassesRepository();
    private readonly examSubmissionContentRepository: IExamSubmissionContentRepository = new ExamSubmissionContentRepository();
    constructor() {
        this.studentClassRepository = new StudentClassesRepository();
    }

    public async get(options: any): Promise<ExamSubmission[]> {
        return await this.examSubmissionRepository.find(options);
    }

    public async getExamSubmissionByExamId(exam_id: number): Promise<ExamSubmission[]> {
        if (!exam_id) {
            throw new ApiError(400, EXAM_SUBMISSION_FIELD_REQUIRED.error.message, EXAM_SUBMISSION_FIELD_REQUIRED.error.details);
        }
        const exam = await this.examSubmissionRepository.findByExamId(exam_id);
        if (!exam) {
            throw new ApiError(404, "Exam not found", "Exam not found");
        }
        return await this.examSubmissionRepository.getExamSubmissionByExamId(exam_id);
    }

    public async getExamSubmissionByOneStudent(student_id: number, class_id: number, exam_id: number): Promise<ExamSubmission> {
        if (!exam_id || !student_id) {
            throw new ApiError(400, EXAM_SUBMISSION_FIELD_REQUIRED.error.message, EXAM_SUBMISSION_FIELD_REQUIRED.error.details);
        }
        const existedStudentClass = await this.studentClassRepository.findByStudentId(student_id);
        if (!existedStudentClass) {
            throw new ApiError(404, "Student class not found", "Student class not found");
        }
        const existedClass = await this.classRepository.findById(class_id);
        if (!existedClass) {
            throw new ApiError(404, "Class not found", "Class not found");
        }
        const stcl = await this.studentClassRepository.findByUserIdAndClassId(student_id, class_id);
        const result = await this.examSubmissionRepository.findByExamIdAndStudentClassId(exam_id, stcl.student_class_id);
        return result;
    }

    public async getExamSubmissionHaveSubmit(class_id: number, exam_id: number): Promise<ExamSubmission[]> {
        if (!class_id || !exam_id) {
            throw new ApiError(400, EXAM_SUBMISSION_FIELD_REQUIRED.error.message, EXAM_SUBMISSION_FIELD_REQUIRED.error.details);
        }
        const classInfo = await this.studentClassRepository.findByClassId(class_id);
        if (!classInfo) {
            throw new ApiError(404, "Class not found", "Class not found");
        }
        // get all students in class
        const listUser = await this.studentClassRepository.getAllStudentByClass(class_id);
        const listExamSubmission = [];
        // also add the student_id in the list too for display in the API response
        for (const user of listUser) {
            const examSubmission = await this.examSubmissionRepository.getExamSubmissionByOneStudent(user.student_id, class_id, exam_id);
            if (examSubmission) {
                listExamSubmission.push(examSubmission);
                examSubmission.student_id = user.student_id;
            }
        }
        return listExamSubmission;
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

    public async createExamSubmissionByStudentAndClass(
        exam_id: number,
        student_id: number,
        class_id: number,
        data: { file_content: string; grade?: number; feed_back?: string }
    ): Promise<ExamSubmission> {
        this.validateExamSubmissionData(data);

        const studentClass = await this.getStudentClass(student_id, class_id);

        const newExamSubmission = await this.createExamSubmissionRecord(exam_id, studentClass.student_class_id, data);

        await this.createExamSubmissionContent(newExamSubmission.exam_submission_id, data.file_content);

        return newExamSubmission;
    }

    private validateExamSubmissionData(data: { file_content: string; grade?: number; feed_back?: string }): void {
        if (!data || !data.file_content) {
            throw new ApiError(
                400,
                EXAM_SUBMISSION_FIELD_REQUIRED.error.message,
                EXAM_SUBMISSION_FIELD_REQUIRED.error.details
            );
        }
    }

    private async getStudentClass(student_id: number, class_id: number) {
        const studentClass = await this.studentClassRepository.findByUserIdAndClassId(student_id, class_id);
        if (!studentClass) {
            throw new ApiError(404, "Student class not found", "Student class not found");
        }
        return studentClass;
    }

    private async createExamSubmissionRecord(
        exam_id: number,
        student_class_id: number,
        data: { file_content: string; grade?: number; feed_back?: string }
    ): Promise<ExamSubmission> {
        return await this.examSubmissionRepository.save({
            ...data,
            exam_id,
            student_class_id,
            submitted_at: new Date(),
            updated_at: new Date(),
            grade: null,
            feed_back: null,
            exam_submission_id: 0,
        });
    }

    private async createExamSubmissionContent(exam_submission_id: number, file_content: string): Promise<void> {
        await this.examSubmissionContentRepository.save({
            exam_submission_id,
            file_content,
            id: 0,
            created_at: new Date(),
        });
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