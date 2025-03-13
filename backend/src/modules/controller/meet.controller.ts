import { authentication } from './../middleware/auth.middleware';
import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import MeetService from "../services/meet.service";
import { Request, Response, NextFunction } from "express";

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
}