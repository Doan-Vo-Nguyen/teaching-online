import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Relation, OneToMany, JoinColumn } from "typeorm"
import { Classes } from "./Classes.entity"
import { ExamSubmission } from "./Exam_submission.entity"
import { ExamContent } from "./ExamContent.entity"
import { ExamType, ExamTypeForStudent } from "../constant/index"

@Entity({schema: "teaching"})
export class Exam {
    @PrimaryGeneratedColumn()
    exam_id: number

    @Column()
    class_id: number

    @Column({type: "varchar", length: 100, nullable: true})
    title: string

    @Column({type: "text", nullable: true})
    description: string

    @Column({type: "enum", enum: ExamType, nullable: true})
    type: ExamType

    @Column({type: "enum", enum: ExamTypeForStudent, nullable: true})
    type_for_student: ExamTypeForStudent

    @Column()
    due_date: Date

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    @ManyToOne(() => Classes, classes => classes.exams, { onDelete: 'NO ACTION' }) // Relation with Classes n-1
    @JoinColumn({name: "class_id"}) // Column name in the database
    class: Relation<Classes>

    @OneToMany(() => ExamSubmission, examSubmission => examSubmission.exam) // Relation with ExamSubmission 1-n
    examSubmissions: ExamSubmission[]

    @OneToMany(() => ExamContent , examContent => examContent.exam) // Relation with ExamContent 1-n
    examContents: ExamContent[]
    teacher_id: number
}