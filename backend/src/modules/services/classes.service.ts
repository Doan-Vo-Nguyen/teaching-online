import { Request, Response, NextFunction } from 'express';
import { ClassesDTO } from "../DTO/classes.dto";
import { Logger } from "../config/logger";
import { sendResponse } from "../../common/interfaces/base-response";
import { IClassesRepository } from '../interfaces/classes.interface';
import { ClassesRepository } from '../repositories/classes.repository';
import { ApiError } from '../types/ApiError';
import { CREATE_FAILED, FIELD_REQUIRED, NOT_FOUND } from '../DTO/resDto/BaseErrorDto';

class ClassesService {
    private readonly classesRepository: IClassesRepository = new ClassesRepository();

    public async getAllClasses() {
        return await this.classesRepository.find({});
    }

    public async getClassById(class_id: number) {
        if (!class_id) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const classData = await this.classesRepository.findById(class_id);
        if (!classData) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        return classData;
    }

    public async createClass(classData: ClassesDTO) {
        if (!classData) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        classData.class_code = this.generateRandomCode();
        const newClasses = await this.classesRepository.save(classData);
        if (!newClasses) {
            throw new ApiError(400, CREATE_FAILED.error.message, CREATE_FAILED.error.details);
        }
        return newClasses;
        
    }

    public async updateClass(id: number, classData: ClassesDTO) {
        if (!id) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const existedClass = await this.classesRepository.findById(id);
        if (!existedClass) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        const updatedClass = await this.classesRepository.update(id, classData);
        return updatedClass;
    }

    public async deleteClass(id: number) {
        if (!id) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const existedClass = await this.classesRepository.findById(id);
        if (!existedClass) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        await this.classesRepository.delete(id);
    }

    private generateRandomCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            if (i === 3) result += ' ';
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
export default ClassesService;
