import { authentication } from './../middleware/auth.middleware';
import BaseController from "../abstracts/base-controller";
import ExamSubmissionService from "../services/exam-submision.service";
import { ExamSubmissionServiceFactory } from "../services/exam-submission.service.factory";
import { Request, Response } from "express";
import { Logger } from '../config/logger';
import { trackApiAction, trackControllerAction } from '../middleware/api-tracking.middleware';
import { logExamStart } from '../middleware/audit-log.middleware';

export class ExamSubmissionController extends BaseController {
    private readonly examSubmissionService: ExamSubmissionService;
    private track: (actionName: string) => ReturnType<typeof trackApiAction>;

    constructor(
        path: string, 
        examSubmissionService?: ExamSubmissionService
    ) {
        super(path);
        this.examSubmissionService = examSubmissionService || ExamSubmissionServiceFactory.getInstance();
        // Create a tracker specific to this controller
        this.track = trackControllerAction('ExamSubmissionController');
        this.initRoutes();
    }

    public initRoutes(): void {
        // Resource: exam submissions collection
        this.router.get("/", authentication, this.track('getAllExamSubmissions'), this.asyncHandler(this.getAllExamSubmissions));
        this.router.post("/", authentication, this.track('createExamSubmission'), this.asyncHandler(this.createExamSubmission));
        
        // Resource: single exam submission
        this.router.get("/:id", authentication, this.track('getExamSubmissionById'), this.asyncHandler(this.getExamSubmissionById));
        this.router.put("/:id", authentication, this.track('updateExamSubmission'), this.asyncHandler(this.updateExamSubmission));
        this.router.delete("/:id", authentication, this.track('deleteExamSubmission'), this.asyncHandler(this.deleteExamSubmission));

        // Resource: delete submission for a student in a class
        this.router.delete("/submissions/:submissionId/content/:id", authentication, this.track('deleteExamSubmissionContent'), this.asyncHandler(this.deleteExamSubmissionContent));
        
        // Resource: exam submissions for a specific exam
        this.router.get("/exams/:examId/submissions", authentication, this.track('getExamSubmissionsByExamId'), this.asyncHandler(this.getExamSubmissionsByExamId));
        
        // Resource: exam submissions for a specific student
        this.router.get("/exams/:examId/students/:studentId/classes/:classId/submissions", authentication, this.track('getExamSubmissionsByOneStudent'), this.asyncHandler(this.getExamSubmissionsByOneStudent));
        
        // Resource: exam submission status for a student in a class
        this.router.get("/exams/:examId/classes/:classId/status", authentication, this.track('getExamSubmissionStatus'), this.asyncHandler(this.getExamSubmissionStatus));
        
        // Resource: create submission for a student in a class - Add audit logging
        this.router.post("/exams/:examId/students/:studentId/classes/:classId/exam-contents/:examContentId/submissions", 
            authentication, 
            this.track('createExamSubmissionByStudentAndClass'), 
            logExamStart,
            this.asyncHandler(this.createExamSubmissionByStudentAndClass)
        );

        // Resource: run code
        this.router.post("/exams/:examContentId/run", authentication, this.track('runCode'), this.asyncHandler(this.runCode));

        // Resource: get details exam submission
        this.router.get("/:id/details", authentication, this.track('getDetailsExamSubmission'), this.asyncHandler(this.getDetailsExamSubmission));
    }

    private readonly getAllExamSubmissions = async (
        req: Request,
        res: Response
    ) => {
        // Implement pagination, filtering, etc.
        const examSubmissions = await this.examSubmissionService.get(req.query);
        return this.sendSuccess(res, 200, "Fetched all exam submissions successfully", examSubmissions);
    };

    private readonly getExamSubmissionById = async (
        req: Request,
        res: Response
    ) => {
        const id = this.parseId(req.params.id);
        const examSubmission = await this.examSubmissionService.getExamSubmissionByExamId(id);
        
        if (!examSubmission) {
            return this.sendError(res, 404, "Exam submission not found");
        }
        
        return this.sendSuccess(res, 200, "Fetched exam submission successfully", examSubmission);
    };

    private readonly getExamSubmissionsByExamId = async (
        req: Request,
        res: Response
    ) => {
        const examId = this.parseId(req.params.examId);
        const examSubmissions = await this.examSubmissionService.getExamSubmissionByExamId(examId);
        return this.sendSuccess(res, 200, "Fetched exam submissions by exam successfully", examSubmissions);
    };

    private readonly getExamSubmissionsByOneStudent = async (
        req: Request,
        res: Response
    ) => {
        const studentId = this.parseId(req.params.studentId);
        const examId = this.parseId(req.params.examId);
        const classId = this.parseId(req.params.classId);
        const examSubmissions = await this.examSubmissionService.getExamSubmissionByOneStudent(studentId, classId, examId);
        return this.sendSuccess(res, 200, "Fetched exam submissions by student successfully", examSubmissions);
    };

    private readonly getExamSubmissionStatus = async (
        req: Request,
        res: Response
    ) => {
        const classId = this.parseId(req.params.classId);
        const examId = this.parseId(req.params.examId);
        const examSubmission = await this.examSubmissionService.getExamSubmissionHaveSubmit(classId, examId);
        return this.sendSuccess(res, 200, "Fetched exam submission status successfully", examSubmission);
    };

    private readonly createExamSubmission = async (
        req: Request,
        res: Response
    ) => {
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
        
        return this.sendSuccess(res, 201, "Created exam submission successfully", createdExamSubmission);
    };

    private readonly createExamSubmissionByStudentAndClass = async (
        req: Request,
        res: Response
    ) => {
        const examId = this.parseId(req.params.examId);
        const studentId = this.parseId(req.params.studentId);
        const classId = this.parseId(req.params.classId);
        const examContentId = this.parseId(req.params.examContentId);
        
        // The body: file_content is file type, language_id is number type, stdin is string type, expected_output is string type
        const body = req.body;
        const createdExamSubmission = await this.examSubmissionService.createExamSubmissionByStudentAndClass(
            examId,
            studentId,
            classId, 
            examContentId,
            body
        );
        return this.sendSuccess(res, 201, "Created exam submission successfully", createdExamSubmission);
    };

    private readonly updateExamSubmission = async (
        req: Request,
        res: Response
    ) => {
        const submissionId = this.parseId(req.params.id);
        const updatedExamSubmission = await this.examSubmissionService.updateExamSubmission(
            submissionId,
            req.body
        );
        return this.sendSuccess(res, 200, "Updated exam submission successfully", updatedExamSubmission);
    };

    private readonly deleteExamSubmission = async (
        req: Request,
        res: Response
    ) => {
        console.log(req.params);
        const submissionId = this.parseId(req.params.id);
        await this.examSubmissionService.deleteExamSubmission(submissionId);
        return this.sendSuccess(res, 200, "Deleted exam submission successfully", null);
    };

    private readonly deleteExamSubmissionContent = async (
        req: Request,
        res: Response
    ) => {
        console.log(req.params);
        const submissionId = this.parseId(req.params.submissionId);
        const contentId = this.parseId(req.params.id);
        await this.examSubmissionService.deleteExamSubmissionContent(submissionId, contentId);
        return this.sendSuccess(res, 200, "Deleted exam submission content successfully", null);
    };

    private readonly runCode = async (
        req: Request,
        res: Response
    ) => {        
        const examContentId = this.parseId(req.params.examContentId);
        const result = await this.examSubmissionService.runCode(examContentId, req.body);
        return this.sendSuccess(res, 200, "Code executed successfully", result);
    };

    private readonly getDetailsExamSubmission = async (
        req: Request,
        res: Response
    ) => {
        const submissionId = this.parseId(req.params.id);
        const details = await this.examSubmissionService.getDetailsExamSubmission(submissionId, req.query);
        return this.sendSuccess(res, 200, "Fetched exam submission details successfully", details);
    };

    private readonly debugLanguageMapping = async (
        req: Request,
        res: Response
    ) => {
        const languageId = req.params.languageId; // Keep as string for OneCompiler format
        const debugInfo = await this.examSubmissionService.debugLanguageMapping(languageId);
        return this.sendSuccess(res, 200, "Language mapping debug info retrieved", debugInfo);
    };
}