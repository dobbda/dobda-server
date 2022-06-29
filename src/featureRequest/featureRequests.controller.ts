import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { CreateFeatureRequestDto } from './dtos/create-featureRequest.dto';
import { EditFeatureRequestDto } from './dtos/edit-featureRequest.dto';
import { FeatureRequestService } from './featureRequests.service';

@Controller('feature-request')
export class FeatureRequestController {
  constructor(private readonly featureRequestService: FeatureRequestService) {}

  /* 
    기능요청 등록 API
    url: feature-request (POST)
  */
  @Post()
  async createFeatureRequest(
    @Body('featureRequest') createFeatureRequestDto: CreateFeatureRequestDto,
    @Body('tag') createTagsDto: CreateTagsDto,
  ) {
    console.log(createFeatureRequestDto);
    return this.featureRequestService.createFeatureRequest(
      createFeatureRequestDto,
      createTagsDto,
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
  async editFeatureRequest(
    @Param('id') featureRequestId: number,
    @Body('featureRequest') editFeatureRequestDto: EditFeatureRequestDto,
  ) {
    return this.featureRequestService.editFeatureRequest(
      featureRequestId,
      editFeatureRequestDto,
    );
  }

  /* 
    기능요청 삭제 API
    url: feature-request/:id (DELETE)
  */
  @Delete('/:id')
  async deleteFeatureRequest(@Param('id') featureRequestId: number) {
    return this.featureRequestService.deleteFeatureRequest(featureRequestId);
  }
}
