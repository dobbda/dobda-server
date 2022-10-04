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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { EditCommentDto } from './dtos/edit-comment.dto';
import { GetCommentsDto, GetCommentsOutput } from './dtos/get-comment.dto';

@Controller('comments')
@ApiTags('question 댓글 API<Answer children>')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /* 
    댓글 조회
    url: comments (GET)
  */
  @Get('/:aid')
  @ApiOperation({ summary: '댓글 조회' })
  @ApiCreatedResponse({
    description: '댓글여러개를 조회한다',
    type: GetCommentsOutput,
  })

  async getAnswers(@Param('aid') aid: number) {
    return this.commentsService.getComments(aid);
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

  /* 
    댓글 수정 API
    url: comments/:id (PATCH)
  */
  @Patch('/:id')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({ name: 'id', required: true, description: 'comments Id' })
  @ApiBody({ type: PartialType(CreateCommentDto) })
  @ApiCreatedResponse({ description: 'id에 해당하는 댓글을 수정한다' })
  @UseGuards(AccessTokenGuard)
  async editQuestion(
    @Param('id') commentId: number,
    @Body() editCommentDto: EditCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.editComment(commentId, editCommentDto, user);
  }

  /* 
    댓글 삭제 API
    url: questions/:id (DELETE)
  */
  @Delete('/:id')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({ name: 'id', required: true, description: 'Comment Id' })
  @ApiCreatedResponse({ description: 'id에 해당하는 댓글을 삭제한다' })
  @UseGuards(AccessTokenGuard)
  async deleteQuestion(
    @Param('id') questionId: number,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.deleteComment(questionId, user);
  }
}
