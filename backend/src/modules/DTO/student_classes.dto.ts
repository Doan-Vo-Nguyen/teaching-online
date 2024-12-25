import {IsNotEmpty, IsNumber} from 'class-validator'

export class StudentClassesDTO {
    student_class_id: number
    student_id: number
    class_id: number
    enrollDate: Date
}

export class StudentClassesDTOPost {
    @IsNumber()
    @IsNotEmpty()
    student_id: number

    @IsNumber()
    @IsNotEmpty()
    class_id: number
}