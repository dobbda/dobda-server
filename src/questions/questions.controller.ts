import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateQuestionDto, CreateTagsDto } from './dtos/create-question.dto';
import { EditQuestionDto } from './dtos/edit-question.dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionsService: QuestionsService) {}
  /* 
    질문 상세 목록 API
    url: questions/detail/:questionId (GET)
  */
  @Get('/detail/:questionId')
  async getQuestion(@Param('questionId') questionId: number) {
    return this.questionsService.getQuestion(questionId);
  }

  /* 
    질문 등록 API
    url: questions (POST)
  */
  @Post()
  async createQuestion(
    @Body('question') createQuestionDto: CreateQuestionDto,
    @Body('tag') createTagsDto: CreateTagsDto,
  ) {
    return this.questionsService.createQuestion(
      createQuestionDto,
      createTagsDto,
    );
  }

  /* 
    질문 수정 API
    url: questions/detail/:id (PATCH)
  */
  @Patch('/detail/:questionId')
  async editQuestion(
    @Param('questionId') questionId: number,
    @Body('question') editQuestionDto: EditQuestionDto,
  ) {
    return this.questionsService.editQuestion(questionId, editQuestionDto);
  }
}
