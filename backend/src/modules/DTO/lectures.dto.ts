import {IsString, IsNotEmpty, IsNumber} from 'class-validator'

export class LectureDTO {
    lecture_id: number
    class_id: number
    title: string
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