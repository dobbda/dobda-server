import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Answer } from '../entities/answer.entity';

@EntityRepository(Answer)
export class AnswersRepository extends Repository<Answer> {
  async createAnswer(
    createAnswer: { content: string },
    question: Question,
    author: User,
  ): Promise<Answer> {
    return this.save(this.create({ ...createAnswer, question, author }));
  }
}
