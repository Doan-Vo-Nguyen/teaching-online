import { ObjectId } from "typeorm";
export declare enum Type {
    LECTURE = "lecture",
    ASSIGNMENT = "assignment",
    MEETING = "meeting"
}
export declare class Comment {
    id: ObjectId;
    comment_id: number;
    user_id: number;
    target_id: number;
    target_type: Type;
    content: string;
    is_private: boolean;
    created_id: Date;
}
