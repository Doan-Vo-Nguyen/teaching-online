import { Entity, ObjectId, ObjectIdColumn, Column, CreateDateColumn } from "typeorm"

// Define Vietnam timezone offset
const VIETNAM_TIMEZONE = "+07:00";

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