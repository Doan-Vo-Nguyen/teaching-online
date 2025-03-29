import { ITestCaseRepository } from "../interfaces/testcase.interface";
import { TestCaseRepository } from "../repositories/testcase.repository";
import { TestCase } from "../entity/Testcase.entity";
import { ApiError } from "../types/ApiError";
class TestcaseService {
    private readonly testcaseRepository: ITestCaseRepository = new TestCaseRepository();

    public async getTestcaseById(id: number) {
        const testcase = await this.testcaseRepository.getTestcaseById(id);
        if (!testcase) {
            throw new ApiError(404, "Testcase not found", "Testcase not found");
        }
        return testcase;
    }

    public async createTestcase(exam_content_details_id: number, testcase: TestCase) {
        if(!exam_content_details_id) {
            throw new ApiError(400, "Exam content details id is required", "Exam content details id is required");
        }
        return await this.testcaseRepository.createTestcase(exam_content_details_id, testcase);
    }

    public async updateTestcase(id: number, testcase: TestCase) {
        if(!id) {
            throw new ApiError(400, "Testcase id is required", "Testcase id is required");
        }
        return await this.testcaseRepository.updateTestcase(id, testcase);
    }

    public async deleteTestcase(id: number) {
        if(!id) {
            throw new ApiError(400, "Testcase id is required", "Testcase id is required");
        }
        return await this.testcaseRepository.deleteTestcase(id);
    }

    public async getAllTestcases() {
        return await this.testcaseRepository.findAllTestcases();
    }
}   

export default TestcaseService;
