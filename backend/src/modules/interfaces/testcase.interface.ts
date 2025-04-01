import { BaseRepository } from "../repositories/base.repository";
import { TestCase } from "../entity/Testcase.entity";

export interface ITestCaseRepository extends BaseRepository<TestCase> {
    findAllTestcases(): Promise<TestCase[]>
    createTestcase(exam_content_id: number, testcase: TestCase): Promise<TestCase>
    getTestcaseById(id: number): Promise<TestCase>
    updateTestcase(id: number, testcase: TestCase): Promise<TestCase>
    deleteTestcase(id: number): Promise<void>
}