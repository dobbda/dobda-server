import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateQuestionDto, CreateTagsDto } from './dtos/create-question.dto';
import { EditQuestionDto } from './dtos/edit-question.dto';
import { GetQuestionsDto } from './dtos/get-questions.dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionsService: QuestionsService) {}
  /* 
    질문 목록 API  (default page 1) (GET)
    url: questions 
    url: questions?title=${title} 
    url: questions?tag=${tag} 
    url: questions?page=${page}&title=${title} 
    url: questions?page=${page}&tag=${tag}
  */
  @Get()
  async getQuestions(@Query() getQuestionsDto: GetQuestionsDto) {
    return this.questionsService.getQuestions(getQuestionsDto);
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
    질문 상세 목록 API
    url: questions/:questionId (GET)
  */
  @Get('/:id')
  async getQuestion(@Param('id') questionId: number) {
    return this.questionsService.getQuestion(questionId);
  }

  /* 
    질문 수정 API
    url: questions/:id (PATCH)
  */
  @Patch('/:id')
  async editQuestion(
    @Param('id') questionId: number,
    @Body('question') editQuestionDto: EditQuestionDto,
  ) {
    return this.questionsService.editQuestion(questionId, editQuestionDto);
  }

  /* 
    질문 수정 API
    url: questions/:id (DELETE)
  */
  @Delete('/:id')
  async deleteQuestion(@Param('id') questionId: number) {
    return this.questionsService.deleteQuestion(questionId);
  }
}
