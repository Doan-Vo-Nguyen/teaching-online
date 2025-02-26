import { CommentDTO } from "../DTO/comment.dto";
import { ICommentRepository } from "../interfaces/comment.interface";
import { CommentRepository } from "../repositories/comment.repository";
import { ApiError } from "../types/ApiError";
import {
  CREATE_FAILED,
  FIELD_REQUIRED,
  NOT_FOUND,
} from "../DTO/resDto/BaseErrorDto";

class CommentService {
  private readonly commentRepository: ICommentRepository =
    new CommentRepository();

  public async getAllComments() {
    return await this.commentRepository.find({});
  }

  public async getCommentById(comment_id: number) {
    if (!comment_id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const comment = await this.commentRepository.findById(comment_id);
    if (!comment) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    return comment;
  }

  public async createComment(commentData: CommentDTO) {
    if (!commentData) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const newComment = await this.commentRepository.save(commentData);
    if (!newComment) {
      throw new ApiError(
        400,
        CREATE_FAILED.error.message,
        CREATE_FAILED.error.details
      );
    }
    return newComment;
  }

  public async updateComment(id: number, commentData: CommentDTO) {
    if (!id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const existedComment = await this.commentRepository.findById(id);
    if (!existedComment) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    const updatedComment = await this.commentRepository.update(id, commentData);
    return updatedComment;
  }

  public async deleteComment(id: number) {
    if (!id) {
      throw new ApiError(
        400,
        FIELD_REQUIRED.error.message,
        FIELD_REQUIRED.error.details
      );
    }
    const existedComment = await this.commentRepository.findById(id);
    if (!existedComment) {
      throw new ApiError(404, NOT_FOUND.error.message, NOT_FOUND.error.details);
    }
    await this.commentRepository.delete(id);
  }
}

export default CommentService;
