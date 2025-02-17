import { Comment } from "../entity/Comment.mongo";
export interface ICommentRepository {
    find(options: any): Promise<Comment[]>;
    findById(id: number): Promise<Comment>;
    save(comment: Comment): Promise<Comment>;
}
