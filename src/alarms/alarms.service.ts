import { Question } from './../questions/entities/question.entity';
import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { Enquiry } from 'src/enquiry/entities/enquiry.entity';
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

  async getAlarm(user: User): Promise<GetAlarmsOutput> {
    const result = await this.alarmsRepository.find({
      where: {
        to: user,
        checked: false,
      },
      take: 10,
    });

    return {
      result: result.map((x) => {
        return {
          id: x.id,
          checked: x.checked,
          type: x.type,
          createdAt: x.createdAt,
          content: JSON.parse(x.content),
        };
      }),
    };
  }

  async getAlarms(user: User): Promise<GetAlarmsOutput> {
    const result = await this.alarmsRepository.find({
      where: {
        to: user,
      },
      take: 100,
    });

    return {
      result: result.map((x) => {
        return {
          id: x.id,
          checked: x.checked,
          type: x.type,
          createdAt: x.createdAt,
          content: JSON.parse(x.content),
        };
      }),
    };
  }

  async viewAlarm(id: number, user: User) {
    const alarm = await this.alarmsRepository.findOneAlarmWithId(id);
    console.log('알람: ', id, alarm);

    if (!alarm) {
      throw new NotFoundException('id에 해당하는 noti가 없습니다.');
    }

    if (alarm.to.id !== user.id) {
      throw new ForbiddenException('잘못된 요청입니다.');
    }

    alarm.checked = true;

    this.alarmsRepository.save(alarm);

    return true;
  }

  async addAnswerAlarm(answer: Answer, question: Question, to: User) {
    this.createAlarm({
      type: AlarmType.ANSWER,
      content: JSON.stringify({
        questionId: answer.question.id,
        answerId: answer.id,
        content: `[${question.title.substring(
          0,
          10,
        )}...]글에 답글이 달렸습니다.`,
      }),
      to: to,
    });
  }

  async addCommentAlarm(comment: Comment, question: Question, to: User) {
    //question 댓글
    this.createAlarm({
      type: AlarmType.COMMENT,
      content: JSON.stringify({
        questionId: comment.answer.questionId,
        answerId: comment.answerId,
        commentId: comment.id,
        content: `[${question.title.substring(
          0,
          10,
        )}...]에 남긴 답변에 답글이달렸습니다`,
      }),
      to: to,
    });
  }
  async addAcceptAlarm(answer: Answer, question: Question, to: User) {
    this.createAlarm({
      type: AlarmType.ACCEPT,
      content: JSON.stringify({
        questionId: answer.question.id,
        answerId: answer.id,
        content: `[${question.title.substring(
          0,
          10,
        )}...] 에남긴 답변이 채택되었습니다.`,
      }),
      to: to,
    });
  }

  /* sourcing */
  async addReplyAlarm(reply: Reply, sourcing: OutSourcing, to: User) {
    //outSourcing 댓글
    console.log(reply);
    this.createAlarm({
      type: AlarmType.COMMENT,
      content: JSON.stringify({
        outSourcingId: sourcing.id,
        enquiryId: reply.enquiryId,
        replyId: reply.id,
        content: `[${sourcing.title.substring(
          0,
          10,
        )}...]에 남긴 글에 답글이달렸습니다.`,
      }),
      to: to,
    });
  }

  async addEnquiryAlarm(enquiry: Enquiry, outSourcing: OutSourcing, to: User) {
    this.createAlarm({
      type: AlarmType.EN_PICK,
      content: JSON.stringify({
        outSourcingId: outSourcing.id,
        enquiryId: enquiry.id,
        content: `[${outSourcing.title.substring(
          0,
          10,
        )}...]소싱글에 답글이 달렸습니다`,
      }),
      to: to,
    });
  }

  async addPickEnquiryAlarm(
    enquiry: Enquiry,
    outSourcing: OutSourcing,
    to: User,
  ) {
    this.createAlarm({
      type: AlarmType.EN_PICK,
      content: JSON.stringify({
        outSourcingId: outSourcing.id,
        enquiryId: enquiry.id,
        content: `[${outSourcing.title.substring(
          0,
          10,
        )}...]소싱에 선택되었습니다. 거래를 계속 진행해주세요`,
      }),
      to: to,
    });
  }
}
