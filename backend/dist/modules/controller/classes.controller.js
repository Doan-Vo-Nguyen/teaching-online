import BaseController from "../abstracts/base-controller.js";
import ClassesService from "../services/classes.service.js";
import { sendResponse } from "../../common/interfaces/base-response.js";
import { Classes } from "../entity/Classes.entity.js";
import { BaseRepository } from "../repositories/base.repository.js";
export class ClassesController extends BaseController {
    _service;
    constructor(path) {
        super(path);
        const classesRepository = new BaseRepository(Classes);
        this._service = new ClassesService(classesRepository);
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getById);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }
    getAll = async (req, res, next) => {
        const listClasses = await this._service.getAll();
        return sendResponse(res, true, 200, "Get all classes successfully", listClasses);
    };
    getById = async (req, res, next) => {
        const class_id = parseInt(req.params.id, 10);
        const classes = await this._service.getById(class_id);
        return sendResponse(res, true, 200, "Get class by id successfully", classes);
    };
    create = async (req, res, next) => {
        const classes = req.body;
        const newClasses = await this._service.create(classes);
        return sendResponse(res, true, 200, "Create class successfully", newClasses);
    };
    update = async (req, res, next) => {
        const class_id = parseInt(req.params.id, 10);
        const classes = req.body;
        const updatedClasses = await this._service.update(class_id, classes);
        return sendResponse(res, true, 200, "Update class successfully", updatedClasses);
    };
    delete = async (req, res, next) => {
        const class_id = parseInt(req.params.id, 10);
        const deletedClasses = await this._service.delete(class_id);
        return sendResponse(res, true, 200, "Delete class successfully", deletedClasses);
    };
}
//# sourceMappingURL=classes.controller.js.map