import { EntityRepository, Repository } from 'typeorm';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Question } from '../entities/question.entity';

@EntityRepository(Question)
export class QuestionsRepository extends Repository<Question> {
  async createQuestion(createQuestion: CreateQuestionDto): Promise<Question> {
    return this.save(this.create(createQuestion));
  }

  async getQuestionWithId(questionId: number) {
    return this.createQueryBuilder('question')
      .where('question.id = :questionId', { questionId })
      .getOne();
  }
}
