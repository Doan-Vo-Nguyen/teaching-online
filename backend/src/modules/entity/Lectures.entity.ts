import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Relation, JoinColumn, OneToMany } from "typeorm"
import { Classes } from "./Classes.entity"
import { LecturesContent } from "./LecturesContent.entity"

@Entity({schema: "teaching"})
export class Lectures {
    @PrimaryGeneratedColumn()
    lecture_id: number

    @Column()
    class_id: number

    @Column({type: "varchar", length: 100})
    title: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    @ManyToOne(() => Classes, classes => classes.lectures, { onDelete: 'NO ACTION' }) // Relation with Classes n-1
    @JoinColumn({name: "class_id"}) // Column name in the database
    class?: Relation<Classes>

    @OneToMany(() => LecturesContent, lecturesFile => lecturesFile.lecture) // Relation with LecturesFile 1-n
    lecturesFiles?: LecturesContent[]
}