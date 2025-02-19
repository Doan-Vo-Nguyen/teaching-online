import { Request, Response, NextFunction } from 'express';
import { ClassesDTO } from "../DTO/classes.dto";
import { Logger } from "../config/logger";
import { sendResponse } from "../../common/interfaces/base-response";
import { IClassesRepository } from '../interfaces/classes.interface';
import { ClassesRepository } from '../repositories/classes.repository';

class ClassesService {
    private readonly classesRepository: IClassesRepository = new ClassesRepository();

    public readonly getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const options: Partial<ClassesDTO> = req.query;
            const listClasses = await this.classesRepository.find(options);
            return sendResponse(res, true, 200, "Get all classes successfully", listClasses);
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    }

    public readonly getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const class_id = parseInt(req.params.id, 10);
            const classes = await this.classesRepository.findById(class_id);
            if (!classes) {
                return sendResponse(res, false, 404, "Class not found", null);
            }
            return sendResponse(res, true, 200, "Get class by id successfully", classes);
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    }

    public readonly create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classes: ClassesDTO = req.body;
            const newClasses = await this.classesRepository.save(classes);
            return sendResponse(res, true, 200, "Create class successfully", newClasses);
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    }

    public readonly update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const class_id = parseInt(req.params.id, 10);
            const classes: ClassesDTO = req.body;
            await this.classesRepository.update(class_id, classes);
            const updatedClasses = await this.classesRepository.findById(class_id);
            return sendResponse(res, true, 200, "Update class successfully", updatedClasses);
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    }

    public readonly delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const class_id = parseInt(req.params.id, 10);
            const data = await this.classesRepository.findById(class_id);
            if (!data) {
                return sendResponse(res, false, 404, "Class not found", null);
            }
            const result = await this.classesRepository.delete(class_id);
            return sendResponse(res, true, 200, "Delete class successfully", result);
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    }
}

export default ClassesService;