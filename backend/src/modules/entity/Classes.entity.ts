import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({schema: "teaching"})
export class Classes {
    @PrimaryGeneratedColumn()
    class_id: number

    @Column({type: "varchar", length: 100})
    class_name: string

    @Column({type: "text"})
    description: string

    @Column({type: "char", length: 7})
    class_code: string

    @Column()
    teacher_id: number

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date
}