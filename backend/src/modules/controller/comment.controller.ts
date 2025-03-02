import { Request, Response, NextFunction } from 'express';
import BaseController from "../abstracts/base-controller";
import CommentService from "../services/comment.service";
import { sendResponse } from '../../common/interfaces/base-response';
import { validParam } from "../middleware/validate/field.validate";
import { authorAdmin } from "../middleware/auth.middleware";

export class CommentController extends BaseController {
    private readonly commentService: CommentService;

    constructor(path: string) {
        super(path);
        this.commentService = new CommentService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this.getAllComments);
        this.router.get('/:id', validParam("id"), this.getCommentById);
        this.router.post('/', authorAdmin, this.createComment);
        this.router.patch('/:id', validParam("id"), this.updateComment);
        this.router.delete('/:id', validParam("id"), this.deleteComment);
    }

    private readonly getAllComments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await this.commentService.getAllComments();
            return sendResponse(res, true, 200, "Get all comments successfully", comments);
        } catch (error) {
            next(error);
        }
    }

    private readonly getCommentById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const commentId = parseInt(req.params.id, 10);
            const commentData = await this.commentService.getCommentById(commentId);
            return sendResponse(res, true, 200, "Get comment by id successfully", commentData);
        } catch (error) {
            next(error);
        }
    }

    private readonly createComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newComment = await this.commentService.createComment(req.body);
            return sendResponse(res, true, 200, "Create comment successfully", newComment);
        } catch (error) {
            next(error);
        }
    }

    private readonly updateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const commentId = parseInt(req.params.id, 10);
            const updatedComment = await this.commentService.updateComment(commentId, req.body);
            return sendResponse(res, true, 200, "Update comment successfully", updatedComment);
        } catch (error) {
            next(error);
        }
    }

    private readonly deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const commentId = parseInt(req.params.id, 10);
            const result = await this.commentService.deleteComment(commentId);
            return sendResponse(res, true, 200, "Delete comment successfully", result);
        } catch (error) {
            next(error);
        }
    }
}