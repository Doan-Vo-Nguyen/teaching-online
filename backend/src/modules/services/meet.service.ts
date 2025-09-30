import { MeetDTO } from "../DTO/meet.dto";
import { BAD_REQUEST, MEET_ERROR, MEET_NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { Meet } from "../entity/Meet.entity";
import { IClassesRepository } from "../interfaces/classes.interface";
import { IMeetRepository } from "../interfaces/meet.interface";
import { ClassesRepository } from "../repositories/classes.repository";
import { MeetRepository } from "../repositories/meet.repository";
import { ApiError } from "../types/ApiError";
import { Logger } from "../config/logger";

class MeetService {
    private readonly meetRepository: IMeetRepository = new MeetRepository();
    private readonly classRepository: IClassesRepository = new ClassesRepository();

    public async deleteMeetingById(id: number) {
        const existedMeet = await this.meetRepository.findById(id);
        this.throwIfMeetNotFound(existedMeet);
        const meet = await this.meetRepository.delete(id);
        if (!meet) {
            throw new ApiError(400, MEET_ERROR.error.message, MEET_ERROR.error.details);
        }
        return meet;
    }
    
    public async createMeeting(classId: number, meeting: Meet): Promise<Meet> {
        try {
            const existedClass = await this.classRepository.findById(classId);
            this.throwIfClassNotFound(existedClass);
            
            const meet = await this.meetRepository.createMeetingRoomByClassId(classId, meeting);
            
            return meet;
        } catch (error) {
            throw new ApiError(400, BAD_REQUEST.error.message, BAD_REQUEST.error.details);
        }
    }

    public async getAllMeetingByClass(classId: number): Promise<MeetDTO[]> {
        const meet = await this.meetRepository.getAllMeetingsByClassId(classId);
        if(!meet) {
            throw new ApiError(400, MEET_NOT_FOUND.error.message, MEET_NOT_FOUND.error.details);
        }
        return meet;
    }

    public async deleteMeeting(meetingId: number): Promise<MeetDTO> {
        const meet = await this.meetRepository.deleteMeetingRoomByClassId(meetingId);
        if(!meet) {
            throw new ApiError(400, MEET_NOT_FOUND.error.message, MEET_NOT_FOUND.error.details);
        }
        return meet;
    }

    private throwIfMeetNotFound(meet: any): void {
        if (!meet) {
            throw new ApiError(400, MEET_NOT_FOUND.error.message, MEET_NOT_FOUND.error.details);
        }
    }

    private throwIfClassNotFound(classData: any): void {
        if (!classData) {
            Logger.error(`Class not found for meeting creation`, undefined, {
                classId: classData,
                ctx: 'meeting'
            });
            throw new ApiError(400, MEET_NOT_FOUND.error.message, MEET_NOT_FOUND.error.details);
        }
    }
}

export default MeetService;