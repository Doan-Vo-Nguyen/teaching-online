import { LecturesDTO } from '../DTO/lectures.dto';
import { ILecturesRepository } from '../interfaces/lectures.interface';
import { LecturesRepository } from '../repositories/lectures.repository';
import { ApiError } from '../types/ApiError';
import { CREATE_FAILED, FIELD_REQUIRED, NOT_FOUND } from '../DTO/resDto/BaseErrorDto';

class LecturesService {
    private readonly lecturesRepository: ILecturesRepository = new LecturesRepository();

    public async getAllLectures() {
        return await this.lecturesRepository.find({});
    }

    public async getLectureById(lecture_id: number) {
        if (!lecture_id) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const lecture = await this.lecturesRepository.findById(lecture_id);
        if (!lecture) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        return lecture;
    }

    public async createLecture(lectureData: LecturesDTO) {
        if (!lectureData) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const newLecture = await this.lecturesRepository.save(lectureData);
        if (!newLecture) {
            throw new ApiError(400, CREATE_FAILED.error.message, CREATE_FAILED.error.details);
        }
        return newLecture;
    }

    public async updateLecture(id: number, lectureData: LecturesDTO) {
        if (!id) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const existedLecture = await this.lecturesRepository.findById(id);
        if (!existedLecture) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        const updatedLecture = await this.lecturesRepository.update(id, lectureData);
        return updatedLecture;
    }

    public async deleteLecture(id: number) {
        if (!id) {
            throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
        }
        const existedLecture = await this.lecturesRepository.findById(id);
        if (!existedLecture) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        await this.lecturesRepository.delete(id);
    }
}

export default LecturesService;
