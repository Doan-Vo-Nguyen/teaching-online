import { Logger } from '../config/logger';
import { LecturesDTO } from '../DTO/lectures.dto';
import { ILecturesRepository } from '../interfaces/lectures.interface';

class LecturesService {
    constructor(private readonly lecturesRepository: ILecturesRepository) {}

    async getAll(options: Partial<LecturesDTO> = {}): Promise<LecturesDTO[]> {
        try {
            return await this.lecturesRepository.find(options);
        } catch (error) {
            Logger.error(error);
        }
    }

    async getById(lecture_id: number): Promise<LecturesDTO> {
        try {
            const lecture = await this.lecturesRepository.findById(lecture_id);
            return lecture;
        } catch (error) {
            Logger.error(error);
        }
    }

    async create(lecture: LecturesDTO): Promise<LecturesDTO> {
        try {
            const newLecture = await this.lecturesRepository.save(lecture);
            return newLecture;
        } catch (error) {
            Logger.error(error);
        }
    }

    async update(lecture_id: number, lecture: LecturesDTO): Promise<LecturesDTO> {
        try {
            await this.lecturesRepository.update(lecture_id, lecture);
            const updatedLecture = await this.lecturesRepository.findById(lecture_id);
            return updatedLecture;
        } catch (error) {
            Logger.error(error);
        }
    }

    async delete(lecture_id: number): Promise<LecturesDTO> {
        try {
            const deletedLecture = await this.lecturesRepository.delete(lecture_id);
            return deletedLecture;
        } catch (error) {
            Logger.error(error);
        }
    }
}

export default LecturesService;