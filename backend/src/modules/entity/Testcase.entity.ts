import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ExamContent } from "./ExamContent.entity";
import { ExamSubmissionContentDetails } from "./ExamSubmissionContentDetails.entity";

@Entity({schema: "teaching"})
export class TestCase {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: "varchar", length: 255, nullable: true})
    input: string;

    @Column({type: 'int', nullable: true})
    exam_content_id: number;

    @Column({type: "varchar", length: 255, nullable: true})
    expected_output: string;

    @Column({type: "float", nullable: true})
    score: number;
    
    @ManyToOne(() => ExamContent, examContent => examContent.testcases, { onDelete: 'CASCADE' })
    @JoinColumn({name: "exam_content_id"})
    examContent?: Relation<ExamContent>

    @OneToMany(() => ExamSubmissionContentDetails, examSubmissionContentDetails => examSubmissionContentDetails.testcase)
    examSubmissionContentDetails?: Relation<ExamSubmissionContentDetails>
}
