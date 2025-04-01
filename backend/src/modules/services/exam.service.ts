import { StudentClassesRepository } from './../repositories/student-classes.repository';
import { StudentClasses } from './../entity/Student_classes.entity';
import { UserRepository } from './../repositories/users.repository';
import { sendExamMailToClass } from './../utils/mailer';
import { EXAM_FIELD_REQUIRED, EXAM_NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { Exam } from "../entity/Exam.entity";
import { ExamContent } from "../entity/ExamContent.entity";
import { IExamContentRepository } from "../interfaces/exam-content.interface";
import { IExamRepository } from "../interfaces/exam.interface";
import { ExamContentRepository } from "../repositories/exam-content.repository";
import { ExamRepository } from "../repositories/exam.repository";
import { ApiError } from "../types/ApiError";
import { NotificationRepository } from '../repositories/notification.repository';
import { TestCase } from '../entity/Testcase.entity';
import { ITestCaseRepository } from '../interfaces/testcase.interface';
import { TestCaseRepository } from '../repositories/testcase.repository';
class ExamService {
    private readonly examRepository: IExamRepository = new ExamRepository();
    private readonly examContentRepository: IExamContentRepository = new ExamContentRepository();
    private readonly userRepository: UserRepository = new UserRepository();
    private readonly studentClassesRepository: StudentClassesRepository = new StudentClassesRepository();
    private readonly notificationRepository: NotificationRepository = new NotificationRepository();
    private readonly testCaseRepository: ITestCaseRepository = new TestCaseRepository();

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
        if (!exam) {
            throw new ApiError(400, EXAM_FIELD_REQUIRED.error.message, EXAM_FIELD_REQUIRED.error.details);
        }
        return await this.examRepository.save(exam);
    }

    // * integrated the send mail to all students in the class(with the email in the users) when exam is created
    public async createExamByClassAndTeacher(class_id: number, teacher_id: number, exam: Exam): Promise<Exam> {
        if (!exam) {
            throw new ApiError(400, EXAM_FIELD_REQUIRED.error.message, EXAM_FIELD_REQUIRED.error.details);
        }
        
        // Save the new exam
        exam.class_id = class_id;
        const newExam = await this.examRepository.save(exam);   
        try {
            // Get student emails from the class
            const emails = await this.getStudentEmailsByClassId(exam.class_id);
            
            // Send notification to students
            if (emails.length > 0) {
                await this.sendExamMailNotification(emails, exam.title, exam.description);
            }
            await this.notificationRepository.save({
                title: exam.title,
                content: exam.description,
                class_id: class_id,
                teacher_id: teacher_id,
                notification_id: undefined,
                created_at: new Date(),
                updated_at: new Date()
            });
        } catch (error) {
            // Log error but don't fail the exam creation
            console.error('Failed to send exam notifications:', error);
        }
        return newExam;
    }

    // * create testcase for an exam
    public async createTestcase(exam_id: number, testcase: TestCase): Promise<TestCase> {
        return await this.testCaseRepository.createTestcase(exam_id, testcase);
    }

    private async getStudentEmailsByClassId(classId: number): Promise<string[]> {
        // Get all students in the class
        const studentClasses = await this.studentClassesRepository.findByClassId(classId);
        if (!studentClasses.length) return [];
        
        // Extract student IDs
        const studentIds = studentClasses.map((studentClass: StudentClasses) => studentClass.student_id);
        
        // Get student details
        const students = await this.userRepository.findByIds(studentIds);
        
        // Extract and return email addresses
        return students.map((student: any) => student.email);
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

    public async updateExamContent(examContentId: number, data: ExamContent): Promise<ExamContent> {
        return await this.examContentRepository.update(examContentId, data);
    }

    public async deleteExamContent(examContentId: number): Promise<ExamContent> {
        const examContent = await this.examContentRepository.findById(examContentId);
        if (!examContent) {
            throw new ApiError(404, EXAM_NOT_FOUND.error.message, EXAM_NOT_FOUND.error.details);
        }

        return await this.examContentRepository.delete(examContentId);
    }

    private async sendExamMailNotification(to: string[], title: string, content: string) {
        // * send mail to all students in the class
        try {
            await sendExamMailToClass(to, title, content);
            console.log(`Mail sent to ${to} with exam notification`);
        }
        catch (error) {
            console.error(`Failed to send mail to ${to}:`, error);
        }
    }

    public async getDetailExam(id: number, exam_content_id: number): Promise<ExamContent> {
        return await this.examContentRepository.getDetailExam(id, exam_content_id);
    }
}

export default ExamService;