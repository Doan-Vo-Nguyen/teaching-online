import { ExamSubmissionContentDetails } from '../entity/ExamSubmissionContentDetails.entity';
import { BaseRepository } from './base.repository';
import { IExamSubmissionContentDetailsRepository } from '../interfaces/exam-submisison-content-details.interface';

export class ExamSubmissionContentDetailsRepository extends BaseRepository<ExamSubmissionContentDetails> implements IExamSubmissionContentDetailsRepository {
    constructor() {
        super(ExamSubmissionContentDetails);
    }

    async find(options: any) {
        return this.repository.find(options);
    }

    async findById(id: number) {
        return this.repository.findOneBy({ exam_submission_content_details_id: id });
    }

    async findByExamSubmissionContentId(exam_submission_content_id: number) {
        return this.repository.find({ 
            where: { exam_submission_content_id },
            relations: ["testcase"]
        });
    }

    async findByTestcaseId(testcase_id: number) {
        return this.repository.find({ 
            where: { testcase_id },
            relations: ["examSubmissionContent"] 
        });
    }

    async findByExamSubmissionContentIdAndTestcaseId(
        exam_submission_content_id: number,
        testcase_id: number
    ) {
        return this.repository.findOne({ 
            where: { exam_submission_content_id, testcase_id } 
        });
    }

    async save(examSubmissionContentDetails: ExamSubmissionContentDetails) {
        return this.repository.save(examSubmissionContentDetails);
    }

    async update(id: number, examSubmissionContentDetails: ExamSubmissionContentDetails) {
        await this.repository.update(id, examSubmissionContentDetails);
        return this.repository.findOneBy({ exam_submission_content_details_id: id });
    }

    async delete(id: number) {
        const examSubmissionContentDetails = await this.repository.findOneBy({ exam_submission_content_details_id: id });
        if (!examSubmissionContentDetails) {
            throw new Error(`Exam submission content details with id ${id} not found`);
        }
        return this.repository.remove(examSubmissionContentDetails);
    }
}