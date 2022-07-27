import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
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
    const answers = await this.answersRepository.find({
      relations: ['questions'],
      where: {
        question: qid,
      },
    });
    return {
      answers,
    };
  }

  async createAnswer({ content, qid }: CreateAnswerDto, user: User) {
    /* content 클린 */
    const cleanedContent = sanitizeHtml(content);

    /* question 가져오기 */
    const question = await this.questionsRepository.findOne(qid);

    if (question === null) return false;

    await this.answersRepository.createAnswer(
      { content: cleanedContent },
      question,
      user,
    );

    return true;
  }
}
