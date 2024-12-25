import { AppDataSource2 } from "../../data-source";
import { ICommentRepository } from "../interfaces/comment.interface";
import { Comment } from "../entity/Comment.mongo";

export class CommentRepository implements ICommentRepository {
    private readonly repository = AppDataSource2.getRepository(Comment);

    async find(options: any): Promise<Comment[]> {
        return this.repository.find(options);
    }

    async findById(comment_id: number): Promise<Comment> {
        return this.repository.findOneBy({ comment_id });
    }

    async save(comment: Comment): Promise<Comment> {
        return this.repository.save(comment);
    }
}