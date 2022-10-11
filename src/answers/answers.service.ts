import { PayType } from './../payment/entities/payments.entity';
import { PaymentsRepository } from '../payment/repositories/payment.repository';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlarmsService } from 'src/alarms/alarms.service';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { GetAnswersDto } from './dtos/get-answer.dto';
import { AnswersRepository } from './repositories/answers.repository';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class AnswersService {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly alarmsService: AlarmsService,
    private readonly userRepository: UsersRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async getAnswers(qid: number) {
    const answers = await this.answersRepository
      .createQueryBuilder('answer')
      .where({ question: qid })
      .leftJoin('answer.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
      .orderBy('answer.updatedAt', 'DESC')
      .getMany();
    return {
      answers,
    };
  }

  async createAnswer({ content, qid }: CreateAnswerDto, user: User) {
    /* question 가져오기 */
    const question = await this.questionsRepository.findOne(qid);

    if (question === null) {
      throw new NotFoundException('잘못된 접근입니다.');
    }
    await this.questionsRepository.update(qid, {
      answersCount: question.answersCount + 1,
    });

    const answer = await this.answersRepository.createAnswer(
      { content },
      question,
      user,
    );

    await this.alarmsService.addAnswerAlarm(answer, user);
    return true;
  }

  // 채택
  async acceptAnswer(answerId: number, user: User) {
    const answer = await this.answersRepository.findOne(answerId); // answer.question이 undefined으로 나옴
    const question = await this.questionsRepository.findOne(answer.questionId);
    const toUser = await this.userRepository.findUserByAuthorId(
      answer.authorId,
    );
    if (question.acceptedAnswerId) {
      throw new ForbiddenException('이미 채택된 답변이 있습니다.');
    }
    if (question.authorId !== user.id) {
      throw new ForbiddenException('질문자만 답변을 채택할 수 있습니다.');
    }
    if (question.authorId == answer.authorId) {
      throw new ForbiddenException('본인 답변은 채택할 수 없습니다.');
    }

    answer.accepted = true;
    answer.accepted_question = question;
    answer.question = question;
    answer.question.acceptedAnswer = answer;
    await this.answersRepository.save(answer);
    await this.alarmsService.addAcceptAlarm(answer, toUser);

    await this.userRepository.update(user.id, {
      //채택한 수
      setAcceptCount: user.setAcceptCount + 1,
    });
    await this.userRepository.update(answer.authorId, {
      //채택된 답변수
      getAcceptCount: toUser.getAcceptCount + 1,
    });

    if (question.coin > 0 && user.coin >= question.coin) {
      this.paymentService.tossCoin(
        user,
        answer.authorId,
        question.coin,
        PayType.QUESTION,
      );
    }

    return true;
  }

  async editAnswer(content: string, aid: number, user: User) {
    const answer = await this.answersRepository.findOne({ id: aid });
    if (user.id !== answer.authorId) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (answer.commentsCount) {
      throw new BadRequestException('댓글이 달린 답변은 수정이 불가능합니다.');
    }
    if (answer.accepted) {
      throw new BadRequestException('채택된 답변은 수정이 불가능합니다.');
    }
    const newAnswer = await this.answersRepository.save({
      id: aid,
      content: content,
    });
    return newAnswer;
  }

  async deleteAnswer(aid: number, user: User) {
    const answer = await this.answersRepository.findOne({ id: aid });
    const question = await this.questionsRepository.findOne(answer.questionId);
    if (user.id !== answer.authorId) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (answer.commentsCount) {
      throw new BadRequestException('댓글이 달린 답변은 수정이 불가능합니다.');
    }
    if (answer.accepted) {
      throw new BadRequestException('채택된 답변은 수정이 불가능합니다.');
    }

    await this.answersRepository.delete({
      id: aid,
    });

    await this.questionsRepository.update(answer.questionId, {
      answersCount: question.answersCount - 1,
    });

    return { success: true };
  }
}
