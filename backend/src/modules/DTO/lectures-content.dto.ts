import { LectureType } from "../constant";

export class LecturesContentDTO {
  id?: number;
  lecture_id: number;
  content: string;
  type: LectureType;
  lecture?: any;
}