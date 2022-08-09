import { Injectable } from '@nestjs/common';
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

    if (question === null) return false;
    await this.questionsRepository.save([
      { id: qid, answersCount: question.answersCount + 1 },
    ]);
    await this.answersRepository.createAnswer({ content }, question, user);
    return true;
  }
}
