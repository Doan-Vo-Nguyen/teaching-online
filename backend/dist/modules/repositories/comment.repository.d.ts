import { ICommentRepository } from "../interfaces/comment.interface";
import { Comment } from "../entity/Comment.mongo";
export declare class CommentRepository implements ICommentRepository {
    private readonly repository;
    find(options: any): Promise<Comment[]>;
    findById(comment_id: number): Promise<Comment>;
    save(comment: Comment): Promise<Comment>;
}
