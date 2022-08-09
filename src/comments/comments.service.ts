import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { AnswersRepository } from 'src/answers/repositories/answers.repository';
import { User } from 'src/users/entities/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { GetCommentsDto } from './dtos/get-comment.dto';
import { CommentsRepository } from './repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  async getComments({ aid }: GetCommentsDto) {
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .where({ answer: aid })
      .leftJoin('comment.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
			.orderBy('comment.updatedAt', 'DESC')
      .getMany();
    return {
      comments,
    };
  }

  async createComment({ answerId, content }: CreateCommentDto, user: User) {
    /* Question 가져오기 */
    const answer = await this.answersRepository.findOne(answerId);
    if (!answer) return;
    await this.answersRepository.save([
      {
        id: answer.id,
        commentsCount: answer.commentsCount + 1,
      },
    ]);
    await this.commentsRepository.createComment({ content }, answer, user);

    return true;
  }
}
