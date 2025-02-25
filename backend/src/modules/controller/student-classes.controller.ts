import { sendResponse } from 'src/common/interfaces/base-response';
import BaseController from '../abstracts/base-controller';
import StudentClassesService from '../services/student-class.service';
import { Request, Response, NextFunction } from 'express';
export class StudentClassesController extends BaseController {
    private readonly studentClassService: StudentClassesService;
    constructor(path: string) {
        super(path);
        this.studentClassService = new StudentClassesService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this.getAllStudentClasses);
        this.router.get('/:id', this.getStudentClassById);
        
    }

    private readonly getAllStudentClasses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const studentClasses = await this.studentClassService.getAllStudentClasses();
            return sendResponse(res, true, 200, "Get all student classes successfully", studentClasses);
        } catch (error) {
            next(error);
        }
    }

    private readonly getStudentClassById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const studentClassId = parseInt(req.params.id, 10);
            const studentClass = await this.studentClassService.getStudentClassById(studentClassId);
            return sendResponse(res, true, 200, "Get student class by id successfully", studentClass);
        } catch (error) {
            next(error);
        }
    }

    private readonly getStudentClassByUserIdAndClassId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.query.user_id as string, 10);
            const classId = parseInt(req.query.class_id as string, 10);
            const studentClass = await this.studentClassService.getStudentClassByUserIdAndClassId(userId, classId);
            return sendResponse(res, true, 200, "Get student class by user id and class id successfully", studentClass);
        } catch (error) {
            next(error);
        }
    }
}