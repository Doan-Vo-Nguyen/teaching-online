import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Relation } from "typeorm"
import { Exam } from "./Exam.entity"
import { StudentClasses } from "./Student_classes.entity"

@Entity({schema: "teaching"})
export class ExamSubmission {
    @PrimaryGeneratedColumn()
    exam_submission_id: number

    @Column({type: "int"})
    exam_id: number

    @Column({type: "int"})
    student_class_id: number

    @Column({type: "text", nullable: true})
    file_content: string

    @CreateDateColumn()
    submitted_at: Date

    @CreateDateColumn()
    updated_at: Date

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true})
    grade: number

    @Column({type: "text", nullable: true})
    feed_back: string

    @ManyToOne(() => Exam, exam => exam.examSubmissions, { onDelete: 'NO ACTION' }) // Relation with Users n-1
    @JoinColumn({name: "exam_id"}) // Column name in the database
    exam: Relation<Exam>

    @ManyToOne(() => StudentClasses, studentClasses => studentClasses.examSubmissions, { onDelete: 'NO ACTION' }) // Relation with Users n-1
    @JoinColumn({name: "student_class_id"}) // Column name in the database
    studentClass: Relation<StudentClasses>
    student_id?: number
    class_id?: number

}