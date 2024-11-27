
import { sendResponse } from "../../../src/common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import { CommentRepository } from "../repositories/comment.repository";
import CommentService from "../services/comment.service";
import { NextFunction, Request, Response } from "express";

export class CommentController extends BaseController {
    private readonly _service: CommentService;

    constructor(path: string) {
        super(path);
        const commentRepository = new CommentRepository();
        this._service = new CommentService(commentRepository);
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this.getAll);
    }

    private readonly getAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const listComment = await this._service.getAll();
        return sendResponse(res, true, 200, "Get all comment successfully", listComment);
    }
}