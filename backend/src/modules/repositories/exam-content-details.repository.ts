import { ExamContentDetails } from "../entity/ExamContentDetails.entity";
import { BaseRepository } from "./base.repository";

export class ExamContentDetailsRepository extends BaseRepository<ExamContentDetails> {
    constructor() {
        super(ExamContentDetails);
    }

    async findByExamContentId(exam_content_id: number): Promise<ExamContentDetails[]> {
        return this.repository.find({ where: { exam_content_id } });
    }
    
    async createExamContentDetails(exam_content_id: number, data: ExamContentDetails): Promise<ExamContentDetails> {
        const examContentDetails = new ExamContentDetails();
        examContentDetails.exam_content_id = exam_content_id;
        examContentDetails.content = data.content;
        return this.repository.save(examContentDetails);
    }

    async updateExamContentDetails(exam_content_id: number, data: ExamContentDetails): Promise<ExamContentDetails> {
        await this.repository.update(exam_content_id, data);
        return this.repository.findOneBy({ id: exam_content_id });
    }

    async deleteExamContentDetails(exam_content_details_id: number): Promise<ExamContentDetails> {
        const examContentDetails = await this.repository.findOneBy({ id: exam_content_details_id });
        return this.repository.remove(examContentDetails);
    }
}