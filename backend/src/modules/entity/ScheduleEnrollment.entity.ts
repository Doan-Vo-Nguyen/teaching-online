import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Relation, Index, Unique } from "typeorm"
import { AttendanceSchedule } from "./AttendanceSchedule.entity"
import { Users } from "./User.entity"

@Entity({schema: "teaching"})
@Unique(["schedule_id", "student_id"])
export class ScheduleEnrollment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index()
    schedule_id: number

    @Column()
    @Index()
    student_id: number

    @CreateDateColumn()
    enrolled_at: Date

    @ManyToOne(() => AttendanceSchedule, { onDelete: 'CASCADE' })
    @JoinColumn({name: "schedule_id"})
    schedule: Relation<AttendanceSchedule>

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({name: "student_id"})
    student: Relation<Users>
}


