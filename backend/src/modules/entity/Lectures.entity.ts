import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

export enum LectureType {
    DOCUMENTS = 'documents',
    VIDEOS = 'videos',
}

@Entity({schema: "teaching"})
export class Lectures {
    @PrimaryGeneratedColumn()
    lecture_id: number

    @Column()
    class_id: number

    @Column({type: "varchar", length: 100})
    title: string

    @Column({
        type: 'enum',
        enum: LectureType,
    })
    type: LectureType

    @Column({type: "text", nullable: true})
    content: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date
}