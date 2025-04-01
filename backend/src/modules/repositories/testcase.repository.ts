import { BaseRepository } from "./base.repository";
import { TestCase } from "../entity/Testcase.entity";

export class TestCaseRepository extends BaseRepository<TestCase> {
    constructor() {
        super(TestCase);
    }

    async findAllTestcases(): Promise<TestCase[]> {
        return this.repository.find();
    }

    async createTestcase(exam_content_id: number, testcase: TestCase): Promise<TestCase> {
        return this.repository.save({ ...testcase, exam_content_id });
    }

    async getTestcaseById(id: number): Promise<TestCase> {
        return this.repository.findOne({ where: { id } });
    }
    async updateTestcase(id: number, exam_content_id: number, testcase: TestCase): Promise<TestCase> {
        await this.repository.update(id, { ...testcase, exam_content_id });
        return this.repository.findOne({ where: { id } });
    }
    async deleteTestcase(id: number): Promise<void> {
        await this.repository.delete(id);
    }
    async getAllTestcasesByExamContentId(exam_content_id: number): Promise<TestCase[]> {
        return this.repository.find({ where: { exam_content_id } });
    }
    
}