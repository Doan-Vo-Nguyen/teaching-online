import { Meet } from "../entity/Meet.entity";
import { BaseRepository } from "./base.repository";

export class MeetRepository extends BaseRepository<Meet> {
    constructor() {
        super(Meet);
    }

    async findMeetingByClassId(class_id: number): Promise<Meet> {
        return this.repository.findOneBy({ class_id });
    }

    async createMeetingRoomByClassId(class_id: number, meet: Meet): Promise<Meet> {
        const meeting = await this.repository.save({ class_id, ...meet });
        return meeting;
    }

    async getAllMeetingsByClassId(class_id: number): Promise<Meet[]> {
        return this.repository.find({ where: { class_id } });
    }

    async deleteMeetingRoomByClassId(class_id: number): Promise<Meet> {
        const meeting = await this.repository.findOneBy({ class_id });
        return this.repository.remove(meeting);
    }
}