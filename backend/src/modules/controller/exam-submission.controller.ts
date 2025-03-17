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
        // Resource: exam submissions collection
        this.router.get("/", authentication, this.getAllExamSubmissions);
        this.router.post("/", authentication, this.createExamSubmission);
        
        // Resource: single exam submission
        this.router.get("/:id", authentication, this.getExamSubmissionById);
        this.router.put("/:id", authentication, this.updateExamSubmission);
        this.router.delete("/:id", authentication, this.deleteExamSubmission);
        
        // Resource: exam submissions for a specific exam
        this.router.get("/exams/:examId/submissions", authentication, this.getExamSubmissionsByExamId);
        
        // Resource: exam submissions for a specific student
        this.router.get("/exams/:examId/students/:studentId/classes/:classId/submissions", authentication, this.getExamSubmissionsByOneStudent);
        
        // Resource: exam submission status for a student in a class
        this.router.get("/exams/:examId/classes/:classId/status", authentication, this.getExamSubmissionStatus);
        
        // Resource: create submission for a student in a class
        this.router.post("/exams/:examId/students/:studentId/classes/:classId/submissions", authentication, this.createExamSubmissionByStudentAndClass);
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
            const createdExamSubmission = await this.examSubmissionService.createExamSubmission(
                examSubmission.examId,
                examSubmission.studentClassId,
                examSubmission
            );
            return sendResponse(res, true, 201, "Created exam submission successfully", createdExamSubmission);
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
            const createdExamSubmission = await this.examSubmissionService.createExamSubmissionByStudentAndClass(
                examId, 
                studentId, 
                classId, 
                examSubmission
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
}