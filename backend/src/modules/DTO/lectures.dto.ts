import {IsString, IsNotEmpty, IsNumber} from 'class-validator'
import { LectureType } from '../constant/index'

export class LecturesDTO {
    lecture_id: number
    class_id: number
    title: string
    description: string
    type: LectureType
    content: string
    created_at: Date
    updated_at: Date
    class?: any
    lecturesFiles?: any
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