import { LecturesDTO } from "../DTO/lectures.dto";
import { LecturesContentDTO } from "../DTO/lectures-content.dto";
import { ILecturesRepository } from "../interfaces/lectures.interface";
import { ILecturesContentRepository } from "../interfaces/lectures-content.interface";
import { LecturesRepository } from "../repositories/lectures.repository";
import { LecturesContentRepository } from "../repositories/lectures-content.repository";
import { ApiError } from "../types/ApiError";
import {
  CREATE_FAILED,
  FIELD_REQUIRED,
  NOT_FOUND,
} from "../DTO/resDto/BaseErrorDto";
import { ClassesRepository } from "../repositories/classes.repository";
import { LectureType } from "../constant";

class LecturesService {
  private readonly lecturesRepository: ILecturesRepository = new LecturesRepository();
  private readonly lecturesContentRepository: ILecturesContentRepository = new LecturesContentRepository();
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
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const lecture = await this.lecturesRepository.findById(lecture_id);
    if (!lecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    const lectureContent = await this.lecturesContentRepository.findById(lecture_id);

    return {
      ...lecture,
      content: lectureContent || null,
    };
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

    await this.lecturesContentRepository.delete(id);
    await this.lecturesRepository.delete(id);
  }

  public async getAllLecturesByClassId(class_id: number) {
    if (!class_id) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const lectures = await this.lecturesRepository.getAllLecturesByClassId(class_id);
    if (lectures.length === 0) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    return lectures;
  }

  public async getLecturesDetailsByClassId(lecture_id: number, class_id: number) {
    if (!lecture_id || !class_id) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const lecture = await this.lecturesRepository.findLectureByClassIdAndLectureId(lecture_id, class_id);
    if (!lecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    const lectureContent = await this.lecturesContentRepository.findById(lecture_id);

    return {
      ...lecture,
      content: lectureContent || null,
    };
  }

  public async getAllLecturesContentByLectureId(lecture_id: number) {
    if (!lecture_id) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const lectureContent = await this.lecturesContentRepository.getAllLecturesContentByLectureId(lecture_id);
    if (lectureContent.length === 0) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    return lectureContent;
  }

  // TODO: Implement the following methods after fixing the fetch id from the request
  // public async getDetailsLecturesContentById(lecture_id: number, class_id: number) {
  //   if (!lecture_id || !class_id) {
  //     throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
  //   }
  // TODO: Implement the following methods after fixing the fetch id from the request
  //   const lecture = await this.lecturesRepository.findLectureByClassIdAndLectureId(lecture_id, class_id);
  //   if (!lecture) {
  //     throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
  //   }
  // TODO: Implement the following methods after fixing the fetch id from the request
  //   const lectureContent = await this.lecturesContentRepository.getLecturesContentById(lecture_id);
  //   if (!lectureContent) {
  //     throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
  //   }
  //   return lectureContent;
  // }

  public async createLectureByClassId(class_id: number, data: { title: string; content?: string; type?: LectureType }) {
    if (!class_id) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const existedClass = await this.classesRepository.findById(class_id);
    if (!existedClass) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    const newLecture = await this.lecturesRepository.save({
      ...data, class_id,
      lecture_id: 0,
      created_at: undefined,
      updated_at: undefined
    });

    if (data.content && newLecture.lecture_id) {
      const contentData: LecturesContentDTO = {
        lecture_id: newLecture.lecture_id,
        content: data.content,
        type: data.type,
      };

      await this.lecturesContentRepository.save({
        ...contentData, id: 0,
        created_at: undefined,
        updated_at: undefined
      });
    }

    return newLecture;
  }

  public async updateLectureByClassId(lecture_id: number, class_id: number, data: LecturesDTO) {
    if (!lecture_id || !class_id) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const existedLecture = await this.lecturesRepository.findLectureByClassIdAndLectureId(lecture_id, class_id);
    if (!existedLecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    const updatedLecture = await this.lecturesRepository.update(lecture_id, data);
    return updatedLecture
  }

  public async deleteLectureByClassId(lecture_id: number, class_id: number) {
    if (!lecture_id || !class_id) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const lecture = await this.lecturesRepository.findLectureByClassIdAndLectureId(lecture_id, class_id);
    if (!lecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    const lectureContent = await this.lecturesContentRepository.findById(lecture_id);
    if (lectureContent) {
      await this.lecturesContentRepository.delete(lecture_id);
    }
    await this.lecturesRepository.deleteLectureByClassId(lecture_id, class_id);
  }

  public async addContentToLecture(lecture_id: number, classId: number, content: string, type: LectureType) {
    if (!lecture_id || !classId || !content) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const existedLecture = await this.lecturesRepository.findById(lecture_id);
    if (!existedLecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    const classExist = await this.classesRepository.findById(classId);
    if (!classExist) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    const existedContent = await this.lecturesContentRepository.findById(lecture_id);
    if (existedContent) {
      throw new ApiError(400, "Content already existed", "Content already existed");
    }
    const newContent = await this.lecturesContentRepository.addLecturesContent(lecture_id, content, type);
    return newContent;
  }

  public async deleteContentFromLecture(lectureId: number, lectureContentId: number) {
    if (!lectureId) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const existedLecture = await this.lecturesRepository.findById(lectureId);
    if (!existedLecture) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    const existedContent = await this.lecturesContentRepository.findById(lectureContentId);
    if (!existedContent) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }

    await this.lecturesContentRepository.deleteLecturesContent(lectureId, lectureContentId);
    return { success: true, message: "Lecture content deleted successfully" };
  }
}

export default LecturesService;
