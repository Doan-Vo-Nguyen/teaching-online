import { Request, Response, NextFunction } from "express";
import TestcaseService from "../services/testcase.service";
import BaseController from "../abstracts/base-controller";
import { sendResponse } from "../../common/interfaces/base-response";
export class TestcaseController extends BaseController {
    private readonly testcaseService: TestcaseService;

    constructor(path: string) {
        super(path);
        this.testcaseService = new TestcaseService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.post("/:exam_content_details_id", this.createTestcase);
        this.router.get("/", this.getAllTestcases);
        this.router.get("/:id", this.getTestcaseById);
        this.router.put("/:id", this.updateTestcase);
        this.router.delete("/:id", this.deleteTestcase);
    }

    public async createTestcase(req: Request, res: Response, next: NextFunction) {
        const exam_content_details_id = parseInt(req.params.exam_content_details_id);
        const { input, expected_output, score } = req.body;
        const testcase = await this.testcaseService.createTestcase(exam_content_details_id, {
            input, expected_output, score,
            id: 0,
            exam_content_id: 0
        });
        return sendResponse(res, true, 201, "Testcase created successfully", testcase);
    }
    
    public async getAllTestcases(req: Request, res: Response, next: NextFunction) {
        const testcases = await this.testcaseService.getAllTestcases();
        return sendResponse(res, true, 200, "Testcases fetched successfully", testcases);
    }

    public async getTestcaseById(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        const testcase = await this.testcaseService.getTestcaseById(id);
        return sendResponse(res, true, 200, "Testcase fetched successfully", testcase);
    }   

    public async updateTestcase(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        const { input, expected_output, score } = req.body;
        const testcase = await this.testcaseService.updateTestcase(id, {
            input, expected_output, score,
            id: 0,
            exam_content_id: 0
        });
        return sendResponse(res, true, 200, "Testcase updated successfully", testcase);
    }
    
    public async deleteTestcase(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        const testcase = await this.testcaseService.deleteTestcase(id);
        return sendResponse(res, true, 200, "Testcase deleted successfully", testcase);
    }
}
