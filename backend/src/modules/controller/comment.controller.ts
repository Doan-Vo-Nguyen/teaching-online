
import { sendResponse } from "../../../src/common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import { CommentRepository } from "../repositories/comment.repository";
import CommentService from "../services/comment.service";
import { NextFunction, Request, Response } from "express";

export class CommentController extends BaseController {
    private readonly _service: CommentService;

    constructor(path: string) {
        super(path);
        this._service = new CommentService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this._service.getAll);
    }
}