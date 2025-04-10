import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { ExamSubmissionContent } from "./Exam_Submission_Content.entity"
import { TestCase } from "./Testcase.entity"
import { ExamContent } from "./ExamContent.entity" 
@Entity({schema: "teaching"})
export class ExamSubmissionContentDetails {
    @PrimaryGeneratedColumn({name: "exam_submission_content_details_id"})
    exam_submission_content_details_id: number

    @Column({type: "int"})
    exam_submission_content_id: number

    @Column({type: "int"})
    exam_content_id: number
    @Column({type: "int"})
    testcase_id: number

    @CreateDateColumn()
    submitted_at: Date

    @CreateDateColumn()
    updated_at: Date

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true})
    score: number

    @Column({type: "text", nullable: true})
    status: string

    @Column({type: "text", nullable: true})
    output: string

    @Column({type: "text", nullable: true})
    error: string

    @ManyToOne(() => ExamSubmissionContent, examSubmissionContent => examSubmissionContent.examSubmissionContentDetails, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({name: "exam_submission_content_id"})
    examSubmissionContent?: Relation<ExamSubmissionContent>

    @ManyToOne(() => TestCase, testcase => testcase.examSubmissionContentDetails, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({name: "testcase_id"})
    testcase?: Relation<TestCase>

    @ManyToOne(() => ExamContent, examContent => examContent.examSubmissionContentDetails, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({name: "exam_content_id"})
    examContent?: Relation<ExamContent>
}