import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn } from "typeorm"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_KEY = process.env.JWT_KEY

export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
}

@Entity({schema: "teaching"})
export class Users {

    @PrimaryGeneratedColumn()
    user_id: number

    @Column({type: "varchar", length: 50, nullable: true})
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

    @Column({type: "varchar", length: 50})
    email: string

    @Column({type: "varchar", length: 100, nullable: true})
    profile_picture: string

    @Column({type: "varchar", length: 10, nullable: true})
    phone: string

    @CreateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    async comparePassHash(plainPass: string): Promise<boolean> {
        return await bcrypt.compare(plainPass, this.password)
    }

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
