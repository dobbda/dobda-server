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
  PartialType,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RepliesService } from './replies.service';
import { EditReplyDto } from './dtos/edit-reply.dto';
import { GetReplyDto, GetReplyOutput } from './dtos/get-reply.dto';
import { CreateReplyDto } from './dtos/create-reply.dto';

@Controller('replies')
@ApiTags('outSourcing 댓글 API<enquiry children>')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  /* 
    댓글 조회
    url: replies (GET)
  */
  @Get('/:eid')
  @ApiOperation({ summary: '댓글 조회' })
  @ApiCreatedResponse({
    description: '댓글여러개를 조회한다',
    type: GetReplyOutput,
  })
  async getAnswers(@Param('eid') eid: number) {
    return this.repliesService.getReplies(eid);
  }

  /* 
    댓글 등록 API
    url: replies (POST)
  */
  @Post()
  @ApiOperation({ summary: '댓글 등록' })
  @ApiBody({ type: CreateReplyDto })
  @ApiCreatedResponse({ description: '댓글을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async createQuestion(
    @Body() createReplyDto: CreateReplyDto,
    @CurrentUser() user: User,
  ) {
    return this.repliesService.createReply(createReplyDto, user);
  }

  /* 
    댓글 수정 API
    url: replies/:id (PATCH)
  */
  @Patch('/:id')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({ name: 'id', required: true, description: 'replies Id' })
  @ApiBody({ type: PartialType(CreateReplyDto) })
  @ApiCreatedResponse({ description: 'id에 해당하는 댓글을 수정한다' })
  @UseGuards(AccessTokenGuard)
  async editQuestion(
    @Param('id') replyId: number,
    @Body() editReplyDto: EditReplyDto,
    @CurrentUser() user: User,
  ) {
    return this.repliesService.editReply(replyId, editReplyDto, user);
  }

  /* 
    댓글 삭제 API
    url: questions/:id (DELETE)
  */
  @Delete('/:id')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({ name: 'id', required: true, description: 'Reply Id' })
  @ApiCreatedResponse({ description: 'id에 해당하는 댓글을 삭제한다' })
  @UseGuards(AccessTokenGuard)
  async deleteQuestion(
    @Param('id') questionId: number,
    @CurrentUser() user: User,
  ) {
    return this.repliesService.deleteReply(questionId, user);
  }
}
