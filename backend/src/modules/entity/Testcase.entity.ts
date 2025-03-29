import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ExamContentDetails } from "./ExamContentDetails.entity";

@Entity({schema: "teaching"})
export class TestCase {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: "varchar", length: 255, nullable: true})
    input: string;

    @Column({type: 'int', nullable: true})
    exam_content_details_id: number;

    @Column({type: "varchar", length: 255, nullable: true})
    expected_output: string;

    @Column({type: "float", nullable: true})
    score: number;
    
    @ManyToOne(() => ExamContentDetails, examContentDetails => examContentDetails.testcases, { onDelete: 'NO ACTION' })
    @JoinColumn({name: "exam_content_details_id"})
    examContentDetails?: Relation<ExamContentDetails>
}
