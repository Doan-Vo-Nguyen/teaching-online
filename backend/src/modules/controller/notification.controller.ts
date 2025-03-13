import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import NotificationService from "../services/notification.service";
import { Request, Response, NextFunction } from "express";

export class NotificationController extends BaseController {
    private readonly notificationService: NotificationService;
  constructor(path: string) {
    super(path);
    this.notificationService = new NotificationService();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/", this.getAllNotifications);
    this.router.get("/:notification_id", this.getNotificationById);
    this.router.post("/:teacherId/:classId", this.createNotification);
    this.router.put("/:notification_id", this.updateNotification);
    this.router.delete("/:notification_id", this.deleteNotification);
  }

  private readonly getAllNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
        try {
            const notifications = await this.notificationService.getAllNotifications();
            return sendResponse(res, true, 200, "Get all notifications successfully", notifications);
        } catch (error) {
            next(error);
        }
    }

    private readonly getNotificationById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notification_id = parseInt(req.params.notification_id, 10);
            const notificationData = await this.notificationService.getNotificationById(notification_id);
            return sendResponse(res, true, 200, "Get notification by id successfully", notificationData);
        } catch (error) {
            next(error);
        }
    }

    private readonly createNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const teacherId = parseInt(req.params.teacherId, 10);
            const classId = parseInt(req.params.classId, 10);
            const notificationData = req.body;
            console.log("teacherId", teacherId);
            console.log("classId", classId);
            console.log("notificationData", notificationData);
            await this.notificationService.createNotification(teacherId, classId, notificationData);
            return sendResponse(res, true, 200, "Create notification successfully", {});
        } catch (error) {
            next(error);
        }
    }

    private  readonly updateNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notification_id = parseInt(req.params.notification_id, 10);
            const notificationData = req.body;
            const notification = await this.notificationService.updateNotification(notification_id, notificationData);
            return sendResponse(res, true, 200, "Update notification successfully", notification);
        } catch (error) {
            next(error);
        }
    }

    private readonly deleteNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notification_id = parseInt(req.params.notification_id, 10);
            await this.notificationService.deleteNotification(notification_id);
            return sendResponse(res, true, 200, "Delete notification successfully", {});
        } catch (error) {
            next(error);
        }
    }
}