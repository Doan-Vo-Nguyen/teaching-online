import { Notification } from "../entity/Notification.entity";
import { IBaseRepository } from "./base.interface";

export interface INotificationRepository extends IBaseRepository<Notification> {
    createNotification(teacherId: number, classId: number, notificationData: any): Promise<Notification>;
}