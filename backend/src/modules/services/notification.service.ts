import { FIELD_REQUIRED, NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { ClassesRepository } from "../repositories/classes.repository";
import { NotificationRepository } from "../repositories/notification.repository";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
import { UserRepository } from "../repositories/users.repository";
import { ApiError } from "../types/ApiError";

class NotificationService {
    private readonly notificationRepository: NotificationRepository = new NotificationRepository();
    private readonly userRepository: UserRepository = new UserRepository();
    private readonly studentClassesRepository: StudentClassesRepository = new StudentClassesRepository();
    private readonly classesRepository: ClassesRepository = new ClassesRepository();
    public async getAllNotifications() {
        const notifications = await this.notificationRepository.find({});
        return notifications;
    }

    public async getNotificationById(notification_id: number) {
        if (!notification_id) {
            throw new ApiError(
                400,
                FIELD_REQUIRED.error.message,
                FIELD_REQUIRED.error.details
            );
        }
        const notificationData = await this.notificationRepository.findById(notification_id);
        if (!notificationData) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        return notificationData;
    }

    // * when creating a notification, send mail to all students in the class
    public async createNotification(teacherId: number, classId: number, notificationData: any) {
        if (!teacherId || !classId || !notificationData) {
            throw new ApiError(
                400,
                FIELD_REQUIRED.error.message,
                FIELD_REQUIRED.error.details
            );
        }
        
    }
}