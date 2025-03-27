import { BaseRepository } from "../repositories/base.repository";
import { TestCase } from "../entity/Testcase.entity";

export interface ITestCaseRepository extends BaseRepository<TestCase> {
    createTestcase(exam_id: number, testcase: TestCase): Promise<TestCase>
    getTestcaseById(id: number): Promise<TestCase>
    updateTestcase(id: number, testcase: TestCase): Promise<TestCase>
    deleteTestcase(id: number): Promise<void>
}