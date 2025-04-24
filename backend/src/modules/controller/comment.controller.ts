import { Request, Response, NextFunction } from 'express';
import BaseController from "../abstracts/base-controller";
import CommentService from "../services/comment.service";
import { validParam } from "../middleware/validate/field.validate";
import { authorAdmin } from "../middleware/auth.middleware";
import { validateDto, validatePartialDto } from '../utils/dto-validator';
import { CommentDTO, CommentDTOPost, CommentDTOUpdate } from '../DTO/comment.dto';

export class CommentController extends BaseController {
    private readonly commentService: CommentService;

    constructor(path: string, commentService?: CommentService) {
        super(path);
        this.commentService = commentService || new CommentService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this.asyncHandler(this.getAllComments));
        this.router.get('/:id', validParam("id"), this.asyncHandler(this.getCommentById));
        this.router.post('/', authorAdmin, this.asyncHandler(this.createComment));
        this.router.patch('/:id', validParam("id"), this.asyncHandler(this.updateComment));
        this.router.delete('/:id', validParam("id"), this.asyncHandler(this.deleteComment));
    }

    private readonly getAllComments = async (req: Request, res: Response) => {
        const comments = await this.commentService.getAllComments();
        return this.sendSuccess(res, 200, "Get all comments successfully", comments);
    }

    private readonly getCommentById = async (req: Request, res: Response) => {
        const commentId = this.parseId(req.params.id);
        const commentData = await this.commentService.getCommentById(commentId);
        return this.sendSuccess(res, 200, "Get comment by id successfully", commentData);
    }

    private readonly createComment = async (req: Request, res: Response) => {
        // Validate the input data against CommentDTOPost
        const validatedData = await validateDto(CommentDTOPost, req.body);
        
        // Create a new object for CommentDTO
        const commentDTO: Partial<CommentDTO> = {
            user_id: validatedData.user_id,
            target_id: validatedData.target_id,
            content: validatedData.content,
            // Convert numeric is_private to boolean
            is_private: Boolean(validatedData.is_private),
            // Add additional required fields
            target_type: req.body.target_type, // Must be provided in request
            created_at: new Date()
        };
        
        const newComment = await this.commentService.createComment(commentDTO);
        return this.sendSuccess(res, 201, "Create comment successfully", newComment);
    }

    private readonly updateComment = async (req: Request, res: Response) => {
        const commentId = this.parseId(req.params.id);
        
        // Validate the update data
        const validatedData = await validatePartialDto(CommentDTOUpdate, req.body);
        
        // Create a partial update object
        const updateData: Partial<CommentDTO> = {};
        
        if (validatedData.content !== undefined) {
            updateData.content = validatedData.content;
        }
        
        if (validatedData.is_private !== undefined) {
            updateData.is_private = Boolean(validatedData.is_private);
        }
        
        const updatedComment = await this.commentService.updateComment(commentId, updateData);
        return this.sendSuccess(res, 200, "Update comment successfully", updatedComment);
    }

    private readonly deleteComment = async (req: Request, res: Response) => {
        const commentId = this.parseId(req.params.id);
        await this.commentService.deleteComment(commentId);
        return this.sendSuccess(res, 200, "Delete comment successfully", null);
    }
}