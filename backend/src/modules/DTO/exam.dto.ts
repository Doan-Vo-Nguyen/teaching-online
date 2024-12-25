import {IsString, IsNotEmpty, IsNumber} from 'class-validator'

export class ExamDTO {
    exam_id: number
    class_id: number
    title: string
    description: string
    due_date: Date
    created_id: Date
    updated_at: Date
}

export class ExamDTOPost {
    @IsNumber()
    @IsNotEmpty()
    class_id: number

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    due_date: Date
}