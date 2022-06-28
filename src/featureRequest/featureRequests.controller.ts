import { Body, Controller, Post } from '@nestjs/common';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { CreateFeatureRequestDto } from './dtos/create-featureRequest.dto';
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
    @Body('question') createFeatureRequestDto: CreateFeatureRequestDto,
    @Body('tag') createTagsDto: CreateTagsDto,
  ) {
    return this.featureRequestService.createFeatureRequest(
      createFeatureRequestDto,
      createTagsDto,
    );
  }
}
