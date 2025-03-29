import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import ExamContentDetailsService from "../services/exam-content-details.service";
import { sendResponse } from "../../common/interfaces/base-response";

export class ExamContentDetailsController extends BaseController {
    private readonly examContentDetailsService: ExamContentDetailsService;

    constructor(path: string) {
        super(path);
        this.examContentDetailsService = new ExamContentDetailsService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.post("/:exam_content_id", this.createExamContentDetails);
        this.router.get("/", this.getAllExamContentDetails);
        this.router.put("/:id", this.updateExamContentDetails);
        this.router.delete("/:id", this.deleteExamContentDetails);
    }

    private readonly getAllExamContentDetails = async (req: Request, res: Response, next: NextFunction) => {
        const examContentDetails = await this.examContentDetailsService.getAllExamContentDetails();
        return sendResponse(res, true, 200, "Exam content details fetched successfully", examContentDetails);
    }

    private readonly createExamContentDetails = async (req: Request, res: Response, next: NextFunction) => {
        const exam_content_id = parseInt(req.params.exam_content_id);
        const examContentDetails = req.body;
        const createdExamContentDetails = await this.examContentDetailsService.createExamContentDetails(exam_content_id, examContentDetails);
        return sendResponse(res, true, 201, "Exam content details created successfully", createdExamContentDetails);
    }

    private readonly updateExamContentDetails = async (req: Request, res: Response, next: NextFunction) => {
        const exam_content_details_id = parseInt(req.params.id);
        const examContentDetails = req.body;
        const updatedExamContentDetails = await this.examContentDetailsService.updateExamContentDetails(exam_content_details_id, examContentDetails);
        return sendResponse(res, true, 200, "Exam content details updated successfully", updatedExamContentDetails);
    }

    private readonly deleteExamContentDetails = async (req: Request, res: Response, next: NextFunction) => {
        const exam_content_details_id = parseInt(req.params.id);
        const deletedExamContentDetails = await this.examContentDetailsService.deleteExamContentDetails(exam_content_details_id);
        return sendResponse(res, true, 200, "Exam content details deleted successfully", deletedExamContentDetails);
    }
    
    
    
    
}
