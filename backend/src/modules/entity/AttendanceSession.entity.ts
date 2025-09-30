import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Relation, Index } from "typeorm"
import { AttendanceSchedule } from "./AttendanceSchedule.entity"

@Entity({schema: "teaching"})
export class AttendanceSession {
    @PrimaryGeneratedColumn()
    session_id: number

    @Column()
    @Index()
    schedule_id: number

    @Column({type: "datetime"})
    start_at: Date

    @Column({type: "datetime"})
    end_at: Date

    @Column({type: "varchar", length: 50, nullable: true})
    room: string | null

    @Column({type: "enum", enum: ['planned','canceled','done'], default: 'planned'})
    status: 'planned' | 'canceled' | 'done'

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    @ManyToOne(() => AttendanceSchedule, sch => sch.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({name: "schedule_id"})
    schedule: Relation<AttendanceSchedule>
}


