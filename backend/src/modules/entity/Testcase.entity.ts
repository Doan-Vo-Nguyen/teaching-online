import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ExamContent } from "./ExamContent.entity";

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
    
    @ManyToOne(() => ExamContent, examContent => examContent.testcases, { onDelete: 'NO ACTION' })
    @JoinColumn({name: "exam_content_id"})
    examContent?: Relation<ExamContent>
}
