import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({schema: "teaching"})
export class Lectures {
    @PrimaryGeneratedColumn()
    lecture_id: number

    @Column()
    class_id: number

    @Column({type: "varchar", length: 100})
    title: string

    @Column({type: "text"})
    content: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date
}