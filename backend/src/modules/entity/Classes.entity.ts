import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"
import { Users } from "./User.entity"
import { StudentClasses } from "./Student_classes.entity"
import { Lectures } from "./Lectures.entity"
import { Assignments } from "./Assignments.entity"
import { Exam } from "./Exam.entity"
@Entity({schema: "teaching"})
export class Classes {
    @PrimaryGeneratedColumn()
    class_id: number

    @Column({type: "varchar", length: 100})
    class_name: string

    @Column({type: "text", nullable: true})
    description: string

    @Column({type: "char", length: 7})
    class_code: string

    @Column()
    teacher_id: number

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    @ManyToOne(() => Users, user => user.teachingClasses, { onDelete: 'NO ACTION' }) // Relation with Users n-1
    @JoinColumn({name: "teacher_id"}) // Column name in the database
    teacher: Relation<Users>

    @OneToMany(() => StudentClasses, studentClasses => studentClasses.class) // Relation with StudentClasses 1-n
    studentClasses: StudentClasses[]

    @OneToMany(() => Lectures, lecture => lecture.class) // Relation with Lectures 1-n
    lectures: Lectures[]

    @OneToMany(() => Assignments, assignment => assignment.class) // Relation with Assignments 1-n
    assignments: Assignments[]

    @OneToMany(() => Exam, exam => exam.class) // Relation with Exam 1-n
    exams: Exam[]
}