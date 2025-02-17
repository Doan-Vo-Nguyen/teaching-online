import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import ClassesService from "../services/classes.service";
import { sendResponse } from "../../common/interfaces/base-response";
import { ClassesRepository } from "../repositories/classes.repository";

export class ClassesController extends BaseController {
    private readonly _service: ClassesService;

    constructor(path: string) {
        super(path);
        const classesRepository = new ClassesRepository();
        this._service = new ClassesService(classesRepository);
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getById);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }

    private readonly getAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const listClasses = await this._service.getAll();
        return sendResponse(res, true, 200, "Get all classes successfully", listClasses);
    }

    private readonly getById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const class_id = parseInt(req.params.id, 10);
        const classes = await this._service.getById(class_id);
        return sendResponse(res, true, 200, "Get class by id successfully", classes);
    }

    private readonly create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const classes = req.body;
        const newClasses = await this._service.create(classes);
        return sendResponse(res, true, 200, "Create class successfully", newClasses);
    }

    private readonly update = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const class_id = parseInt(req.params.id, 10);
        const classes = req.body;
        const updatedClasses = await this._service.update(class_id, classes);
        return sendResponse(res, true, 200, "Update class successfully", updatedClasses);
    }

    private readonly delete = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const class_id = parseInt(req.params.id, 10);
        const deletedClasses = await this._service.delete(class_id);
        return sendResponse(res, true, 200, "Delete class successfully", deletedClasses);
    }
}