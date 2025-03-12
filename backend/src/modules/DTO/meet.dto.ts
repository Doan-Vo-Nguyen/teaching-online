import {IsString, IsNotEmpty, IsNumber} from 'class-validator'

export class MeetDTO {
    id: number
    class_id: number
    room_name: string
    room_url: string
}

export class ExamSubmissionDTOPost {
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsNumber()
    @IsNotEmpty()
    class_id: number

    @IsString()
    room_name: string

    @IsString()
    room_url: string
}