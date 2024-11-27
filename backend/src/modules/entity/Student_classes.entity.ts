import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

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
}