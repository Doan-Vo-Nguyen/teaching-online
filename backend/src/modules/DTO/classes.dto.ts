import {IsString, IsNotEmpty, IsNumber} from 'class-validator'

export class ClassDTO {
    class_id: number
    class_name: string
    description: string
    teacher_id: number
    created_id: Date
}

export class ClassDTOPost {
    @IsString()
    @IsNotEmpty()
    class_name: string

    @IsString()
    description: string

    @IsNumber()
    @IsNotEmpty()
    teacher_id: number
}