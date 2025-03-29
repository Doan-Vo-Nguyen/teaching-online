import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ExamContent } from "./ExamContent.entity";
import { TestCase } from "./Testcase.entity";

@Entity({schema: "teaching"})
export class ExamContentDetails {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    exam_content_id: number

    @Column({type: "text", nullable: true})
    content: string

    @CreateDateColumn()
    created_at: Date

    @OneToMany(() => TestCase, testcase => testcase.examContentDetails)
    testcases: TestCase

    @ManyToOne(() => ExamContent, examContent => examContent.examContentDetails, { onDelete: 'NO ACTION' }) // Relation with Exam n-1
    @JoinColumn({name: "exam_content_id"}) // Column name in the database
    examContent: Relation<ExamContent>
}