import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import ExamService from "../services/exam.service";
import { sendResponse } from "../../common/interfaces/base-response";
import { validParamId } from "../middleware/validate/field.validate";
import { authentication } from "../middleware/auth.middleware";

export class ExamController extends BaseController {
    private readonly examService: ExamService;

    constructor(path: string) {
        super(path);
        this.examService = new ExamService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get("/", this.getAllExams);
        this.router.get("/:id", validParamId, this.getExamById);
        this.router.post("/", authentication, this.createExam);
        this.router.patch("/:id", authentication, this.updateExam);
        this.router.delete("/:id", authentication, validParamId, this.deleteExam);
    }

    private readonly getAllExams = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const exams = await this.examService.getAllExams();
            return sendResponse(res, true, 200, "Get all exams successfully", exams);
        } catch (error) {
            next(error);
        }
    };

    private readonly getExamById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.id, 10);
            const exam = await this.examService.getExamById(examId);
            return sendResponse(res, true, 200, "Get exam by id successfully", exam);
        } catch (error) {
            next(error);
        }
    };

    private readonly createExam = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const exam = req.body;
            const newExam = await this.examService.createExam(exam);
            return sendResponse(res, true, 200, "Create exam successfully", newExam);
        } catch (error) {
            next(error);
        }
    };

    private readonly updateExam = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.id, 10);
            const exam = req.body;
            const updatedExam = await this.examService.updateExam(examId, exam);
            return sendResponse(res, true, 200, "Update exam successfully", updatedExam);
        } catch (error) {
            next(error);
        }
    };

    private readonly deleteExam = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.id, 10);
            await this.examService.deleteExam(examId);
            return sendResponse(res, true, 200, "Delete exam successfully");
        } catch (error) {
            next(error);
        }
    }
}