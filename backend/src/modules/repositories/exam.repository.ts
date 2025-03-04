import { Exam } from "../entity/Exam.entity";
import { BaseRepository } from "./base.repository";

export class ExamRepository extends BaseRepository<Exam> {
    constructor() {
        super(Exam);
    }

    async find(options: any): Promise<Exam[]> {
        return this.repository.find(options);
    }

    async findById(exam_id: number): Promise<Exam> {
        return this.repository.findOneBy({ exam_id });
    }

    async save(exam: Exam): Promise<Exam> {
        return this.repository.save(exam);
    }

    async update(exam_id: number, exam: Exam): Promise<Exam> {
        await this.repository.update(exam_id, exam);
        return this.repository.findOneBy({ exam_id });
    }

    async delete(exam_id: number): Promise<Exam> {
        // Use relations to load the examSubmissions with the exam
        const exam = await this.repository.findOne({
            where: { exam_id },
            relations: { examSubmissions: true }
        });
        await this.repository.delete(exam_id);
        return exam;
    }

    async createExamByClassAndTeacher(class_id: number, teacher_id: number, exam: Exam): Promise<Exam> {
        exam.class_id = class_id;
        exam.teacher_id = teacher_id;
        return this.repository.save(exam);
    }
}