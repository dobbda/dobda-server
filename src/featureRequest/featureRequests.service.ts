import { Injectable } from '@nestjs/common';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { TagsRepository } from 'src/questions/repositories/tags.repository';
import { CreateFeatureRequestDto } from './dtos/create-featureRequest.dto';
import { FeatureRequestRepository } from './repositiories/featureRequest.repository';
import { FeatureRequestTagRepository } from './repositiories/featureRequestTag.repository';

@Injectable()
export class FeatureRequestService {
  constructor(
    private readonly featureRequestRepository: FeatureRequestRepository,
    private readonly featureRequestTagRepository: FeatureRequestTagRepository,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async createFeatureRequest(
    createFeatureRequestDto: CreateFeatureRequestDto,
    createTagsDto: CreateTagsDto,
  ) {
    /*
      TODO: featureRequest와 user 관계 맺기
    */

    /* featureRequest생성 */
    const featureRequest =
      await this.featureRequestRepository.createFeatureRequest(
        createFeatureRequestDto,
      );
    /* tag생성 */
    const tags = await this.tagsRepository.createNonExistTags(createTagsDto);

    /* featureRequestTag 생성 */
    await this.featureRequestTagRepository.createFeatureRequestTags(
      featureRequest.id,
      tags,
    );
    return {
      result: true,
    };
  }
}
