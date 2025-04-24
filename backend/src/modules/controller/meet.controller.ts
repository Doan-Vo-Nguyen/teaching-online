import { authentication } from './../middleware/auth.middleware';
import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import MeetService from "../services/meet.service";
import { Request, Response, NextFunction } from "express";
import { logMeetingJoin, logMeetingLeave } from '../middleware/audit-log.middleware';

export class MeetController extends BaseController {
    private readonly meetService: MeetService;

    constructor(path: string) {
        super(path);
        this.meetService = new MeetService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.delete("/:meeting_id", authentication, this.deleteMeetingById);
        this.router.get("/:class_id", authentication, this.getAllMeetingByClass);
        this.router.post("/:class_id", authentication, this.createMeeting);
        this.router.delete("/:class_id",authentication, this.deleteMeeting);
        
        // Add routes specifically for logging meeting joins and leaves
        this.router.post("/:meetingId/join", authentication, logMeetingJoin, this.joinMeeting);
        this.router.post("/:meetingId/leave", authentication, logMeetingLeave, this.leaveMeeting);
    }

    private readonly deleteMeetingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const meetingId = parseInt(req.params.meeting_id, 10);
            const meeting = await this.meetService.deleteMeetingById(meetingId);
            return sendResponse(res, true, 200, "Delete meeting successfully", meeting);
        }
        catch (error) {
            next(error);
        }
    };

    private readonly getAllMeetingByClass = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classId = parseInt(req.params.class_id, 10);
            const meeting = await this.meetService.getAllMeetingByClass(classId);
            return sendResponse(res, true, 200, "Get all meetings successfully", meeting);
        } catch (error) {
            next(error);
        }
    };

    private readonly createMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const classId = parseInt(req.params.class_id, 10);
            const { roomName, link } = req.body;
            const meeting = {
                room_name: roomName,
                room_url: link,
                class_id: classId
            } as any; // Using as any for now, ideally replace with proper Meet type
            const newMeeting = await this.meetService.createMeeting(classId, meeting);
            return sendResponse(res, true, 200, "Create meeting successfully", newMeeting);
        } catch (error) {
            next(error);
        }
    };

    private readonly deleteMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const meetingId = parseInt(req.params.class_id, 10);
            const meeting = await this.meetService.deleteMeeting(meetingId);
            return sendResponse(res, true, 200, "Delete meeting successfully", meeting);
        } catch (error) {
            next(error);
        }
    };

    private readonly joinMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const meetingId = parseInt(req.params.meetingId, 10);
            // Simply record that the user joined the meeting, no need to modify anything
            return sendResponse(res, true, 200, "Joined meeting successfully", { meetingId });
        } catch (error) {
            next(error);
        }
    };

    private readonly leaveMeeting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const meetingId = parseInt(req.params.meetingId, 10);
            // Simply record that the user left the meeting, no need to modify anything
            return sendResponse(res, true, 200, "Left meeting successfully", { meetingId });
        } catch (error) {
            next(error);
        }
    };
}