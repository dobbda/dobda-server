import { EntityRepository, Repository } from 'typeorm';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Question } from '../entities/question.entity';

@EntityRepository(Question)
export class QuestionsRepository extends Repository<Question> {
  async createQuestion(createQuestion: CreateQuestionDto): Promise<Question> {
    return this.save(this.create(createQuestion));
  }

  async findOneQuestionWithId(questionId: number) {
    return this.createQueryBuilder('question')
      .where('question.id = :questionId', { questionId })
      .getOne();
  }

  async findAll(page: number, title?: string) {
    const questionQuery = this.createQueryBuilder('question');
    if (title) {
      questionQuery.where('question.title like :title', {
        title: `%${title}%`,
      });
    }
    return {
      total: await questionQuery.getCount(),
      questions: await questionQuery
        .take(20)
        .skip((page - 1) * 20)
        .getMany(),
    };
  }
}
