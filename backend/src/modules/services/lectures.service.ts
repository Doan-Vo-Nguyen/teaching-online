import { LecturesDTO } from "../DTO/lectures.dto";
import { ILecturesRepository } from "../interfaces/lectures.interface";
import { LecturesRepository } from "../repositories/lectures.repository";
import { ApiError } from "../types/ApiError";
import {
  CREATE_FAILED,
  FIELD_REQUIRED,
  NOT_FOUND,
} from "../DTO/resDto/BaseErrorDto";
import { ClassesRepository } from "../repositories/classes.repository";

class LecturesService {
  private readonly lecturesRepository: ILecturesRepository =
    new LecturesRepository();
  private readonly classesRepository: ClassesRepository = new ClassesRepository();

  public async getAllLectures() {
    const lectures = await this.lecturesRepository.find({});
    if (lectures.length === 0) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    return lectures;
  }

  public async getLectureById(lecture_id: number) {
    if (!lecture_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const lecture = await this.lecturesRepository.findById(lecture_id);
    if (!lecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    return lecture;
  }

  public async createLecture(lectureData: LecturesDTO) {
    if (!lectureData) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const newLecture = await this.lecturesRepository.save(lectureData);
    if (!newLecture) {
      throw new ApiError(
        400,
        CREATE_FAILED.error.message,
        CREATE_FAILED.error.details
      );
    }
    return newLecture;
  }

  public async updateLecture(id: number, lectureData: LecturesDTO) {
    if (!id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const existedLecture = await this.lecturesRepository.findById(id);
    if (!existedLecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    const updatedLecture = await this.lecturesRepository.update(
      id,
      lectureData
    );
    return updatedLecture;
  }

  public async deleteLecture(id: number) {
    if (!id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const existedLecture = await this.lecturesRepository.findById(id);
    if (!existedLecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    await this.lecturesRepository.delete(id);
  }

  public async getAllLecturesByClassId(class_id: number) {
    if (!class_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const lectures =
      await this.lecturesRepository.getAllLecturesByClassId(class_id);
    if (lectures.length === 0) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    return lectures;
  }

  public async getLecturesDetailsByClassId(
    lecture_id: number,
    class_id: number
  ) {
    if (!lecture_id || !class_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const lectures = await this.lecturesRepository.getLecturesDetailsByClassId(
      lecture_id,
      class_id
    );
    if (lectures.length === 0) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    return lectures;
  }

  public async createLectureByClassId(class_id: number, data: any) {
    if (!class_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const existedClass = await this.classesRepository.findById(class_id);
    if (!existedClass) {
      console.log(existedClass);
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    const newLecture = await this.lecturesRepository.createLectureByClassId(
      class_id,
      data
    );
    return newLecture;
  }

  public async updateLectureByClassId(
    lecture_id: number,
    class_id: number,
    data: LecturesDTO
  ) {
    if (!lecture_id || !class_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const updatedLecture = await this.lecturesRepository.updateLectureByClassId(
      lecture_id,
      class_id,
      data
    );
    return updatedLecture;
  }

  public async deleteLectureByClassId(lecture_id: number, class_id: number) {
    if (!lecture_id || !class_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const deletedLecture = await this.lecturesRepository.deleteLectureByClassId(
      lecture_id,
      class_id
    );
    return deletedLecture;
  }
}

export default LecturesService;
