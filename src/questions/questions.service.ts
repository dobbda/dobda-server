import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { EditQuestionDto } from './dtos/edit-question.dto';
import { GetQuestionsDto } from './dtos/get-questions.dto';
import { QuestionsRepository } from './repositories/questions.repository';
import { QuestionTagsRepository } from './repositories/questionTags.repository';
import { TagsRepository } from './repositories/tags.repository';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly questionTagsRepository: QuestionTagsRepository,
  ) {}

  async findQuestionOrError(questionId: number, getAuthor?: boolean) {
    const question = await this.questionsRepository.findOneQuestionWithId(
      questionId,
      getAuthor,
    );
    if (!question) {
      throw new NotFoundException('id에 해당하는 question이 없습니다.');
    }
    return question;
  }

  async getQuestions({ page, title, tagId }: GetQuestionsDto) {
    const { total, questions } = await this.questionsRepository.findAll(
      page,
      title,
      tagId,
    );
    const result = await Promise.all(
      questions.map(async (question) => {
        const tags = await this.tagsRepository.allTagsInQuestion(question.id);
        return { ...question, tags };
      }),
    );
    return {
      result,
      totalPages: Math.ceil(total / 20),
    };
  }

  async getQuestion(questionId: number) {
    const result = await this.findQuestionOrError(questionId);
    const tags = await this.tagsRepository.allTagsInQuestion(questionId);
    return {
      question: { ...result, tags },
    };
  }

  async createQuestion({ tagNames, ...rest }: CreateQuestionDto, user: User) {
    /* question생성 */
    const question = await this.questionsRepository.createQuestion(rest, user);

    /* tag생성 */
    const tags = await this.tagsRepository.createNonExistTags(tagNames);

    /* questionTag 생성 */
    await this.questionTagsRepository.createQuestionTags(question.id, tags);
    return true;
  }

  async editQuestion(
    questionId: number,
    { tagNames, ...editQuestion }: EditQuestionDto,
    user: User,
  ) {
    const result = await this.findQuestionOrError(questionId);
    /*  question을 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    await this.questionsRepository.save([
      {
        id: result.id,
        ...editQuestion,
      },
    ]);
    if (tagNames) {
      await this.questionTagsRepository.delete({ questionId });
      const tags = await this.tagsRepository.createNonExistTags(tagNames);
      await this.questionTagsRepository.createQuestionTags(result.id, tags);
    }
    return true;
  }

  async deleteQuestion(questionId: number, user: User) {
    const result = await this.findQuestionOrError(questionId);
    /*  question을 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    await this.questionsRepository.delete({ id: questionId });
    return true;
  }
}
