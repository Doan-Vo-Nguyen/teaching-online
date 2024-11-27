import {IsString, IsNotEmpty, IsNumber, Min, Max} from 'class-validator'
import { Type } from '../entity/Comment.mongo'

export class CommentDTO {
    user_id: number
    target_id: number
    target_type: Type
    content: string
    is_private: boolean
    created_id: Date
}

export class CommentDTOPost {
    @IsNumber()
    @IsNotEmpty()
    user_id: number

    @IsNumber()
    @IsNotEmpty()
    target_id: number

    @IsString()
    @IsNotEmpty()
    content: string

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(1)
    is_private: number
}