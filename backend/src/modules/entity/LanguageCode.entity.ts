import { Entity, Column, PrimaryColumn, OneToMany, Relation, PrimaryGeneratedColumn } from "typeorm";
import { ExamContent } from "./ExamContent.entity";
import { ExamSubmissionContent } from "./Exam_Submission_Content.entity";

@Entity({schema: "teaching"})
export class LanguageCode {
    @PrimaryGeneratedColumn()
    language_id: number

    @Column({type: "varchar", length: 50})
    id: string

    @Column({type: "varchar", length: 255})
    name: string

    @Column({type: "varchar", length: 50, nullable: true})
    languageType: string

    @Column({type: "varchar", length: 255, nullable: true})
    supportedFlags: string

    @OneToMany(() => ExamContent, examContent => examContent.language)
    examContents: Relation<ExamContent>[]

    @OneToMany(() => ExamSubmissionContent, examSubmissionContent => examSubmissionContent.language)
    examSubmissionContents: Relation<ExamSubmissionContent>[]
}
