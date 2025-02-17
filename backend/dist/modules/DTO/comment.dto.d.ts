import { Type } from '../entity/Comment.mongo';
export declare class CommentDTO {
    user_id: number;
    target_id: number;
    target_type: Type;
    content: string;
    is_private: boolean;
    created_id: Date;
}
export declare class CommentDTOPost {
    user_id: number;
    target_id: number;
    content: string;
    is_private: number;
}
