import { Notification } from "../entity/Notification.entity";
import { IBaseRepository } from "./base.interface";

export interface INotificationRepository extends IBaseRepository<Notification> {
    getStudent
    createNotification(teacher_id: number, class_id: number, notificationData: Notification): Promise<Notification>;
}