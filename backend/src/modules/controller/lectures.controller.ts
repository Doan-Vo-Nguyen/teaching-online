import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import { NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { LecturesRepository } from "../repositories/lectures.repository";
import LecturesService from "../services/lectures.service";
import { Request, Response, NextFunction } from "express";

export class LecturesController extends BaseController {
    private readonly _service: LecturesService;

    constructor(path: string) {
        super(path);
        const lectureRepository = new LecturesRepository();
        this._service = new LecturesService(lectureRepository);
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
        const listLectures = await this._service.getAll();
        if(!listLectures) {
            return sendResponse(res, false, 404, "Lectures not found", NOT_FOUND);
        }
        return sendResponse(res, true, 200, "Get all lectures successfully", listLectures);
    }

    private readonly getById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const lecture_id = parseInt(req.params.id, 10);
        const lectures = await this._service.getById(lecture_id);
        if(!lectures) {
            return sendResponse(res, false, 404, "Lecture not found", NOT_FOUND);
        }
        return sendResponse(res, true, 200, "Get lecture by id successfully", lectures);
    }

    private readonly create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const lectures = req.body;
        const newLectures = await this._service.create(lectures);
        return sendResponse(res, true, 200, "Create lecture successfully", newLectures);
    }

    private readonly update = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const lecture_id = parseInt(req.params.id, 10);
        const lectures = req.body;
        const updatedLectures = await this._service.update(lecture_id, lectures);
        return sendResponse(res, true, 200, "Update lecture successfully", updatedLectures);
    }

    private readonly delete = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const lecture_id = parseInt(req.params.id, 10);
        const result = await this._service.delete(lecture_id);
        return sendResponse(res, true, 200, "Delete lecture successfully", result);
    }
}