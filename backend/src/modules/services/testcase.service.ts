import { ITestCaseRepository } from "../interfaces/testcase.interface";
import { TestCaseRepository } from "../repositories/testcase.repository";
class TestcaseService {
    private readonly testcaseRepository: ITestCaseRepository = new TestCaseRepository();

    public async getTestcaseById(id: number) {
        return await this.testcaseRepository.findById(id);
    }
}   
