import { authentication } from './../middleware/auth.middleware';
import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import ExamSubmissionService from "../services/exam-submision.service";
import { Request, Response, NextFunction } from "express";
import { Logger } from '../config/logger';
import { trackApiAction, trackControllerAction } from '../middleware/api-tracking.middleware';
import { logExamStart } from '../middleware/audit-log.middleware';
import { IRequest } from '../types/IRequest';

export class ExamSubmissionController extends BaseController {
    private readonly examSubmissionService: ExamSubmissionService;
    private track: (actionName: string) => ReturnType<typeof trackApiAction>;

    constructor(path: string) {
        super(path);
        this.examSubmissionService = new ExamSubmissionService();
        // Create a tracker specific to this controller
        this.track = trackControllerAction('ExamSubmissionController');
        this.initRoutes();
    }

    public initRoutes(): void {
        // Resource: exam submissions collection
        this.router.get("/", authentication, this.track('getAllExamSubmissions'), this.getAllExamSubmissions);
        this.router.post("/", authentication, this.track('createExamSubmission'), this.createExamSubmission);
        
        // Resource: single exam submission
        this.router.get("/:id", authentication, this.track('getExamSubmissionById'), this.getExamSubmissionById);
        this.router.put("/:id", authentication, this.track('updateExamSubmission'), this.updateExamSubmission);
        this.router.delete("/:id", authentication, this.track('deleteExamSubmission'), this.deleteExamSubmission);

        // Resource: delete submission for a student in a class
        this.router.delete("/submissions/:submissionId/content/:id", authentication, this.track('deleteExamSubmissionContent'), this.deleteExamSubmissionContent);
        
        // Resource: exam submissions for a specific exam
        this.router.get("/exams/:examId/submissions", authentication, this.track('getExamSubmissionsByExamId'), this.getExamSubmissionsByExamId);
        
        // Resource: exam submissions for a specific student
        this.router.get("/exams/:examId/students/:studentId/classes/:classId/submissions", authentication, this.track('getExamSubmissionsByOneStudent'), this.getExamSubmissionsByOneStudent);
        
        // Resource: exam submission status for a student in a class
        this.router.get("/exams/:examId/classes/:classId/status", authentication, this.track('getExamSubmissionStatus'), this.getExamSubmissionStatus);
        
        // Resource: create submission for a student in a class - Add audit logging
        this.router.post("/exams/:examId/students/:studentId/classes/:classId/exam-contents/:examContentId/submissions", 
            authentication, 
            this.track('createExamSubmissionByStudentAndClass'), 
            logExamStart,
            this.createExamSubmissionByStudentAndClass
        );

        // Resource: run code
        this.router.post("/exams/:examContentId/run", authentication, this.track('runCode'), this.runCode);

        // Resource: get details exam submission
        this.router.get("/:id/details", authentication, this.track('getDetailsExamSubmission'), this.getDetailsExamSubmission);
    }

    private readonly getAllExamSubmissions = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            // Implement pagination, filtering, etc.
            const examSubmissions = await this.examSubmissionService.get(req.query);
            return sendResponse(res, true, 200, "Fetched all exam submissions successfully", examSubmissions);
        } catch (error) {
            Logger.error(error, undefined, { traceId: (req as any).traceId });
            next(error);
        }
    };

    private readonly getExamSubmissionById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const id = parseInt(req.params.id, 10);
            const examSubmission = await this.examSubmissionService.getExamSubmissionByExamId(id);
            
            if (!examSubmission) {
                return sendResponse(res, false, 404, "Exam submission not found", null);
            }
            
            return sendResponse(res, true, 200, "Fetched exam submission successfully", examSubmission);
        } catch (error) {
            next(error);
        }
    };

    private readonly getExamSubmissionsByExamId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examId = parseInt(req.params.examId, 10);
            const examSubmissions = await this.examSubmissionService.getExamSubmissionByExamId(examId);
            return sendResponse(res, true, 200, "Fetched exam submissions by exam successfully", examSubmissions);
        } catch (error) {
            next(error);
        }
    };

    private readonly getExamSubmissionsByOneStudent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const studentId = parseInt(req.params.studentId, 10);
            const examId = parseInt(req.params.examId, 10);
            const classId = parseInt(req.params.classId, 10);
            const examSubmissions = await this.examSubmissionService.getExamSubmissionByOneStudent(studentId, classId, examId);
            return sendResponse(res, true, 200, "Fetched exam submissions by student successfully", examSubmissions);
        } catch (error) {
            next(error);
        }
    };

    private readonly getExamSubmissionStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const classId = parseInt(req.params.classId, 10);
            const examId = parseInt(req.params.examId, 10);
            const examSubmission = await this.examSubmissionService.getExamSubmissionHaveSubmit(classId, examId);
            return sendResponse(res, true, 200, "Fetched exam submission status successfully", examSubmission);
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
            const examSubmission = req.body;
            
            // Log start of operation with trace ID
            Logger.info("Starting exam submission creation", {
                traceId: (req as any).traceId,
                examId: examSubmission.examId,
                studentId: examSubmission.student_id,
                classId: examSubmission.class_id
            });
            
            const createdExamSubmission = await this.examSubmissionService.createExamSubmission(
                examSubmission.examId,
                examSubmission.student_id,
                examSubmission.class_id,
                examSubmission
            );
            
            return sendResponse(res, true, 201, "Created exam submission successfully", createdExamSubmission);
        } catch (error) {
            // Log error with trace ID
            Logger.error(error, undefined, { 
                traceId: (req as any).traceId,
                operation: 'createExamSubmission'
            });
            
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
            const examContentId = parseInt(req.params.examContentId, 10);
            // the body: file_content is file type, language_id is number type, stdin is string type, expected_output is string type
            const body = req.body;
            const createdExamSubmission = await this.examSubmissionService.createExamSubmissionByStudentAndClass(
                examId,
                studentId,
                classId, 
                examContentId,
                body
            );
            return sendResponse(res, true, 201, "Created exam submission successfully", createdExamSubmission);
        } catch (error) {
            next(error);
        }
    };

    private readonly updateExamSubmission = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const id = parseInt(req.params.id, 10);
            const examSubmission = req.body;
            const updatedExamSubmission = await this.examSubmissionService.updateExamSubmission(id, examSubmission);
            
            if (!updatedExamSubmission) {
                return sendResponse(res, false, 404, "Exam submission not found", null);
            }
            
            return sendResponse(res, true, 200, "Updated exam submission successfully", updatedExamSubmission);
        } catch (error) {
            next(error);
        }
    };

    private readonly deleteExamSubmission = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const id = parseInt(req.params.id, 10);
            const deletedExamSubmission = await this.examSubmissionService.deleteExamSubmission(id);
            
            if (!deletedExamSubmission) {
                return sendResponse(res, false, 404, "Exam submission not found", null);
            }
            
            return sendResponse(res, true, 200, "Deleted exam submission successfully", deletedExamSubmission);
        } catch (error) {
            next(error);
        }
    };

    private readonly deleteExamSubmissionContent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examSubmissionId = parseInt(req.params.submissionId, 10);
            const id = parseInt(req.params.id, 10);
            const deletedExamSubmissionContent = await this.examSubmissionService.deleteExamSubmissionContent(examSubmissionId, id);
            return sendResponse(res, true, 200, "Deleted exam submission content successfully", deletedExamSubmissionContent);
        } catch (error) {
            next(error);
        }
    }

    private readonly runCode = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examContentId = parseInt(req.params.examContentId, 10);
            const body = req.body;
            const result = await this.examSubmissionService.runCode(examContentId, body);
            return sendResponse(res, true, 200, "Run code successfully", result);
        } catch (error) {
            next(error);
        }
    }

    private readonly getDetailsExamSubmission = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const examSubmissionId = parseInt(req.params.id, 10);
            const data = req.body;
            const examSubmission = await this.examSubmissionService.getDetailsExamSubmission(examSubmissionId, data);
            return sendResponse(res, true, 200, "Fetched details exam submission successfully", examSubmission);
        } catch (error) {
            next(error);
        }
    }
    
}