import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Question } from '../entities/question.entity';

@EntityRepository(Question)
export class QuestionsRepository extends Repository<Question> {
  async createQuestion(
    createQuestion: { title: string; content: string; coin: number },
    author: User,
  ): Promise<Question> {
    return await this.save(this.create({ ...createQuestion, author }));
  }

  async findOneQuestionWithId(questionId: number, getAuthor?: boolean) {
    const question = this.createQueryBuilder('question').where(
      'question.id = :questionId',
      { questionId },
    );

    if (getAuthor) {
      question
        .leftJoin('question.author', 'author')
        .addSelect([
          'author.email',
          'author.nickname',
          'author.id',
          'author.avatar',
        ]);
    }
    return question.getOne();
  }

  async findAllWithUserId(userId: number, page: number) {
    const questionQuery = this.createQueryBuilder('question')
      .where('question.author.id = :userId', { userId })
      .take(10)
      .skip((page - 1) * 10)
      .leftJoin('question.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
      .orderBy('question.createdAt', 'DESC');

    const [questions, total] = await questionQuery.getManyAndCount();
    return {
      total,
      questions,
    };
  }
  async findAll(page: number, title?: string, tagId?: number) {
    const questionQuery = this.createQueryBuilder('question')
      .take(20)
      .skip((page - 1) * 20)
      .leftJoin('question.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
      .orderBy('question.updatedAt', 'DESC');

    if (title && title !== 'undefined') {
      questionQuery.where('question.title like :title', {
        title: `%${title}%`,
      });
    }
    if (tagId) {
      questionQuery
        .leftJoin('question.questionTags', 'questionTag')
        .andWhere('questionTag.tagId = :tagId', { tagId });
    }
    const [questions, total] = await questionQuery.getManyAndCount();
    return {
      total,
      questions,
    };
  }
}
