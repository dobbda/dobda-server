import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto, CreateTagsDto } from './dtos/create-question.dto';
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

  async findQuestionOrError(questionId: number) {
    const question = await this.questionsRepository.findOneQuestionWithId(
      questionId,
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
    if ('error' in result) {
      return result;
    }
    const tags = await this.tagsRepository.allTagsInQuestion(questionId);
    return {
      question: { ...result, tags },
    };
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    createTagsDto: CreateTagsDto,
  ) {
    /*
      TODO: question과 user 관계 맺기
    */

    //question생성
    const question = await this.questionsRepository.createQuestion(
      createQuestionDto,
    );
    //tag생성
    const tags = await this.tagsRepository.createNonExistTags(createTagsDto);
    //QuestionTag 생성
    await this.questionTagsRepository.createQuestionTags(question.id, tags);
    return true;
  }

  async editQuestion(
    questionId: number,
    { tagNames, ...editQuestion }: EditQuestionDto,
  ) {
    const result = await this.findQuestionOrError(questionId);
    if ('error' in result) {
      return result;
    }
    /*
      TODO: question을 user가 만든게 맞는지 check
    */
    await this.questionsRepository.save([
      {
        id: result.id,
        ...editQuestion,
      },
    ]);
    if (tagNames) {
      await this.questionTagsRepository.delete({ questionId });
      const tags = await this.tagsRepository.createNonExistTags({ tagNames });
      await this.questionTagsRepository.createQuestionTags(result.id, tags);
    }
    return true;
  }

  async deleteQuestion(questionId: number) {
    /*
      TODO: question을 user가 만든게 맞는지 check
    */
    const result = await this.findQuestionOrError(questionId);
    if ('error' in result) {
      return result;
    }
    await this.questionsRepository.delete({ id: questionId });
    return true;
  }
}
