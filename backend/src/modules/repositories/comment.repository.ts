import { AppDataSource2 } from "../../data-source";
import { ICommentRepository } from "../interfaces/comment.interface";
import { Comment } from "../entity/Comment.mongo";
import { CommentDTO } from "../DTO/comment.dto";

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

    async update(comment_id: number, comment: CommentDTO): Promise<Comment> {
        await this.repository.update(comment_id, comment);
        return this.repository.findOneBy({comment_id});
    }

    async delete(comment_id: number): Promise<Comment> {
        const comment = await this.repository.findOneBy({ comment_id });
        await this.repository.delete(comment);
        return comment;
    }
}