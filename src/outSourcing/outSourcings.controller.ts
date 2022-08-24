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
  PickType,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateOutSourcingDto } from './dtos/create-outSourcing.dto';
import { EditOutSourcingDto } from './dtos/edit-outSourcing.dto';
import { GetOutSourcingsDto } from './dtos/get-outSourcings.dto';
import { OutSourcingService } from './outSourcings.service';

@Controller('outsource')
@ApiTags('외주 API')
export class OutSourcingController {
  constructor(private readonly outSourcingService: OutSourcingService) {}
  /* 
    외주 목록 API  (default page 1) (GET)
    url: questions 
    url: questions?title=${title} 
    url: questions?tag=${tag} 
    url: questions?page=${page}&title=${title} 
    url: questions?page=${page}&tag=${tag}
  */
  @Get()
  @ApiOperation({ summary: '외주 조회' })
  @ApiCreatedResponse({ description: '외주여러개를 조회한다' })
  async getOutSourcings(@Query() getOutSourcingsDto: GetOutSourcingsDto) {
    return this.outSourcingService.getOutSourcings(getOutSourcingsDto);
  }

  /* 
    외주 등록 API
    url: feature-request (POST)
  */
  @Post()
  @ApiOperation({ summary: '기능 요청 등록' })
  @ApiCreatedResponse({ description: '가능요청을 등록한다' })
  @ApiBody({ type: CreateOutSourcingDto })
  @UseGuards(AccessTokenGuard)
  async createOutSourcing(
    @Body() createOutSourcingDto: CreateOutSourcingDto,
    @CurrentUser() user: User,
  ) {
    return this.outSourcingService.createOutSourcing(
      createOutSourcingDto,
      user,
    );
  }

  /* 
    외주 상세 API
    url: feature-request/:id (GET)
  */
  @Get('/:id')
  @ApiOperation({ summary: '기능 요청 상세 조회' })
  @ApiCreatedResponse({ description: 'id에 해당하는 외주을 조회한다' })
  @ApiParam({ name: 'id', required: true, description: '외주 Id' })
  async getOutSourcing(@Param('id') outSourcingId: number) {
    return this.outSourcingService.getOutSourcing(outSourcingId);
  }

  /* 
    외주 수정 API
    url: feature-request/:id (PATCH)
  */
  @Patch('/:id')
  @ApiOperation({ summary: '외주 수정' })
  @ApiCreatedResponse({ description: 'id에 해당하는 외주을 수정한다' })
  @ApiParam({ name: 'id', required: true, description: '외주 Id' })
  @ApiBody({
    type: PartialType(CreateOutSourcingDto),
  })
  @UseGuards(AccessTokenGuard)
  async editOutSourcing(
    @Param('id') outSourcingId: number,
    @Body() editOutSourcingDto: EditOutSourcingDto,
    @CurrentUser() user: User,
  ) {
    return this.outSourcingService.editOutSourcing(
      outSourcingId,
      editOutSourcingDto,
      user,
    );
  }

  /* 
    외주 조회수 수정 API
    url: feature-request/:id/watch (PATCH)
  */
  @Patch('/:id/watch')
  @ApiOperation({ summary: '외주 조회수 업데이트 API' })
  @ApiParam({ name: 'id', required: true, description: '외주 Id' })
  @ApiCreatedResponse({ description: '외주 게시글의 조회수를 1 올려준다.' })
  @UseGuards(AccessTokenGuard)
  async updateOutSourcingWatch(@Param('id') outSourcingId: number) {
    return this.outSourcingService.updateOutSourcingWatch(outSourcingId);
  }

  /* 
    외주 삭제 API
    url: feature-request/:id (DELETE)
  */
  @Delete('/:id')
  @ApiOperation({ summary: '외주 삭제' })
  @ApiParam({ name: 'id', required: true, description: '외주 Id' })
  @ApiCreatedResponse({ description: 'id에 해당하는 외주을 삭제한다' })
  @UseGuards(AccessTokenGuard)
  async deleteOutSourcing(
    @Param('id') outSourcingId: number,
    @CurrentUser() user: User,
  ) {
    return this.outSourcingService.deleteOutSourcing(outSourcingId, user);
  }
}
