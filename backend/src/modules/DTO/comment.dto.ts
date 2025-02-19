import {IsString, IsNotEmpty, IsNumber, Min, Max} from 'class-validator'
import { Type } from '../entity/Comment.mongo'
import { ObjectId } from 'typeorm'

export class CommentDTO {
    id: ObjectId
    comment_id: number
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