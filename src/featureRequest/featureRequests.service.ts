import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { TagsRepository } from 'src/questions/repositories/tags.repository';
import { CreateFeatureRequestDto } from './dtos/create-featureRequest.dto';
import { FeatureRequestRepository } from './repositiories/featureRequest.repository';
import { FeatureRequestTagRepository } from './repositiories/featureRequestTag.repository';
import { Progress } from './entities/featureRequest.entity';
import { EditFeatureRequestDto } from './dtos/edit-featureRequest.dto';
@Injectable()
export class FeatureRequestService {
  constructor(
    private readonly featureRequestRepository: FeatureRequestRepository,
    private readonly featureRequestTagRepository: FeatureRequestTagRepository,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async findFeatureRequestOrError(featureRequestId: number) {
    const featureRequest =
      await this.featureRequestRepository.findOneFeatureRequestWithId(
        featureRequestId,
      );
    if (!featureRequest) {
      throw new NotFoundException('id에 해당하는 feature-request가 없습니다.');
    }
    return featureRequest;
  }

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

  async getFeatureRequest(featureRequestId: number) {
    const result = await this.findFeatureRequestOrError(featureRequestId);
    const tags = await this.tagsRepository.allTagsInFeatureRequest(
      featureRequestId,
    );
    return { featureRequest: { ...result, tags } };
  }

  async editFeatureRequest(
    featureRequestId: number,
    { tagNames, ...editFeatureRequest }: EditFeatureRequestDto,
  ) {
    const featureRequest = await this.findFeatureRequestOrError(
      featureRequestId,
    );
    /*
      TODO: featureRequest을 로그인한 user가 만든게 맞는지 check
    */
    await this.featureRequestRepository.save([
      { id: featureRequestId, ...editFeatureRequest },
    ]);
    if (tagNames) {
      await this.featureRequestTagRepository.delete({
        featureRequestId: featureRequest.id,
      });
      const tags = await this.tagsRepository.createNonExistTags({ tagNames });
      await this.featureRequestTagRepository.createFeatureRequestTags(
        featureRequest.id,
        tags,
      );
    }
    return true;
  }

  async deleteFeatureRequest(featureRequestId: number) {
    const featureRequest = await this.findFeatureRequestOrError(
      featureRequestId,
    );
    /*
      TODO: featureRequest을 로그인한 user가 만든게 맞는지 check
    */
    await this.featureRequestRepository.delete({ id: featureRequest.id });
    return true;
  }
}
