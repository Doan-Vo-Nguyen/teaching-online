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
        this.router.put("/:id/content/:exam_content_id", this.updateTestcase.bind(this));
        this.router.delete("/:id", this.deleteTestcase.bind(this));
        this.router.get("/content/:exam_content_id", this.getAllTestcasesByExamContentId.bind(this));
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
            const exam_content_id = parseInt(req.params.exam_content_id);
            const data = req.body;
            const testcase = await this.testcaseService.updateTestcase(id, exam_content_id, data);
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

    public async getAllTestcasesByExamContentId(req: Request, res: Response, next: NextFunction) {
        try {
            const exam_content_id = parseInt(req.params.exam_content_id);
            const testcases = await this.testcaseService.getAllTestcasesByExamContentId(exam_content_id);
            return sendResponse(res, true, 200, "Testcases fetched successfully", testcases);
        } catch (error) {
            Logger.error(`Controller error in getAllTestcasesByExamContentId: ${error}`);
            next(error);
        }
    }
}
