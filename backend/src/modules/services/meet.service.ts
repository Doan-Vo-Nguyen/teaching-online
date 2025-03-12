import { MeetDTO } from "../DTO/meet.dto";
import { MEET_NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { Meet } from "../entity/Meet.entity";
import { IClassesRepository } from "../interfaces/classes.interface";
import { IMeetRepository } from "../interfaces/meet.interface";
import { ClassesRepository } from "../repositories/classes.repository";
import { MeetRepository } from "../repositories/meet.repository";
import { ApiError } from "../types/ApiError";

class MeetService {
    private readonly meetRepository: IMeetRepository = new MeetRepository();
    private readonly classRepository: IClassesRepository = new ClassesRepository();
    
    public async createMeeting(classId: number, meeting: Meet): Promise<Meet> {
        console.log(`Creating meeting for class ID: ${classId}`, { meeting });
        
        try {
            const existedClass = await this.classRepository.findById(classId);
            console.log('Class found:', existedClass);
            
            if(!existedClass) {
                console.error(`Class with ID ${classId} not found`);
                throw new ApiError(400, MEET_NOT_FOUND.error.message, MEET_NOT_FOUND.error.details);
            }
            
            // Fix: The method was incorrectly calling itself recursively
            // Change from this.createMeeting to this.meetRepository.createMeeting
            console.log('Creating meeting in repository');
            const meet = await this.meetRepository.createMeetingRoomByClassId(classId, meeting);
            console.log('Meeting created successfully:', meet);
            
            return meet;
        } catch (error) {
            console.error('Error creating meeting:', error);
            throw error;
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
}

export default MeetService;