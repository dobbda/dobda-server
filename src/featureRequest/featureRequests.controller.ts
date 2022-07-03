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
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateFeatureRequestDto } from './dtos/create-featureRequest.dto';
import { EditFeatureRequestDto } from './dtos/edit-featureRequest.dto';
import { GetFeatureRequestsDto } from './dtos/get-featureRequests.dto';
import { FeatureRequestService } from './featureRequests.service';

@Controller('feature-request')
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
  async getFeatureRequest(@Param('id') featureRequestId: number) {
    return this.featureRequestService.getFeatureRequest(featureRequestId);
  }

  /* 
    기능요청 수정 API
    url: feature-request/:id (PATCH)
  */
  @Patch('/:id')
  @UseGuards(AccessTokenGuard)
  async editFeatureRequest(
    @Param('id') featureRequestId: number,
    @Body('featureRequest') editFeatureRequestDto: EditFeatureRequestDto,
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
}
