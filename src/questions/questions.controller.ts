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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { EditQuestionDto } from './dtos/edit-question.dto';
import { GetQuestionsDto, GetQuestionsOutput } from './dtos/get-questions.dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
@ApiTags('질문 API')
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
  @ApiOperation({ summary: '질문 조회' })
  @ApiCreatedResponse({
    description: '질문여러개를 조회한다',
    type: GetQuestionsOutput,
  })
  async getQuestions(
    @Query() getQuestionsDto: GetQuestionsDto,
  ) {
    return this.questionsService.getQuestions(getQuestionsDto);
  }

  /* 
    질문 등록 API
    url: questions (POST)
  */
  @Post()
  @ApiOperation({ summary: '질문 등록' })
  @ApiBody({ type: CreateQuestionDto })
  @ApiCreatedResponse({ description: '질문을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.createQuestion(createQuestionDto, user);
  }

  /* 
    질문 상세 조희 API
    url: questions/:questionId (GET)
  */
  @Get('/:id')
  @ApiOperation({ summary: '질문 상세 조희' })
  @ApiParam({ name: 'id', required: true, description: 'Question Id' })
  @ApiCreatedResponse({ description: 'id에 해당하는 질문을 조회한다' })
  async getQuestion(@Param('id') questionId: number) {
    return this.questionsService.getQuestion(questionId);
  }

  /* 
    질문 수정 API
    url: questions/:id (PATCH)
  */
  @Patch('/:id')
  @ApiOperation({ summary: '질문 수정' })
  @ApiParam({ name: 'id', required: true, description: 'Question Id' })
  @ApiBody({ type: PartialType(CreateQuestionDto) })
  @ApiCreatedResponse({ description: 'id에 해당하는 질문을 수정한다' })
  @UseGuards(AccessTokenGuard)
  async editQuestion(
    @Param('id') questionId: number,
    @Body() editQuestionDto: EditQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.editQuestion(
      questionId,
      editQuestionDto,
      user,
    );
  }

  /* 
    질문 조회수 수정 API
    url: questions/:id/watch (PATCH)
  */
  @Patch('/:id/watch')
  @ApiOperation({ summary: '질문 조회수 업데이트 API' })
  @ApiParam({ name: 'id', required: true, description: '질문 Id' })
  @ApiCreatedResponse({ description: '질문 게시글의 조회수를 1 올려준다.' })
  // @UseGuards(AccessTokenGuard)
  async updateQuestionWatch(@Param('id') questionId: number) {
    return this.questionsService.updateQuestionWatch(questionId);
  }

  /* 
    질문 삭제 API
    url: questions/:id (DELETE)
  */
  @Delete('/:id')
  @ApiOperation({ summary: '질문 삭제' })
  @ApiParam({ name: 'id', required: true, description: 'Question Id' })
  @ApiCreatedResponse({ description: 'id에 해당하는 질문을 삭제한다' })
  @UseGuards(AccessTokenGuard)
  async deleteQuestion(
    @Param('id') questionId: number,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.deleteQuestion(questionId, user);
  }
}
