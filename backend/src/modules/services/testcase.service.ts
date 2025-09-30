import { ITestCaseRepository } from "../interfaces/testcase.interface";
import { TestCaseRepository } from "../repositories/testcase.repository";
import { TestCase } from "../entity/Testcase.entity";
import { ApiError } from "../types/ApiError";
import { Logger } from "../config/logger";
import { IExamContentRepository } from "../interfaces/exam-content.interface";
import { ExamContentRepository } from "../repositories/exam-content.repository";
import { ExamContent } from "../entity/ExamContent.entity";

class TestcaseService {
    private readonly testcaseRepository: ITestCaseRepository = new TestCaseRepository();
    private readonly examContentRepository: IExamContentRepository = new ExamContentRepository();

    public async getTestcaseById(id: number) {
        try {
            const testcase = await this.testcaseRepository.getTestcaseById(id);
            this.throwIfTestcaseNotFound(testcase);
            return testcase;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    public async createTestcase(exam_content_id: number, testcase: TestCase) {
        try {
            this.validateRequiredField(exam_content_id, 'exam_content_id');
            const examContent = await this.examContentRepository.findById(exam_content_id);
            this.throwIfExamContentNotFound(examContent);
            const result = await this.testcaseRepository.createTestcase(exam_content_id, testcase);
            return result;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    public async updateTestcase(id: number, exam_content_id: number, testcase: TestCase) {
        try {
            this.validateRequiredField(id, "id");
            const result = await this.testcaseRepository.updateTestcase(id, exam_content_id, testcase);
            return result;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    public async deleteTestcase(id: number) {
        try {
            this.validateRequiredField(id, "id");
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

    private validateRequiredField(value: any, fieldName: string): void {
        if (!value) {
            throw new ApiError(400, `${fieldName} is required`, `${fieldName} is required`);
        }
    }

    private throwIfTestcaseNotFound(testcase: any): void {
        if (!testcase) {
            throw new ApiError(404, "Testcase not found", "Testcase not found");
        }
    }

    private throwIfExamContentNotFound(examContent: any): void {
        if (!examContent) {
            throw new ApiError(404, "Exam content not found", "Exam content not found");
        }
    }
}

export default TestcaseService;
