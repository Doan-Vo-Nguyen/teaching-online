import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Exam } from "./Exam.entity";
import { TestCase } from "./Testcase.entity";

@Entity({schema: "teaching"})
export class ExamContent {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    exam_id: number

    @Column({type: "text", nullable: true})
    title: string

    @Column({type: "text", nullable: true})
    description: string

    @CreateDateColumn()
    created_at: Date

    @ManyToOne(() => Exam, exam => exam.examContents, { onDelete: 'NO ACTION' }) // Relation with Exam n-1
    @JoinColumn({name: "exam_id"}) // Column name in the database
    exam: Relation<Exam>

    @OneToMany(() => TestCase, testcase => testcase.examContent)
    testcases: TestCase[]
}