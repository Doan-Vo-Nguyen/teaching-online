import { Request, Response, NextFunction } from 'express';
import { CommentDTO } from '../DTO/comment.dto';
import { ICommentRepository } from '../interfaces/comment.interface';
import { sendResponse } from '../../common/interfaces/base-response';
import { CommentRepository } from '../repositories/comment.repository';

class CommentService {
    private readonly commentRepository: ICommentRepository = new CommentRepository();

    public readonly getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const options: Partial<CommentDTO> = req.query;
            const comments = await this.commentRepository.find(options);
            return sendResponse(res, true, 200, "Get all comments successfully", comments);
        } catch (error) {
            next(error);
        }
    }

    public readonly getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment_id = parseInt(req.params.id, 10);
            const comment = await this.commentRepository.findById(comment_id);
            if (!comment) {
                return sendResponse(res, false, 404, "Comment not found", null);
            }
            return sendResponse(res, true, 200, "Get comment by id successfully", comment);
        } catch (error) {
            next(error);
        }
    }

    public readonly create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment: CommentDTO = req.body;
            const newComment = await this.commentRepository.save(comment);
            return sendResponse(res, true, 201, "Create comment successfully", newComment);
        } catch (error) {
            next(error);
        }
    }

    public readonly update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment_id = parseInt(req.params.id, 10);
            const comment: CommentDTO = req.body;
            await this.commentRepository.update(comment_id, comment);
            const updatedComment = await this.commentRepository.findById(comment_id);
            return sendResponse(res, true, 200, "Update comment successfully", updatedComment);
        } catch (error) {
            next(error);
        }
    }

    public readonly delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment_id = parseInt(req.params.id, 10);
            const comment = await this.commentRepository.findById(comment_id);
            if (!comment) {
                return sendResponse(res, false, 404, "Comment not found", null);
            }
            await this.commentRepository.delete(comment_id);
            return sendResponse(res, true, 200, "Delete comment successfully", comment);
        } catch (error) {
            next(error);
        }
    }
}

export default CommentService;