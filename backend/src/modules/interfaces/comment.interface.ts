import { Comment } from "../entity/Comment.mongo"
import { IBaseRepository } from "./base.interface"

export interface ICommentRepository extends IBaseRepository<Comment> {
    
}