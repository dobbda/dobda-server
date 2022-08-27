import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AnswersRepository } from 'src/answers/repositories/answers.repository';
import { NotisService } from 'src/noti/notis.service';
import { User } from 'src/users/entities/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { EditCommentDto } from './dtos/edit-comment.dto';
import { GetCommentsDto } from './dtos/get-comment.dto';
import { CommentsRepository } from './repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly answersRepository: AnswersRepository,
    private readonly notisService: NotisService,
  ) {}

  async getComments({ aid }: GetCommentsDto) {
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .where({ answer:aid })
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

  async createComment({ aid, content }: CreateCommentDto, user: User) {
    /* Question 가져오기 */
    const answer = await this.answersRepository.findOne(aid);

    if (!answer) return;
    await this.answersRepository.save([
      {
        id: answer.id,
        commentsCount: answer.commentsCount + 1,
      },
    ]);

    const comment = await this.commentsRepository.createComment(
      { content },
      answer,
      user,
    );

    await this.notisService.addCommentNoti(comment, user);

    return true;
  }

  async editComment(
    commentId: number,
    { ...editComment }: EditCommentDto,
    user: User,
  ) {
    const result = await this.commentsRepository.findOneCommentWithId(
      commentId,
      null,
    );

    if (!result) {
      throw new NotFoundException('댓글이 삭제되었거나 잘못된 접근입니다.');
    }

    /*  comment를 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    const newComment = await this.commentsRepository.save([
      {
        id: result.id,
        ...editComment,
      },
    ]);

    return {
      ...newComment[0],
      author: {
        email: user.email,
        nickname: user.nickname,
        id: user.id,
        avatar: user.avatar,
      },
    };
  }

  async deleteComment(commentId: number, user: User) {
    const result = await this.commentsRepository.findOneCommentWithId(
      commentId,
      null,
    );

    if (!result) {
      throw new NotFoundException('댓글이 삭제되었거나 잘못된 접근입니다.');
    }

    /*  question을 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }

    await this.commentsRepository.delete({ id: commentId });
    return true;
  }
}
