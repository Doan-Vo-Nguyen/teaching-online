import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Relation, JoinColumn, OneToMany } from "typeorm"
import { Users } from "./User.entity"
import { Classes } from "./Classes.entity"
import { ExamSubmission } from "./Exam_submission.entity"

@Entity({schema: "teaching"})
export class StudentClasses {
    @PrimaryGeneratedColumn()
    student_class_id: number

    @Column()
    student_id: number

    @Column()
    class_id: number

    @CreateDateColumn()
    enrollDate: Date

    @ManyToOne(() => Users, user => user.studentClasses) // Relation with Users n-1
    @JoinColumn({name: "student_id"}) // Column name in the database
    student: Relation<Users>

    @ManyToOne(() => Classes, cls => cls.studentClasses) // Relation with Classes n-1
    @JoinColumn({name: "class_id"}) // Column name in the database
    class: Relation<Classes>

    @OneToMany(() => ExamSubmission, examSubmission => examSubmission.studentClass) // Relation with ExamSubmission 1-n
    examSubmissions: ExamSubmission[]
}