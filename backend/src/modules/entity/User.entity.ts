import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn } from "typeorm"

export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
}

@Entity({schema: "teaching"})
export class Users {

    @PrimaryGeneratedColumn()
    user_id: number

    @Column({type: "varchar", length: 50})
    username: string

    @Column({type: "varchar", length: 50})
    fullname: string

    @Column()
    password: string

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT
    })
    role: Role

    @Column({type: "varchar", length: 50})
    email: string

    @Column({type: "varchar", length: 100})
    profile_picture: string

    @Column({type: "varchar", length: 10})
    phone: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date
}
