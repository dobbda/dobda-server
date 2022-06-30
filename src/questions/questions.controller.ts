import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
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
  @UseGuards(AccessTokenGuard)
  async createQuestion(
    @Body('question') createQuestionDto: CreateQuestionDto,
    @Body('tag') createTagsDto: CreateTagsDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.createQuestion(
      createQuestionDto,
      createTagsDto,
      user,
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
  @UseGuards(AccessTokenGuard)
  async editQuestion(
    @Param('id') questionId: number,
    @Body('question') editQuestionDto: EditQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.editQuestion(
      questionId,
      editQuestionDto,
      user,
    );
  }

  /* 
    질문 수정 API
    url: questions/:id (DELETE)
  */
  @Delete('/:id')
  @UseGuards(AccessTokenGuard)
  async deleteQuestion(
    @Param('id') questionId: number,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.deleteQuestion(questionId, user);
  }
}
