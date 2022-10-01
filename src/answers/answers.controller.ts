import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { GetAnswersDto, GetAnswersOutput } from './dtos/get-answer.dto';

@Controller('answers')
@ApiTags('question 답변 API<Comment parents>')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  /* 
    답변 조회
    url: answers (GET)
  */
  @Get('/:qid')
  @ApiOperation({ summary: '답변 조회' })
  @ApiCreatedResponse({
    description: '답변 조회',
    type: GetAnswersOutput,
  })
  async getAnswers(@Param('qid') getAnswersDto: GetAnswersDto) {
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

  /* 
    답변 채택 API
    url: answers/accept/:id (PATCH)
  */
  @Patch('/accept/:id')
  @ApiOperation({ summary: '답변 채택' })
  @ApiParam({ name: 'id', required: true, description: 'Answer Id' })
  @ApiCreatedResponse({
    description: 'id에 해당하는 답변과 답변의 질문을 채택 상태로 변경한다.',
  })
  @UseGuards(AccessTokenGuard)
  async acceptAnswer(@Param('id') answerId: number, @CurrentUser() user: User) {
    return this.answersService.acceptAnswer(answerId, user);
  }

  /* 
    답변 수정 API
    url: answers/:id (PATCH)
  */
  @Patch('/:id')
  @ApiOperation({ summary: '답변 수정' })
  @ApiBody({ type: '{content:string}' })
  @ApiCreatedResponse({ description: '답변을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async editAnswer(
    @Param('id') aid: number,
    @Body('content') content: string,
    @CurrentUser() user: User,
  ) {
    return this.answersService.editAnswer(content, aid, user);
  }

  /* 
    답변 삭제 API
    url: answers/:id (DELETE)
  */
  @Delete('/:id')
  @ApiOperation({ summary: '답변삭제' })
  @ApiCreatedResponse({ description: '답변을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async deledteAnswer(@Param('id') aid: number, @CurrentUser() user: User) {
    return this.answersService.deleteAnswer(aid, user);
  }
}
