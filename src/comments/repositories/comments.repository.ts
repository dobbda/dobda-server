import { Answer } from 'src/answers/entities/answer.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async createComment(
    createComment: { content: string },
    answer: Answer,
    author: User,
  ): Promise<Comment> {
    return this.save(this.create({ ...createComment, author, answer }));
  }
}
