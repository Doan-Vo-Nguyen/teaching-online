import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({schema: "teaching"})
export class Submissions {
    @PrimaryGeneratedColumn()
    submission_id: number

    @Column()
    assignment_id: number

    @Column()
    student_id: number

    @Column({type: "text"})
    file_content: string;

    @CreateDateColumn()
    submitted_at: Date

    @Column({type: "decimal", precision: 5, scale: 2})
    grade: number

    @Column({type: "text"})
    feedback: string
}