import { Request, Response, NextFunction } from "express";
import TestcaseService from "../services/testcase.service";
import BaseController from "../abstracts/base-controller";
import { sendResponse } from "../../common/interfaces/base-response";
import { Logger } from "../config/logger";

export class TestcaseController extends BaseController {
    private readonly testcaseService: TestcaseService;

    constructor(path: string) {
        super(path);
        this.testcaseService = new TestcaseService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.post("/:exam_content_id", this.createTestcase.bind(this));
        this.router.get("/", this.getAllTestcases.bind(this));
        this.router.get("/:id", this.getTestcaseById.bind(this));
        this.router.put("/:id", this.updateTestcase.bind(this));
        this.router.delete("/:id", this.deleteTestcase.bind(this));
    }

    public async createTestcase(req: Request, res: Response, next: NextFunction) {
        try {
            const exam_content_id = parseInt(req.params.exam_content_id);
            const data = req.body;
            const testcase = await this.testcaseService.createTestcase(exam_content_id, data);
            return sendResponse(res, true, 201, "Testcase created successfully", testcase);
        } catch (error) {
            Logger.error(`Controller error in createTestcase: ${error}`);
            next(error);
        }
    }
    
    public async getAllTestcases(req: Request, res: Response, next: NextFunction) {
        try {
            const testcases = await this.testcaseService.getAllTestcases();
            return sendResponse(res, true, 200, "Testcases fetched successfully", testcases);
        } catch (error) {
            Logger.error(`Controller error in getAllTestcases: ${error}`);
            next(error);
        }
    }

    public async getTestcaseById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const testcase = await this.testcaseService.getTestcaseById(id);
            return sendResponse(res, true, 200, "Testcase fetched successfully", testcase);
        } catch (error) {
            Logger.error(`Controller error in getTestcaseById: ${error}`);
            next(error);
        }
    }   

    public async updateTestcase(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const { input, expected_output, score } = req.body;
            const testcase = await this.testcaseService.updateTestcase(id, {
                input, expected_output, score,
                id: 0,
                exam_content_id: 0
            });
            return sendResponse(res, true, 200, "Testcase updated successfully", testcase);
        } catch (error) {
            Logger.error(`Controller error in updateTestcase: ${error}`);
            next(error);
        }
    }
    
    public async deleteTestcase(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const testcase = await this.testcaseService.deleteTestcase(id);
            return sendResponse(res, true, 200, "Testcase deleted successfully", testcase);
        } catch (error) {
            Logger.error(`Controller error in deleteTestcase: ${error}`);
            next(error);
        }
    }
}
