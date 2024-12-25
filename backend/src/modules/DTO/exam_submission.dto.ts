import {IsString, IsNotEmpty, IsNumber} from 'class-validator'

export class ExamSubmissionDTO {
    exam_submission_id: number
    exam_id: number
    student_class_id: number
    file_content: string
    submitted_at: Date
    grade: number
    feed_back: string
}

export class ExamSubmissionDTOPost {
    @IsNumber()
    @IsNotEmpty()
    exam_id: number

    @IsNumber()
    @IsNotEmpty()
    student_class_id: number

    @IsString()
    @IsNotEmpty()
    file_content: string

    @IsNumber()
    @IsNotEmpty()
    grade: number

    @IsString()
    feed_back: string
}