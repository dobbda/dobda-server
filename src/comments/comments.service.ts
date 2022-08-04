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
    const comments = await this.commentsRepository.find({
      relations: ['answers'],
      where: {
        answer: aid,
      },
    });
    return {
      comments,
    };
  }

  async createComment({ answerId, content }: CreateCommentDto, user: User) {
    /* content 클린 */
    const cleanedContent = sanitizeHtml(content);

    /* Question 가져오기 */
    const answer = await this.answersRepository.findOne(answerId);

    await this.commentsRepository.createComment(
      { content: cleanedContent },
      answer,
      user,
    );

    return true;
  }
}