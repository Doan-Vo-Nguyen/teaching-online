import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Relation, JoinColumn } from "typeorm"
import { Users } from "./User.entity";
import { Assignments } from "./Assignments.entity";

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

    @ManyToOne(() => Users, user => user.submissions)
    student: Relation<Users>

    @ManyToOne(() => Assignments, assignments => assignments.submissions, { onDelete: 'NO ACTION' })
    @JoinColumn({name: "assignment_id"}) // Column name in the database
    assignment: Relation<Assignments>

    @ManyToOne(() => Users, user => user.submissions, { onDelete: 'NO ACTION' })
    @JoinColumn({name: "student_id"}) // Column name in the database
    studentSubmission: Relation<Users>
}