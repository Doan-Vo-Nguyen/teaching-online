import { ExamSubmission } from "../entity/Exam_submission.entity";
import { BaseRepository } from "./base.repository";
import { StudentClassesRepository } from "./student-classes.repository";

export class ExamSubmissionRepository extends BaseRepository<ExamSubmission> {
    private readonly studentClassRepository: StudentClassesRepository = new StudentClassesRepository();
    constructor() {
        super(ExamSubmission);
    }

    async find(options: any): Promise<ExamSubmission[]> {
        return this.repository.find(options);
    }

    async findById(exam_submission_id: number): Promise<ExamSubmission> {
        return this.repository.findOneBy({ exam_submission_id });
    }

    async save(examSubmission: ExamSubmission): Promise<ExamSubmission> {
        return this.repository.save(examSubmission);
    }

    async update(exam_submission_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission> {
        await this.repository.update(exam_submission_id, examSubmission);
        return this.findById(exam_submission_id);
    }

    async delete(exam_submission_id: number): Promise<ExamSubmission> {
        const examSubmission = await this.repository.findOneBy({ exam_submission_id });
        await this.repository.delete(exam_submission_id);
        return examSubmission;
    }

    async findByExamId(exam_id: number): Promise<ExamSubmission[]> {
        return this.repository.find({ where: { exam_id } });
    }

    async findByExamIdAndStudentClassId(exam_id: number, student_class_id: number): Promise<ExamSubmission> {
        return this.repository.findOneBy({ exam_id, student_class_id });
    }

    async getExamSubmissionByExamId(exam_id: number): Promise<ExamSubmission[]> {
        return this.repository.find({ where: { exam_id } });
    }

    async getExamSubmissionByOneStudent(student_id: number, class_id: number, exam_id: number): Promise<ExamSubmission> {
        const studentClass = await this.studentClassRepository.findByUserIdAndClassId(student_id, class_id);
        return this.repository.findOneBy({ exam_id, student_class_id: studentClass.student_class_id });
    }

    // get all exam submission that have been submitted by all students in a class
    async getExamSubmissionHaveSubmit(class_id: number, exam_id: number): Promise<ExamSubmission[]> {
        return this.repository.find({ where: {exam_id, class_id} });
    }

    async createExamSubmission(exam_id: number, student_class_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission> {
        examSubmission.exam_id = exam_id;
        examSubmission.student_class_id = student_class_id;
        return this.repository.save(examSubmission);
    }

    async createExamSubmissionByStudentAndClass(exam_id: number, student_id: number, class_id: number, exam_content_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission> {
        examSubmission.exam_id = exam_id;
        examSubmission.student_id = student_id;
        examSubmission.class_id = class_id;
        return this.repository.save(examSubmission);
    }

    async updateExamSubmission(exam_submission_id: number, examSubmission: ExamSubmission): Promise<ExamSubmission> {
        await this.repository.update(exam_submission_id, examSubmission);
        return this.repository.findOneBy({ exam_submission_id });
    }

    async getDetailsExamSubmission(exam_submission_id: number): Promise<ExamSubmission> {
        return this.repository.findOne({
            where: { exam_submission_id },
            relations: ["examSubmissionContents", "examSubmissionContents.examSubmissionContentDetails"]
        });
    }
}