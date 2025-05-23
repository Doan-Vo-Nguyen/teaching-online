import { Entity, ObjectId, ObjectIdColumn, Column, CreateDateColumn } from "typeorm"

// Define Vietnam timezone offset
const VIETNAM_TIMEZONE = "+07:00";

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionType:
 *       type: string
 *       enum: [login, logout, view_page, submit_assignment, take_exam, join_meeting, leave_meeting, comment, other]
 *       description: Type of user action being logged
 */
export enum ActionType {
    LOGIN = 'login',
    LOGOUT = 'logout',
    VIEW_PAGE = 'view_page',
    SUBMIT_ASSIGNMENT = 'submit_assignment',
    TAKE_EXAM = 'take_exam',
    JOIN_MEETING = 'join_meeting',
    LEAVE_MEETING = 'leave_meeting',
    COMMENT = 'comment',
    OTHER = 'other'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the audit log
 *         user_id:
 *           type: integer
 *           description: The ID of the user who performed the action
 *         username:
 *           type: string
 *           description: The username of the user
 *         fullname:
 *           type: string
 *           description: The full name of the user
 *         action:
 *           $ref: '#/components/schemas/ActionType'
 *         target_id:
 *           type: integer
 *           nullable: true
 *           description: The ID of the target object (if applicable)
 *         target_type:
 *           type: string
 *           nullable: true
 *           description: The type of the target object
 *         ip_address:
 *           type: string
 *           nullable: true
 *           description: The IP address of the user
 *         user_agent:
 *           type: string
 *           nullable: true
 *           description: The user agent of the user's browser
 *         page_url:
 *           type: string
 *           nullable: true
 *           description: The URL of the page where the action occurred
 *         details:
 *           type: string
 *           nullable: true
 *           description: Additional details about the action
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: The time when the action started
 *         end_time:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The time when the action ended (if applicable)
 *         duration_seconds:
 *           type: integer
 *           description: The duration of the action in seconds
 */
@Entity()
export class AuditLog {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    user_id: number

    @Column()
    username: string

    @Column()
    fullname: string

    @Column({
        type: 'enum',
        enum: ActionType,
        default: ActionType.OTHER
    })
    action: ActionType

    @Column({ nullable: true })
    target_id: number

    @Column({ nullable: true })
    target_type: string

    @Column({ nullable: true })
    ip_address: string

    @Column({ nullable: true })
    user_agent: string

    @Column({ nullable: true })
    page_url: string
    
    @Column({ nullable: true, type: "text" })
    details: string

    @CreateDateColumn({ 
        type: "timestamp with time zone", 
        transformer: {
            to: (value: Date) => {
                // Convert to Vietnam timezone before saving
                if (value) {
                    const vietnamOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
                    return new Date(value.getTime() + vietnamOffset);
                }
                return value;
            },
            from: (value: Date) => value
        }
    })
    start_time: Date

    @Column({ 
        nullable: true, 
        type: "timestamp with time zone",
        transformer: {
            to: (value: Date) => {
                // Convert to Vietnam timezone before saving
                if (value) {
                    const vietnamOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
                    return new Date(value.getTime() + vietnamOffset);
                }
                return value;
            },
            from: (value: Date) => value
        }
    })
    end_time: Date

    @Column({ default: 0 })
    duration_seconds: number
} 