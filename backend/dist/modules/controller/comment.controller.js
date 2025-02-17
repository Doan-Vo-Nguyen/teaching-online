import { sendResponse } from "../../../src/common/interfaces/base-response.js";
import BaseController from "../abstracts/base-controller.js";
import { CommentRepository } from "../repositories/comment.repository.js";
import CommentService from "../services/comment.service.js";
export class CommentController extends BaseController {
    _service;
    constructor(path) {
        super(path);
        const commentRepository = new CommentRepository();
        this._service = new CommentService(commentRepository);
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/', this.getAll);
    }
    getAll = async (req, res, next) => {
        const listComment = await this._service.getAll();
        return sendResponse(res, true, 200, "Get all comment successfully", listComment);
    };
}
//# sourceMappingURL=comment.controller.js.map