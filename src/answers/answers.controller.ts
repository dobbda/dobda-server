import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { GetAnswersDto, GetAnswersOutput } from './dtos/get-answer.dto';

@Controller('answers')
@ApiTags('답변 API')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  /* 
    답변 조회
    url: answers (GET)
  */
  @Get()
  @ApiOperation({ summary: '답변 조회' })
  @ApiCreatedResponse({
    description: '질문여러개를 조회한다',
    type: GetAnswersOutput,
  })
  async getAnswers(@Query() getAnswersDto: GetAnswersDto) {
    return this.answersService.getAnswers(getAnswersDto);
  }

  /* 
    답변 등록 API
    url: answers (POST)
  */
  @Post()
  @ApiOperation({ summary: '답변 등록' })
  @ApiBody({ type: CreateAnswerDto })
  @ApiCreatedResponse({ description: '답변을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async createAnswer(
    @Body() createAnswerDto: CreateAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.answersService.createAnswer(createAnswerDto, user);
  }
}
