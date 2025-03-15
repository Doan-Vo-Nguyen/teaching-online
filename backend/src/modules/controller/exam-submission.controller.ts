import { authentication } from './../middleware/auth.middleware';
import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import ExamSubmissionService from "../services/exam-submision.service";
import { Request, Response, NextFunction } from "express";

export class ExamSubmissionController extends BaseController {
    private readonly examSubmissionService: ExamSubmissionService;

    constructor(path: string) {
        super(path);
        this.examSubmissionService = new ExamSubmissionService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get("/:examId", authentication, this.getExamSubmissionByExamId);
        this.router.post("/:examId/:studentClassId", authentication, this.createExamSubmission);
        this.router.post("/:examId/:studentId/:classId", authentication, this.createExamSubmissionByStudentAndClass);
        this.router.put("/:examSubmissionId", authentication, this.updateExamSubmission);
        this.router.delete("/:examSubmissionId",authentication, this.deleteExamSubmission);
    }

    private readonly getExamSubmissionByExamId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.examId, 10);
            const examSubmissions = await this.examSubmissionService.getExamSubmissionByExamId(examId);
            return sendResponse(res, true, 200, "Get exam submission by exam id successfully", examSubmissions);
        } catch (error) {
            next(error);
        }
    };

    private readonly createExamSubmission = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.examId, 10);
            const studentClassId = parseInt(req.params.studentClassId, 10);
            const examSubmission = req.body;
            const createdExamSubmission = await this.examSubmissionService.createExamSubmission(examId, studentClassId, examSubmission);
            return sendResponse(res, true, 200, "Create exam submission successfully", createdExamSubmission);
        } catch (error) {
            next(error);
        }
    };

    private readonly createExamSubmissionByStudentAndClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.examId, 10);
            const studentId = parseInt(req.params.studentId, 10);
            const classId = parseInt(req.params.classId, 10);
            const examSubmission = req.body;
            const createdExamSubmission = await this.examSubmissionService.createExamSubmissionByStudentAndClass(examId, studentId, classId, examSubmission);
            return sendResponse(res, true, 200, "Create exam submission by student and class successfully", createdExamSubmission);
        } catch (error) {
            next(error);
        }
    }

    private readonly updateExamSubmission = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examSubmissionId = parseInt(req.params.examSubmissionId, 10);
            const examSubmission = req.body;
            const updatedExamSubmission = await this.examSubmissionService.updateExamSubmission(examSubmissionId, examSubmission);
            return sendResponse(res, true, 200, "Update exam submission successfully", updatedExamSubmission);
        } catch (error) {
            next(error);
        }
    }

    private readonly deleteExamSubmission = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examSubmissionId = parseInt(req.params.examSubmissionId, 10);
            const deletedExamSubmission = await this.examSubmissionService.deleteExamSubmission(examSubmissionId);
            return sendResponse(res, true, 200, "Delete exam submission successfully", deletedExamSubmission);
        } catch (error) {
            next(error);
        }
    }
}