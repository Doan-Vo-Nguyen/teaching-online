import {IsString, IsNotEmpty, IsNumber} from 'class-validator'

export class SubmissionDTO {
    submission_id: number
    assignment_id: number
    student_id: number
    file_content: string
    submitted_at: Date
    grade: number
    feed_back: string
}

export class SubmissionDTOPost {
    @IsNumber()
    @IsNotEmpty()
    assignment_id: number

    @IsNumber()
    @IsNotEmpty()
    student_id: number

    @IsString()
    @IsNotEmpty()
    file_content: string
}