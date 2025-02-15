import { Role } from './../entity/User.entity';
import {IsString, IsNotEmpty} from 'class-validator'


export class UserDTO {
    user_id: number
    username: string
    fullname: string
    gender: string
    password: string
    role: Role
    address: string
    email: string
    profile_picture: string
    phone: string
    created_at: Date
    updated_at: Date
}

export class UserDTOPost {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    role: Role
}