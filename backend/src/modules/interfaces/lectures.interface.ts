import { Lectures } from "../entity/Lectures.entity";
import { IBaseRepository } from "./base.interface";

export interface ILecturesRepository extends IBaseRepository<Lectures> {
    getAllLecturesByClassId(class_id: number): Promise<Lectures[]>
    getLecturesDetailsByClassId(lecture_id: number, class_id: number): Promise<Lectures[]>
    createLectureByClassId(class_id: number, data: Lectures): Promise<Lectures>
    updateLectureByClassId(lecture_id: number, class_id: number, data: Lectures): Promise<Lectures>
    deleteLectureByClassId(lecture_id: number, class_id: number): Promise<Lectures[]>
}