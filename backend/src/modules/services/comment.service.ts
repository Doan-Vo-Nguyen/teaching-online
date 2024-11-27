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
}

export default CommentService;