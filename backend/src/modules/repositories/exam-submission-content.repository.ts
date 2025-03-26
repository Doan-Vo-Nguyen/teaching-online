import { ExamSubmissionContent } from '../entity/Exam_Submission_Content.entity';
import { BaseRepository } from './base.repository';
export class ExamSubmissionContentRepository extends BaseRepository<ExamSubmissionContent> {
    constructor() {
        super(ExamSubmissionContent);
    }
    async find(options: any) {
        return this.repository.find(options);
    }
    async findById(id: number) {
        return this.repository.findOneBy({ id });
    }
    async findByExamSubmissionId(exam_submission_id: number) {
        return this.repository.find({ where: { exam_submission_id } });
    }
    async save(examSubmissionContent: ExamSubmissionContent) {
        return this.repository.save(examSubmissionContent);
    }
    async update(id: number, examSubmissionContent: ExamSubmissionContent) {
        await this.repository.update(id, examSubmissionContent);
        return this.repository.findOneBy({ id });
    }
    async delete(id: number) {
        const examSubmissionContent = await this.repository.findOneBy({ id });
        return this.repository.remove(examSubmissionContent);
    }
    async createExamSubmissionContentByExamSubmissionId(exam_submission_id: number, data: ExamSubmissionContent) {
        const examSubmissionContent = await this.repository.save({ ...data, exam_submission_id });
        return examSubmissionContent;
    }
    async deleteExamSubmissionContent(exam_submission_id: number, exam_submission_content_id: number) {
        const examSubmissionContent = await this.repository.findOneBy({ id: exam_submission_content_id, exam_submission_id });
        return this.repository.remove(examSubmissionContent);
    }
}