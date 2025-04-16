import { FIELD_REQUIRED, NOT_FOUND } from "../DTO/resDto/BaseErrorDto";
import { StudentClasses } from "../entity/Student_classes.entity";
import { ClassesRepository } from "../repositories/classes.repository";
import { NotificationRepository } from "../repositories/notification.repository";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
import { UserRepository } from "../repositories/users.repository";
import { ApiError } from "../types/ApiError";
import { sendPersonalNotificationMail } from "../utils/mailer";
import { Logger } from "../config/logger";

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
        const teacher = await this.userRepository.findById(teacherId);
        if (!teacher) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        const classData = await this.classesRepository.findById(classId);
        if (!classData) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        const students = await this.studentClassesRepository.find({ class_id: classId });
        if (!students) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }

        try {
            const newNotification = await this.notificationRepository.createNotification(
                teacherId,
                classId,
                {
                    title: notificationData.title,
                    content: notificationData.content,
                    notification_id: 0,
                    class_id: classId,
                    teacher_id: teacherId,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            );
            
            const emails = await this.getStudentEmailsByClassId(classId);
            if (emails.length === 0) {
                throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
            }
            await this.sendMailToStudents(emails, newNotification.title, newNotification.content);
            return newNotification;
        } catch (error) {
            Logger.error("Notification creation error", undefined, {
                teacherId,
                classId,
                ctx: 'notification',
                error
            });
        }
    }

    public async updateNotification(id: number, notificationData: any) {
        if (!id || !notificationData) {
            throw new ApiError(
                400,
                FIELD_REQUIRED.error.message,
                FIELD_REQUIRED.error.details
            );
        }
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        const updatedNotification = await this.notificationRepository.update(id, notificationData);

        // Send mail to students when notification is updated
        const emails = await this.getStudentEmailsByClassId(notification.class_id);
        if (emails.length === 0) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        await this.sendMailToStudents(emails, updatedNotification.title, updatedNotification.content);

        return updatedNotification;
    }

    public async deleteNotification(id: number) {
        if (!id) {
            throw new ApiError(
                400,
                FIELD_REQUIRED.error.message,
                FIELD_REQUIRED.error.details
            );
        }
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
        }
        const deletedNotification = await this.notificationRepository.delete(id);
        return deletedNotification;
    }

    private async getStudentEmailsByClassId(classId: number): Promise<string[]> {
        // Get all students in the class
        const studentClasses = await this.studentClassesRepository.findByClassId(classId);
        if (!studentClasses.length) return [];
        
        // Extract student IDs
        const studentIds = studentClasses.map((studentClass: StudentClasses) => studentClass.student_id);
        
        // Get student details
        const students = await this.userRepository.findByIds(studentIds);
        
        // Extract and return email addresses
        return students.map((student: any) => student.email);
    }

    private async sendMailToStudents(emails: string[], title: string, content: string) {
       try {
        await sendPersonalNotificationMail(emails, title, content);
        Logger.info("Notification email sent to students", {
            recipientCount: emails.length,
            title,
            ctx: 'email'
        });
       } catch (error) {
        Logger.error("Failed to send notification email", undefined, {
            recipientCount: emails.length,
            title,
            ctx: 'email',
            error
        });
       }
    }

}

export default NotificationService;