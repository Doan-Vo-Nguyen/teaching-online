import { ExamContent } from "../entity/ExamContent.entity";
import { BaseRepository } from "./base.repository";

export class ExamContentRepository extends BaseRepository<ExamContent> {
    constructor() {
        super(ExamContent);
    }

    async find(options: any): Promise<ExamContent[]> {
        return this.repository.find(options);
    }

    async findById(id: number): Promise<ExamContent> {
        return this.repository.findOneBy({ id });
    }

    async findByExamId(exam_id: number): Promise<ExamContent[]> {
        return this.repository.find({ where: { exam_id } });
    }

    async save(examContent: ExamContent): Promise<ExamContent> {
        return this.repository.save(examContent);
    }

    async update(id: number, examContent: ExamContent): Promise<ExamContent> {
        await this.repository.update(id, examContent);
        return this.findById(id);
    }

    async delete(id: number): Promise<ExamContent> {
        const examContent = await this.repository.findOneBy({ id });
        return this.repository.remove(examContent);
    }

    async findByExamIdAndContentId(examContentId: number): Promise<ExamContent> {
        return this.repository.findOneBy({ id: examContentId });
    }

    async updateExamContent(examContentId: number, data: ExamContent): Promise<ExamContent> {
        await this.repository.update(examContentId, data);
        return this.repository.findOneBy({ id: examContentId });
    }

    async deleteExamContent(examContentId: number): Promise<ExamContent> {
        const examContent = await this.repository.findOneBy({ id: examContentId });
        return this.repository.remove(examContent);
    }

    async getDetailExam(id: number, exam_content_id: number): Promise<ExamContent> {
        return this.repository.findOne({
            where: { exam_id: id, id: exam_content_id }
        });
    }
}
