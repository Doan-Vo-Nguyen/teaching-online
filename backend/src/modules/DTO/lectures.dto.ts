import {IsString, IsNotEmpty, IsNumber} from 'class-validator'
import { LectureType } from '../entity/Lectures.entity'

export class LecturesDTO {
    lecture_id: number
    class_id: number
    title: string
    type: LectureType
    content: string
    created_at: Date
    updated_at: Date
}

export class LectureDTOPost {
    @IsNumber()
    @IsNotEmpty()
    class_id: number

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    content: string
}