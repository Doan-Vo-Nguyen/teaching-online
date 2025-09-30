import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Relation } from "typeorm"
import { AttendanceSession } from "./AttendanceSession.entity"

@Entity({schema: "teaching"})
export class AttendanceSchedule {
    @PrimaryGeneratedColumn()
    schedule_id: number

    @Column()
    class_signature: string

    @Column({type: "varchar", length: 100, nullable: true})
    name: string | null

    @Column({type: "varchar", length: 50, nullable: true})
    room: string | null

    @Column({type: "int", nullable: true})
    capacity: number | null

    @Column({type: "int", nullable: true})
    teacher_id: number | null

    @Column({type: "text", nullable: true})
    note: string | null

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    @OneToMany(() => AttendanceSession, ses => ses.schedule)
    sessions: AttendanceSession[]
}


