import { CommentDTO } from "../DTO/comment.dto";
import { ICommentRepository } from "../interfaces/comment.interface";
import { CommentRepository } from "../repositories/comment.repository";
import { ApiError } from "../types/ApiError";
import {
  CREATE_FAILED,
  FIELD_REQUIRED,
  NOT_FOUND,
} from "../DTO/resDto/BaseErrorDto";
import { BaseService } from "../abstracts/base-service";
import { cacheManager } from "../utils/cache-manager";
import { Logger } from "../config/logger";

class CommentService extends BaseService {
  private readonly commentRepository: ICommentRepository;
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'comment:';

  constructor(commentRepository: ICommentRepository = new CommentRepository()) {
    super();
    this.commentRepository = commentRepository;
  }

  /**
   * Get all comments with caching
   */
  public async getAllComments() {
    try {
      const cacheKey = `${this.CACHE_PREFIX}all`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => this.commentRepository.find({}),
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getAllComments');
    }
  }

  /**
   * Get a comment by ID with caching
   */
  public async getCommentById(comment_id: number) {
    try {
      this.validateRequired(comment_id, 'comment_id');
      
      const cacheKey = `${this.CACHE_PREFIX}${comment_id}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => {
          const comment = await this.commentRepository.findById(comment_id);
          this.validateExists(comment, 'comment');
          return comment;
        },
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getCommentById');
    }
  }

  /**
   * Create a new comment and invalidate relevant caches
   */
  public async createComment(commentData: Partial<CommentDTO>) {
    try {
      this.validateRequired(commentData, 'commentData');
      this.validateRequired(commentData.content, 'content');
      this.validateRequired(commentData.user_id, 'user_id');
      this.validateRequired(commentData.target_id, 'target_id');
      this.validateRequired(commentData.target_type, 'target_type');
      
      const newComment = await this.commentRepository.save(commentData as CommentDTO);
      if (!newComment) {
        throw new ApiError(
          400,
          CREATE_FAILED.error.message,
          CREATE_FAILED.error.details
        );
      }
      
      // Invalidate cache
      this.invalidateCache();
      
      return newComment;
    } catch (error) {
      this.handleError(error, 'createComment');
    }
  }

  /**
   * Update a comment and invalidate relevant caches
   */
  public async updateComment(id: number, commentData: Partial<CommentDTO>) {
    try {
      this.validateRequired(id, 'id');
      
      const existedComment = await this.commentRepository.findById(id);
      this.validateExists(existedComment, 'comment');
      
      const updatedComment = await this.commentRepository.update(id, commentData as CommentDTO);
      
      // Invalidate cache
      this.invalidateCache(id);
      
      return updatedComment;
    } catch (error) {
      this.handleError(error, 'updateComment');
    }
  }

  /**
   * Delete a comment and invalidate relevant caches
   */
  public async deleteComment(id: number) {
    try {
      this.validateRequired(id, 'id');
      
      const existedComment = await this.commentRepository.findById(id);
      this.validateExists(existedComment, 'comment');
      
      await this.commentRepository.delete(id);
      
      // Invalidate cache
      this.invalidateCache(id);
    } catch (error) {
      this.handleError(error, 'deleteComment');
    }
  }

  /**
   * Invalidate caches after write operations
   */
  private invalidateCache(id?: number) {
    try {
      // Remove the all comments cache
      cacheManager.delete(`${this.CACHE_PREFIX}all`);
      
      // If an ID is provided, also remove that specific cache
      if (id) {
        cacheManager.delete(`${this.CACHE_PREFIX}${id}`);
      }
      
      Logger.debug(`Cache invalidated for comments ${id ? `id:${id}` : 'all'}`);
    } catch (error) {
      Logger.error(`Failed to invalidate comment cache`);
    }
  }
}

export default CommentService;
