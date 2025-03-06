import { Notification } from "../entity/Notification.entity";
import { BaseRepository } from "./base.repository";

export class NotificationRepository extends BaseRepository<Notification> {
    constructor() {
        super(Notification);
    }

    async find(options: any): Promise<Notification[]> {
        return this.repository.find(options);
    }

    async findById(notification_id: number): Promise<Notification> {
        return this.repository.findOneBy({ notification_id });
    }

    async save(notification: Notification): Promise<Notification> {
        return this.repository.save(notification);
    }

    async update(notification_id: number, notification: Notification): Promise<Notification> {
        await this.repository.update(notification_id, notification);
        return this.repository.findOneBy({ notification_id });
    }

    async delete(notification_id: number): Promise<Notification> {
        const notification = await this.repository.findOneBy({ notification_id });
        return this.repository.remove(notification);
    }


    async createNotification(teacherId: number, classId: number, notificationData: Notification): Promise<Notification> {
        const noti = this.repository.save({
            ...notificationData,
            teacher_id: teacherId,
            class_id: classId,
        });
        return noti;
    }
}