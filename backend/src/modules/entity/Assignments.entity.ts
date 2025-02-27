import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Relation, JoinColumn, OneToMany } from "typeorm"
import { Classes } from "./Classes.entity"
import { Submissions } from "./Submission.entity"

@Entity({schema: "teaching"})
export class Assignments {
    @PrimaryGeneratedColumn()
    assignment_id: number

    @Column()
    class_id: number

    @Column({type: "varchar", length: 100})
    title: string

    @Column({type: "text", nullable: true})
    description: string

    @CreateDateColumn()
    due_date: Date

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    @ManyToOne(() => Classes, classes => classes.assignments) // Relation with Classes n-1
    @JoinColumn({name: "class_id"}) // Column name in the database
    class: Relation<Classes>

    @OneToMany(() => Submissions, submission => submission.assignment) // Relation with Submissions 1-n
    submissions: Submissions[]
}