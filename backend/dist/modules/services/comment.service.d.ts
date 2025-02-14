import { CommentDTO } from '../DTO/comment.dto';
import { ICommentRepository } from '../interfaces/comment.interface';
declare class CommentService {
    private readonly commentRepository;
    constructor(commentRepository: ICommentRepository);
    getAll(): Promise<CommentDTO[]>;
    getById(comment_id: number): Promise<CommentDTO>;
}
export default CommentService;
