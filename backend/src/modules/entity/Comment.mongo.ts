import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

export enum Type {
    LECTURE = 'lecture',
    ASSIGNMENT = 'assignment',
    MEETING = 'meeting'
}

@Entity()
export class Comment {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    comment_id: number

    @Column()
    user_id: number

    @Column()
    target_id: number

    @Column({
        type: 'enum',
        enum: Type,
        default: Type.LECTURE
    })
    target_type: Type

    @Column({type: "text"})
    content: string

    @Column()
    is_private: boolean

    @Column()
    created_id: Date
}