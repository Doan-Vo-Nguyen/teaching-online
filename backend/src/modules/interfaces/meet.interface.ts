import { Meet } from "../entity/Meet.entity";
import { IBaseRepository } from "./base.interface";

export interface IMeetRepository extends IBaseRepository<Meet> {
    findMeetingByClassId(class_id: number): Promise<Meet>;
    createMeetingRoomByClassId(class_id: number, meet: Meet): Promise<Meet>;
    getAllMeetingsByClassId(class_id: number): Promise<Meet[]>;
    deleteMeetingRoomByClassId(class_id: number): Promise<Meet>;
}