import { Request, Response, NextFunction } from 'express';
import BaseController from "../abstracts/base-controller";
import ClassesService from "../services/classes.service";
import { authorAdmin } from "../middleware/auth.middleware";
import { validParamId } from "../middleware/validate/field.validate";
import { sendResponse } from '../../common/interfaces/base-response';

export class ClassesController extends BaseController {
    private readonly classesService: ClassesService;

    constructor(path: string) {
        super(path);
        this.classesService = new ClassesService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this.getAllClasses);
        this.router.get('/:id', validParamId, this.getClassById);
        this.router.get('/teacher/:teacher_id', validParamId, this.getClassByTeacherId);
        this.router.get('/with-teacher', this.getAllClassesWithTeacher);
        this.router.post('/', authorAdmin, this.createClass);
        this.router.patch('/:id', validParamId, this.updateClass);
        this.router.delete('/:id', validParamId, this.deleteClass);
    }

    private readonly getAllClasses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classes = await this.classesService.getAllClasses();
            return sendResponse(res, true, 200, "Get all classes successfully", classes);
        } catch (error) {
            next(error);
        }
    }

    private readonly getClassById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classId = parseInt(req.params.id, 10);
            const classData = await this.classesService.getClassById(classId);
            return sendResponse(res, true, 200, "Get class by id successfully", classData);
        } catch (error) {
            next(error);
        }
    }

    private readonly createClass = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newClass = await this.classesService.createClass(req.body);
            return sendResponse(res, true, 200, "Create class successfully", newClass);
        } catch (error) {
            next(error);
        }
    }

    private readonly updateClass = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classId = parseInt(req.params.id, 10);
            const updatedClass = await this.classesService.updateClass(classId, req.body);
            return sendResponse(res, true, 200, "Update class successfully", updatedClass);
        } catch (error) {
            next(error);
        }
    }

    private readonly deleteClass = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classId = parseInt(req.params.id, 10);
            const result = await this.classesService.deleteClass(classId);
            return sendResponse(res, true, 200, "Delete class successfully", result);
        } catch (error) {
            next(error);
        }
    }

    private readonly findByClassCode = async (req: Request, res: Response, next: NextFunction) => { 
        try {
            const classCode = req.params.class_code;
            const classes = await this.classesService.findByClassCode(classCode);
            return sendResponse(res, true, 200, "Get class by class code successfully", classes);
        } catch (error) {
            next(error);
        }
    }

    private readonly getClassByTeacherId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const teacherId = parseInt(req.params.teacher_id, 10);
            const classes = await this.classesService.getClassByTeacherId(teacherId);
            return sendResponse(res, true, 200, "Get class by teacher id successfully", classes);
        } catch (error) {
            next(error);
        }
    }

    private readonly getAllClassesWithTeacher = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classes = await this.classesService.getAllClassesWithTeacher();
            return sendResponse(res, true, 200, "Get all classes with teacher successfully", classes);
        } catch (error) {
            next(error);
        }
    }
}