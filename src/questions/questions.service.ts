import { Injectable } from '@nestjs/common';
import { CreateQuestionDto, CreateTagsDto } from './dtos/create-question.dto';
import { EditQuestionDto } from './dtos/edit-question.dto';
import { Tag } from './entities/tag.entity';
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

  async getQuestion(questionId: number) {
    const question = await this.questionsRepository.getQuestionWithId(
      questionId,
    );
    if (!question) {
      return {
        success: false,
        response: null,
        error: {
          message: 'id에 해당하는 question이 없습니다.',
          status: 404,
        },
      };
    }
    const tags = await this.tagsRepository.allTagsInQuestion(questionId);
    return {
      success: true,
      response: {
        question: { ...question, tags },
      },
      error: null,
    };
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    createTagsDto: CreateTagsDto,
  ) {
    //question생성
    const question = await this.questionsRepository.createQuestion(
      createQuestionDto,
    );
    //tag생성
    const tags = await this.tagsRepository.createNonExistTags(createTagsDto);
    //2.QuestionTag create
    await this.questionTagsRepository.createQuestionTags(question.id, tags);
    return {
      success: true,
      response: {
        result: true,
      },
      error: null,
    };
  }

  async editQuestion(
    questionId: number,
    { tagNames, ...editQuestion }: EditQuestionDto,
  ) {
    const question = await this.questionsRepository.getQuestionWithId(
      questionId,
    );
    if (!question) {
      return {
        success: false,
        response: null,
        error: {
          message: 'id에 해당하는 question이 없습니다.',
          status: 404,
        },
      };
    }
    //TODO: question을 user가 만든게 맞는지 check
    await this.questionsRepository.save([
      {
        id: question.id,
        ...editQuestion,
      },
    ]);
    if (tagNames) {
      await this.questionTagsRepository.delete({ questionId });
      const tags = await this.tagsRepository.createNonExistTags({ tagNames });
      await this.questionTagsRepository.createQuestionTags(question.id, tags);
    }
    return {
      success: true,
      response: {
        result: true,
      },
      error: null,
    };
  }
}
