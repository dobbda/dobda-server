import { Reply } from 'src/replies/entities/reply.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateNotiDto } from './dtos/create-noti.dto';
import { GetNotisOutput } from './dtos/get-noti.dto';
import { NotisRepository } from './repositories/notis.repository';
import { Comment } from 'src/comments/entities/comment.entity';
import { NotiType } from './entities/noti.entity';
import { Answer } from 'src/answers/entities/answer.entity';

@Injectable()
export class NotisService {
  constructor(private readonly notisRepository: NotisRepository) {}

  async createNoti(dto: CreateNotiDto) {
    await this.notisRepository.createNoti(dto);
  }

  async getNotis(user: User): Promise<GetNotisOutput> {
    const result = await this.notisRepository.find({
      where: {
        to: user,
      },
      take: 5,
    });

    return {
      notis: result.map((x) => {
        return {
          id: x.id,
          type: x.type,
          createdAt: x.createdAt,
          content: x.content,
        };
      }),
    };
  }

  async getAllNotis(user: User): Promise<GetNotisOutput> {
    const result = await this.notisRepository.find({
      where: {
        to: user,
      },
    });

    return {
      notis: result.map((x) => {
        return {
          id: x.id,
          type: x.type,
          createdAt: x.createdAt,
          content: x.content,
        };
      }),
    };
  }

  async viewNoti(id: number, user: User) {
    const noti = await this.notisRepository.findOneNotiWithId(id);

    if (!noti) {
      throw new NotFoundException('id에 해당하는 noti가 없습니다.');
    }

    if (noti.to.id !== user.id) {
      throw new ForbiddenException('잘못된 요청입니다.');
    }

    noti.checked = true;

    this.notisRepository.save(noti);

    return null;
  }

  async addAnswerNoti(answer: Answer, to: User) {
    this.createNoti({
      type: NotiType.ANSWER,
      content: JSON.stringify({
        questionId: answer.question.id,
        content: answer.content.substring(0, 20),
      }),
      to: to,
    });
  }

  async addCommentNoti(comment: Comment, to: User) { //question 댓글
    this.createNoti({
      type: NotiType.COMMENT,
      content: JSON.stringify({
        questionId: comment.answer.questionId,
        answerId: comment.answer.id,
        content: comment.content.substring(0, 20),
      }),
      to: to,
    });
  }

	async addReplyNoti(reply: Reply, to: User) { //outSourcing 댓글
		console.log(reply)
    this.createNoti({
      type: NotiType.COMMENT,
      content: JSON.stringify({
        outSourcingId: reply.enquiry.outSourcingId,
        enquiryId: reply.enquiryId,
        content: reply.content.substring(0, 20),
      }),
      to: to,
    });
  }

  async addAcceptNoti(answer: Answer, to: User) {
    this.createNoti({
      type: NotiType.ACCEPT,
      content: JSON.stringify({
        questionId: answer.question.id,
        content: `${answer.content.substring(0, 20)} 답변이 채택되었습니다.`,
      }),
      to: to,
    });
  }
}
