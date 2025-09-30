import {IsString, IsNotEmpty, IsNumber} from 'class-validator'

export class ClassesDTO {
    class_id: number
    class_name: string
    description: string
    class_code: string
    teacher: any
    teacher_id: number
    class_signature: string
    created_at: Date
    updated_at: Date
}

export class ClassesDTOPost {
    @IsString()
    @IsNotEmpty()
    class_name: string

    @IsString()
    description: string

    @IsNumber()
    @IsNotEmpty()
    teacher_id: number

    @IsString()
    class_signature: string
}