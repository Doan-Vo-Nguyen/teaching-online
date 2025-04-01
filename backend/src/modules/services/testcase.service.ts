import { ITestCaseRepository } from "../interfaces/testcase.interface";
import { TestCaseRepository } from "../repositories/testcase.repository";
import { TestCase } from "../entity/Testcase.entity";
import { ApiError } from "../types/ApiError";
import { Logger } from "../config/logger";
import { IExamContentRepository } from "../interfaces/exam-content.interface";
import { ExamContentRepository } from "../repositories/exam-content.repository";

class TestcaseService {
    private readonly testcaseRepository: ITestCaseRepository = new TestCaseRepository();
    private readonly examContentRepository: IExamContentRepository = new ExamContentRepository();

    public async getTestcaseById(id: number) {
        try {
            const testcase = await this.testcaseRepository.getTestcaseById(id);
            if (!testcase) {
                throw new ApiError(404, "Testcase not found", "Testcase not found");
            }
            return testcase;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    public async createTestcase(exam_content_id: number, testcase: TestCase) {
        try {
            if(!exam_content_id) {
                throw new ApiError(400, "Exam content id is required", "Exam content id is required");
            }
            const examContent = await this.examContentRepository.findById(exam_content_id);
            if(!examContent) {
                throw new ApiError(404, "Exam content not found", "Exam content not found");
            }
            const result = await this.testcaseRepository.createTestcase(exam_content_id, testcase);
            return result;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    public async updateTestcase(id: number, exam_content_id: number, testcase: TestCase) {
        try {
            if(!id) {
                throw new ApiError(400, "Testcase id is required", "Testcase id is required");
            }
            const result = await this.testcaseRepository.updateTestcase(id, exam_content_id, testcase);
            return result;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    public async deleteTestcase(id: number) {
        try {
            if(!id) {
                throw new ApiError(400, "Testcase id is required", "Testcase id is required");
            }
            const result = await this.testcaseRepository.deleteTestcase(id);
            return result;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    public async getAllTestcases() {
        try {
            const testcases = await this.testcaseRepository.findAllTestcases();
            return testcases;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    public async getAllTestcasesByExamContentId(exam_content_id: number) {
        try {
            const testcases = await this.testcaseRepository.getAllTestcasesByExamContentId(exam_content_id);
            return testcases;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }
}   

export default TestcaseService;
