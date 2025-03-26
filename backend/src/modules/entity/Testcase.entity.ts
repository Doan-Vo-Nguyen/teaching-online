import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ExamContent } from "./ExamContent.entity";

@Entity({schema: "teaching"})
export class TestCase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "int"})
    exam_content_id: number;
    
    @Column({type: "varchar", length: 255})
    input: string;

    @Column({type: "varchar", length: 255})
    expected_output: string;
    
    @ManyToOne(() => ExamContent, examContent => examContent.testCases)
    examContent: Relation<ExamContent>;
}
