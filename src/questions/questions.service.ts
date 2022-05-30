import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { CreateTagsDto } from './dtos/create-tags.dto';
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

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    createTagsDto: CreateTagsDto,
  ) {
    //question생성
    const question = await this.questionsRepository.createQuestion(
      createQuestionDto,
    );
    //tag생성
    const tags = await this.tagsRepository.createTags(createTagsDto);
    //2.QuestionTag create
    await this.questionTagsRepository.createQuestionTags(question.id, tags);
  }
}
