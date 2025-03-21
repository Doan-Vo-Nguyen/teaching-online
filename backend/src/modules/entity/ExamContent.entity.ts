import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Exam } from "./Exam.entity";

@Entity({schema: "teaching"})
export class ExamContent {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    exam_id: number

    @Column({type: "varchar", length: 500})
    content: string

    @CreateDateColumn()
    created_at: Date

    @ManyToOne(() => Exam, exam => exam.examContents, { onDelete: 'NO ACTION' }) // Relation with Exam n-1
    @JoinColumn({name: "exam_id"}) // Column name in the database
    exam: Relation<Exam>
}