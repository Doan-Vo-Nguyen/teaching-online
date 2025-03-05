import { LectureType } from "../constant";
import { LecturesContent } from "../entity/LecturesContent.entity";
import { IBaseRepository } from "./base.interface";

export interface ILecturesContentRepository extends IBaseRepository<LecturesContent> {
    getLecturesContentById(lecture_id: number): Promise<LecturesContent[]>; // get all content by lecture_id
    getAllLecturesContentByLectureId(lecture_id: number): Promise<LecturesContent[]>; // get all content by lecture_id
    // getDetailsLecturesContentById(lecture_id: number, file_name: string): Promise<LecturesContent>; // * get details content by lecture_id and file_name
    addLecturesContent(lecture_id: number, file_name: string, type: LectureType): Promise<LecturesContent>;
    deleteLecturesContent(lecture_id: number, lecture_content_id: number): Promise<LecturesContent>;
}