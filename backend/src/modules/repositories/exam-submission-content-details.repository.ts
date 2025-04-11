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

    /**
     * Find all details for a specific exam content and submission ID
     * This is used to calculate the total score across all exam contents for a submission
     */
    async findByExamContentId(exam_content_id: number) {
        return this.repository.find({
            where: { exam_content_id },
            relations: ["testcase"]
        });
    }

    /**
     * Find the latest results for a specific exam content and submission ID
     */
    async findLatestByExamContentAndSubmissionId(exam_content_id: number, exam_submission_id: number) {
        try {
            // First get all exam submission contents for this submission
            const examSubmissionContents = await this.repository.manager.query(
                `SELECT esc.id 
                 FROM teaching.exam_submission_content esc 
                 JOIN teaching.exam_submission es ON esc.exam_submission_id = es.exam_submission_id 
                 WHERE es.exam_submission_id = $1
                 ORDER BY esc.created_at DESC`,
                [exam_submission_id]
            );
            
            if (!examSubmissionContents || examSubmissionContents.length === 0) {
                return [];
            }
            
            // Get the IDs of submission contents
            const contentIds = examSubmissionContents.map(content => content.id);
            
            // Find details that match both exam_content_id and are in the list of submission content IDs
            return this.repository.find({
                where: {
                    exam_content_id,
                    exam_submission_content_id: contentIds.length > 0 ? contentIds[0] : -1 // Use first/latest content ID
                },
                relations: ["testcase"]
            });
        } catch (error) {
            console.error(`Error finding details for exam_content_id ${exam_content_id} and submission ${exam_submission_id}:`, error);
            return [];
        }
    }
}