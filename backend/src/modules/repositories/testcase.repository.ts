import { BaseRepository } from "./base.repository";
import { TestCase } from "../entity/Testcase.entity";

export class TestCaseRepository extends BaseRepository<TestCase> {
    constructor() {
        super(TestCase);
    }

    async createTestcase(exam_id: number, testcase: TestCase): Promise<TestCase> {
        return this.repository.save({ ...testcase, exam_id });
    }

    async getTestcaseById(id: number): Promise<TestCase> {
        return this.repository.findOne({ where: { id } });
    }
    async updateTestcase(id: number, testcase: TestCase): Promise<TestCase> {
        await this.repository.update(id, testcase);
        return this.repository.findOne({ where: { id } });
    }
    async deleteTestcase(id: number): Promise<void> {
        await this.repository.delete(id);
    }
    
}