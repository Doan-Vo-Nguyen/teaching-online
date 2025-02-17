import { AppDataSource2 } from "../../data-source";
import { Comment } from "../entity/Comment.mongo";
export class CommentRepository {
    repository = AppDataSource2.getRepository(Comment);
    async find(options) {
        return this.repository.find(options);
    }
    async findById(comment_id) {
        return this.repository.findOneBy({ comment_id });
    }
    async save(comment) {
        return this.repository.save(comment);
    }
}
//# sourceMappingURL=comment.repository.js.map