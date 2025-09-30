import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Relation, Index, Unique } from "typeorm"
import { AttendanceSession } from "./AttendanceSession.entity"
import { Users } from "./User.entity"

@Entity({schema: "teaching"})
@Unique(["session_id", "student_id"])
export class AttendanceRecord {
    @PrimaryGeneratedColumn()
    attendance_id: number

    @Column()
    @Index()
    session_id: number

    @Column()
    student_id: number

    @Column({type: "datetime", nullable: true})
    check_in_at: Date | null

    @Column({type: "datetime", nullable: true})
    check_out_at: Date | null

    @Column({type: "enum", enum: ['present', 'late', 'absent', 'excused'], default: 'present'})
    status: 'present' | 'late' | 'absent' | 'excused'

    @Column({type: "varchar", length: 255, nullable: true})
    note: string | null

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    @ManyToOne(() => AttendanceSession, { onDelete: 'CASCADE' })
    @JoinColumn({name: "session_id"})
    session: Relation<AttendanceSession>

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({name: "student_id"})
    student: Relation<Users>
}


