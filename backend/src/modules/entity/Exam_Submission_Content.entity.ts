import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ExamSubmission } from "./Exam_submission.entity";

@Entity({schema: "teaching"})
export class ExamSubmissionContent {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    exam_submission_id: number

    @Column({type: "text", nullable: true})
    file_content: string
    
    @CreateDateColumn()
    created_at: Date

    @ManyToOne(() => ExamSubmission, examSubmission => examSubmission.examSubmissionContents, { onDelete: 'CASCADE', nullable: true }) // Relation with ExamSubmission n-1
    @JoinColumn({name: "exam_submission_id"}) // Column name in the database
    examSubmission?: Relation<ExamSubmission>
}