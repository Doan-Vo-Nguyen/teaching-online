import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, OneToMany } from "typeorm"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Classes } from "./Classes.entity"
import { StudentClasses } from "./Student_classes.entity"
import { Role } from "../constant/index"

dotenv.config()

const JWT_KEY = process.env.JWT_KEY

@Entity({schema: "teaching"})
export class Users {

    @PrimaryGeneratedColumn()
    user_id: number

    @Column({type: "varchar", length: 50, nullable: true, unique: true})
    username: string

    @Column({type: "varchar", length: 50})
    fullname: string

    @Column({type: "datetime", nullable: true})
    dob: Date | null

    @Column({type: "varchar", length: 10, nullable: true})
    gender: string

    @Column()
    password: string

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STUDENT
    })
    role: Role

    @Column({type: "varchar", length: 50, nullable: true})
    address: string

    @Column({type: "varchar", length: 50, unique: true})
    email: string

    @Column({type: "varchar", length: 100, nullable: true})
    profile_picture: string

    @Column({type: "varchar", length: 10, nullable: true, unique: true})
    phone: string

    @Column({type: "char", length: 6, nullable: true})
    code: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    async comparePassHash(plainPass: string): Promise<boolean> {
        return await bcrypt.compare(plainPass, this.password)
    }

    @OneToMany(() => Classes, classes => classes.teacher) // Relation with Classes 1-n
    teachingClasses: Classes[]

    @OneToMany(() => StudentClasses, studentClasses => studentClasses.student) // Relation with StudentClasses 1-n
    studentClasses: StudentClasses[]

    async generateAuthToken(): Promise<string> {
        const token = jwt.sign(
            {
                id: this.user_id,
                username: this.username,
                fullname: this.fullname,
                role: this.role,
                email: this.email,
                profile_picture: this.profile_picture,
            },
            JWT_KEY,
        )
        return token;
    }
}
