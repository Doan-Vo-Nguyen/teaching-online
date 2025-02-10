import { CommentDTO } from '../DTO/comment.dto';
import { ICommentRepository } from '../interfaces/comment.interface';

class CommentService {
    private readonly commentRepository: ICommentRepository;

    constructor(commentRepository: ICommentRepository) {
        this.commentRepository = commentRepository;
    }

    async getAll(): Promise<CommentDTO[]> {
        try {
            const listComment = await this.commentRepository.find({
                select: ['user_id', 'target_id', 'target_type', 'content'],
            });
            return listComment;
        } catch (error) {
            throw new Error('Error fetching comments');
        }
    }

    async getById(comment_id: number): Promise<CommentDTO> {
        try {
            const comment = await this.commentRepository.findById(comment_id);
            return comment;
        } catch (error) {
            throw new Error('Error fetching comment');
        }
    }
}

export default CommentService;