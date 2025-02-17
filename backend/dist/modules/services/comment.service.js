class CommentService {
    commentRepository;
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async getAll() {
        try {
            const listComment = await this.commentRepository.find({
                select: ['user_id', 'target_id', 'target_type', 'content'],
            });
            return listComment;
        }
        catch (error) {
            throw new Error('Error fetching comments');
        }
    }
    async getById(comment_id) {
        try {
            const comment = await this.commentRepository.findById(comment_id);
            return comment;
        }
        catch (error) {
            throw new Error('Error fetching comment');
        }
    }
}
export default CommentService;
//# sourceMappingURL=comment.service.js.map