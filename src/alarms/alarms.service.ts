import { Reply } from 'src/replies/entities/reply.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateAlarmDto } from './dtos/create-alarm.dto';
import { GetAlarmsOutput } from './dtos/get-alarm.dto';
import { AlarmsRepository } from './repositories/alarms.repository';
import { Comment } from 'src/comments/entities/comment.entity';
import { AlarmType } from './entities/alarm.entity';
import { Answer } from 'src/answers/entities/answer.entity';

@Injectable()
export class AlarmsService {
  constructor(private readonly alarmsRepository: AlarmsRepository) {}

  async createAlarm(dto: CreateAlarmDto) {
    await this.alarmsRepository.createAlarm(dto);
  }

  async getAlarms(user: User): Promise<GetAlarmsOutput> {
    const result = await this.alarmsRepository.find({
      where: {
        to: user,
      },
      take: 5,
    });

    return {
      alarms: result.map((x) => {
        return {
          id: x.id,
          type: x.type,
          createdAt: x.createdAt,
          content: x.content,
        };
      }),
    };
  }

  async getAllAlarms(user: User): Promise<GetAlarmsOutput> {
    const result = await this.alarmsRepository.find({
      where: {
        to: user,
      },
    });

    return {
      alarms: result.map((x) => {
        return {
          id: x.id,
          type: x.type,
          createdAt: x.createdAt,
          content: x.content,
        };
      }),
    };
  }

  async viewAlarm(id: number, user: User) {
    const alarm = await this.alarmsRepository.findOneAlarmWithId(id);

    if (!alarm) {
      throw new NotFoundException('id에 해당하는 noti가 없습니다.');
    }

    if (alarm.to.id !== user.id) {
      throw new ForbiddenException('잘못된 요청입니다.');
    }

    alarm.checked = true;

    this.alarmsRepository.save(alarm);

    return null;
  }

  async addAnswerAlarm(answer: Answer, to: User) {
    this.createAlarm({
      type: AlarmType.ANSWER,
      content: JSON.stringify({
        questionId: answer.question.id,
        content: answer.content.substring(0, 20),
      }),
      to: to,
    });
  }

  async addCommentAlarm(comment: Comment, to: User) {
    //question 댓글
    this.createAlarm({
      type: AlarmType.COMMENT,
      content: JSON.stringify({
        questionId: comment.answer.questionId,
        answerId: comment.answer.id,
        content: comment.content.substring(0, 20),
      }),
      to: to,
    });
  }

  async addReplyAlarm(reply: Reply, to: User) {
    //outSourcing 댓글
    console.log(reply);
    this.createAlarm({
      type: AlarmType.COMMENT,
      content: JSON.stringify({
        outSourcingId: reply.enquiry.outSourcingId,
        enquiryId: reply.enquiryId,
        content: reply.content.substring(0, 20),
      }),
      to: to,
    });
  }

  async addAcceptAlarm(answer: Answer, to: User) {
    this.createAlarm({
      type: AlarmType.ACCEPT,
      content: JSON.stringify({
        questionId: answer.question.id,
        content: `${answer.content.substring(0, 20)} 답변이 채택되었습니다.`,
      }),
      to: to,
    });
  }
}
