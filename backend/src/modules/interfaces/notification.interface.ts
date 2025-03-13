import { Notification } from "../entity/Notification.entity";
import { IBaseRepository } from "./base.interface";

export interface INotificationRepository extends IBaseRepository<Notification> {
    getAllNotificationByTeacher(teacher_id: number): Promise<Notification[]>;
    createNotification(teacher_id: number, class_id: number, notificationData: Notification): Promise<Notification>;
    updateNotification(id: number, notificationData: Notification): Promise<Notification>;
    deleteNotification(id: number): Promise<Notification>;
}