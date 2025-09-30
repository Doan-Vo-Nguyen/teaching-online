import { ExamSubmissionContent } from '../entity/Exam_Submission_Content.entity';
import { BaseRepository } from './base.repository';
import { IExamSubmissionContentRepository } from '../interfaces/exam-submission-content.interface';

export class ExamSubmissionContentRepository extends BaseRepository<ExamSubmissionContent> implements IExamSubmissionContentRepository {
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
        return this.findById(id);
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
    /**
     * Find the latest exam submission content associated with an exam content ID
     * This is used to link test results to the appropriate submission
     */
    async findLatestByExamContentId(exam_content_id: number): Promise<ExamSubmissionContent | null> {
        try {
            // Join with ExamSubmissionContentDetails to find content related to this exam_content_id
            // Order by submission date descending to get the latest one
            const result = await this.repository
                .createQueryBuilder('esc')
                .innerJoin('teaching.exam_submission_content_details', 'escd', 'esc.id = escd.exam_submission_content_id')
                .where('escd.exam_content_id = :exam_content_id', { exam_content_id })
                .orderBy('esc.created_at', 'DESC')
                .getOne();
                
            return result;
        } catch (error) {
            console.error(`Error finding latest submission for exam_content_id ${exam_content_id}:`, error);
            return null;
        }
    }
}