import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import ExamService from "../services/exam.service";
import { sendResponse } from "../../common/interfaces/base-response";
import { validParam } from "../middleware/validate/field.validate";
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
        this.router.get("/:id", validParam("id"), this.getExamById);
        this.router.post("/", authentication, this.createExam);
        this.router.patch("/:id", authentication, validParam("id"), this.updateExam);
        this.router.delete("/:id", authentication, validParam("id"), this.deleteExam);
        this.router.get("/:id/content", validParam("id"), this.getExamContentById);
        this.router.post("/:id/content", authentication, validParam("id"), this.createExamContentByExamId);
        this.router.delete("/:id/content", authentication, validParam("id"), this.deleteExamContentByExamId);
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

    private readonly getExamContentById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.id, 10);
            const examContent = await this.examService.getExamContentById(examId);
            return sendResponse(res, true, 200, "Get exam content by id successfully", examContent);
        } catch (error) {
            next(error);
        }
    }

    private readonly createExamContentByExamId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.id, 10);
            const examContent = req.body;
            const newExamContent = await this.examService.createExamContentByExamId(examId, examContent);
            return sendResponse(res, true, 200, "Create exam content successfully", newExamContent);
        } catch (error) {
            next(error);
        }
    }

    private readonly deleteExamContentByExamId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examContentId = parseInt(req.params.id, 10);
            await this.examService.deleteExamContent(examContentId);
            return sendResponse(res, true, 200, "Delete exam content successfully");
        } catch (error) {
            next(error);
        }
    }
}