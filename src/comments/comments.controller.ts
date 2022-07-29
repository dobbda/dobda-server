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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { GetCommentsDto, GetCommentsOutput } from './dtos/get-comment.dto';

@Controller('comments')
@ApiTags('댓글 API')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /* 
    댓글 조회
    url: comments (GET)
  */
  @Get()
  @ApiOperation({ summary: '댓글 조회' })
  @ApiCreatedResponse({
    description: '댓글여러개를 조회한다',
    type: GetCommentsOutput,
  })
  async getAnswers(@Query() getCommentsDto: GetCommentsDto) {
    return this.commentsService.getComments(getCommentsDto);
  }

  /* 
    댓글 등록 API
    url: comments (POST)
  */
  @Post()
  @ApiOperation({ summary: '댓글 등록' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ description: '댓글을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async createQuestion(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.createComment(createCommentDto, user);
  }
}
