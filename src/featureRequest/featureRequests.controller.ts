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
import { CreateFeatureRequestDto } from './dtos/create-featureRequest.dto';
import { EditFeatureRequestDto } from './dtos/edit-featureRequest.dto';
import { GetFeatureRequestsDto } from './dtos/get-featureRequests.dto';
import { FeatureRequestService } from './featureRequests.service';

@Controller('feature-request')
@ApiTags('기능요청 API')
export class FeatureRequestController {
  constructor(private readonly featureRequestService: FeatureRequestService) {}
  /* 
    기능요청 목록 API  (default page 1) (GET)
    url: questions 
    url: questions?title=${title} 
    url: questions?tag=${tag} 
    url: questions?page=${page}&title=${title} 
    url: questions?page=${page}&tag=${tag}
  */
  @Get()
  @ApiOperation({ summary: '기능요청 조회' })
  @ApiCreatedResponse({ description: '기능요청여러개를 조회한다' })
  async getFeatureRequests(
    @Query() getFeatureRequestsDto: GetFeatureRequestsDto,
  ) {
    return this.featureRequestService.getFeatureRequests(getFeatureRequestsDto);
  }

  /* 
    기능요청 등록 API
    url: feature-request (POST)
  */
  @Post()
  @ApiOperation({ summary: '기능 요청 등록' })
  @ApiCreatedResponse({ description: '가능요청을 등록한다' })
  @ApiBody({ type: CreateFeatureRequestDto })
  @UseGuards(AccessTokenGuard)
  async createFeatureRequest(
    @Body() createFeatureRequestDto: CreateFeatureRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.featureRequestService.createFeatureRequest(
      createFeatureRequestDto,
      user,
    );
  }

  /* 
    기능요청 상세 API
    url: feature-request/:id (GET)
  */
  @Get('/:id')
  @ApiOperation({ summary: '기능 요청 상세 조회' })
  @ApiCreatedResponse({ description: 'id에 해당하는 기능요청을 조회한다' })
  @ApiParam({ name: 'id', required: true, description: '기능요청 Id' })
  async getFeatureRequest(@Param('id') featureRequestId: number) {
    return this.featureRequestService.getFeatureRequest(featureRequestId);
  }

  /* 
    기능요청 수정 API
    url: feature-request/:id (PATCH)
  */
  @Patch('/:id')
  @ApiOperation({ summary: '기능요청 수정' })
  @ApiCreatedResponse({ description: 'id에 해당하는 기능요청을 수정한다' })
  @ApiParam({ name: 'id', required: true, description: '기능요청 Id' })
  @ApiBody({
    type: PartialType(CreateFeatureRequestDto),
  })
  @UseGuards(AccessTokenGuard)
  async editFeatureRequest(
    @Param('id') featureRequestId: number,
    @Body() editFeatureRequestDto: EditFeatureRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.featureRequestService.editFeatureRequest(
      featureRequestId,
      editFeatureRequestDto,
      user,
    );
  }

  /* 
    기능요청 삭제 API
    url: feature-request/:id (DELETE)
  */
  @Delete('/:id')
  @ApiOperation({ summary: '기능요청 삭제' })
  @ApiParam({ name: 'id', required: true, description: '기능요청 Id' })
  @ApiCreatedResponse({ description: 'id에 해당하는 기능요청을 삭제한다' })
  @UseGuards(AccessTokenGuard)
  async deleteFeatureRequest(
    @Param('id') featureRequestId: number,
    @CurrentUser() user: User,
  ) {
    return this.featureRequestService.deleteFeatureRequest(
      featureRequestId,
      user,
    );
  }

  /* 
    기능요청 조회수 수정 API
    url: feature-request/:id/watch (PATCH)
  */
  @Patch('/:id/watch')
  @ApiOperation({ summary: '기능요청 조회수 업데이트 API' })
  @ApiParam({ name: 'id', required: true, description: '기능요청 Id' })
  @ApiCreatedResponse({ description: '기능요청 게시글의 조회수를 1 올려준다.' })
  @UseGuards(AccessTokenGuard)
  async updateFeatureRequestWatch(@Param('id') featureRequestId: number) {
    return this.featureRequestService.updateFeatureRequestWatch(
      featureRequestId,
    );
  }
}
