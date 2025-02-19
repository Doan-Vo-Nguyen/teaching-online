import { Request, Response, NextFunction } from 'express';
import { LecturesDTO } from '../DTO/lectures.dto';
import { ILecturesRepository } from '../interfaces/lectures.interface';
import { sendResponse } from '../../common/interfaces/base-response';
import { LecturesRepository } from '../repositories/lectures.repository';

class LecturesService {
    private readonly lecturesRepository: ILecturesRepository = new LecturesRepository();

    public readonly getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const options: Partial<LecturesDTO> = req.query;
            const lectures = await this.lecturesRepository.find(options);
            return sendResponse(res, true, 200, "Get all lectures successfully", lectures);
        } catch (error) {
            next(error);
        }
    }

    public readonly getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lecture_id = parseInt(req.params.id, 10);
            const lecture = await this.lecturesRepository.findById(lecture_id);
            if (!lecture) {
                return sendResponse(res, false, 404, "Lecture not found", null);
            }
            return sendResponse(res, true, 200, "Get lecture by id successfully", lecture);
        } catch (error) {
            next(error);
        }
    }

    public readonly create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lecture: LecturesDTO = req.body;
            const newLecture = await this.lecturesRepository.save(lecture);
            return sendResponse(res, true, 201, "Create lecture successfully", newLecture);
        } catch (error) {
            next(error);
        }
    }

    public readonly update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lecture_id = parseInt(req.params.id, 10);
            const lecture: LecturesDTO = req.body;
            await this.lecturesRepository.update(lecture_id, lecture);
            const updatedLecture = await this.lecturesRepository.findById(lecture_id);
            return sendResponse(res, true, 200, "Update lecture successfully", updatedLecture);
        } catch (error) {
            next(error);
        }
    }

    public readonly delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lecture_id = parseInt(req.params.id, 10);
            const lecture = await this.lecturesRepository.findById(lecture_id);
            if (!lecture) {
                return sendResponse(res, false, 404, "Lecture not found", null);
            }
            await this.lecturesRepository.delete(lecture_id);
            return sendResponse(res, true, 200, "Delete lecture successfully", lecture);
        } catch (error) {
            next(error);
        }
    }
}

export default LecturesService;