import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({schema: "teaching"})
export class ExamSubmission {
    @PrimaryGeneratedColumn()
    exam_submission_id: number

    @Column({type: "int"})
    exam_id: number

    @Column({type: "int"})
    student_id: number

    @Column({type: "text"})
    file_content: string

    @CreateDateColumn()
    submitted_at: Date

    @Column({type: "decimal", precision: 5, scale: 2})
    grade: number

    @Column({type: "text"})
    feed_back: string
}