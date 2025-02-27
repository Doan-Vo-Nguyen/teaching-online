import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Relation, JoinColumn } from "typeorm"
import { Classes } from "./Classes.entity"

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

    @ManyToOne(() => Classes, classes => classes.lectures, { onDelete: 'NO ACTION' }) // Relation with Classes n-1
    @JoinColumn({name: "class_id"}) // Column name in the database
    class: Relation<Classes>
}