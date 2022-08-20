
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { NotisService } from 'src/noti/notis.service';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { User } from 'src/users/entities/user.entity';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { GetAnswersDto } from './dtos/get-answer.dto';
import { AnswersRepository } from './repositories/answers.repository';

@Injectable()
export class AnswersService {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly notisService: NotisService,
  ) {}

  async getAnswers({ qid }: GetAnswersDto) {
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
    await this.questionsRepository.save([
      { id: qid, answersCount: question.answersCount + 1 },
    ]);
        
    const answer = await this.answersRepository.createAnswer(
      {content },
      question,
      user,
    );
    
    await this.notisService.addAnswerNoti(answer, user);
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
		return {success:true}
  }
}
