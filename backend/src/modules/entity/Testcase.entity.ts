import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { ExamContent } from "./ExamContent.entity";

@Entity({schema: "teaching"})
export class TestCase {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: "varchar", length: 255})
    input: string;

    @Column({type: "varchar", length: 255})
    expected_output: string;

    @Column({type: "float"})
    score: number;
    
    @OneToMany(() => ExamContent, examContent => examContent.testcases)
    examContent: Relation<ExamContent>;
}
