import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({schema: "teaching"})
export class Assignments {
    @PrimaryGeneratedColumn()
    assignment_id: number

    @Column()
    class_id: number

    @Column({type: "varchar", length: 100})
    title: string

    @Column({type: "text"})
    description: string

    @CreateDateColumn()
    due_date: Date

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date
}