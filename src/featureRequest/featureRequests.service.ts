import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { TagsRepository } from 'src/questions/repositories/tags.repository';
import { CreateFeatureRequestDto } from './dtos/create-featureRequest.dto';
import { FeatureRequestRepository } from './repositiories/featureRequest.repository';
import { FeatureRequestTagRepository } from './repositiories/featureRequestTag.repository';
import { EditFeatureRequestDto } from './dtos/edit-featureRequest.dto';
import { GetFeatureRequestsDto } from './dtos/get-featureRequests.dto';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class FeatureRequestService {
  constructor(
    private readonly featureRequestRepository: FeatureRequestRepository,
    private readonly featureRequestTagRepository: FeatureRequestTagRepository,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async findFeatureRequestOrError(
    featureRequestId: number,
    getAuthor?: boolean,
  ) {
    const featureRequest =
      await this.featureRequestRepository.findOneFeatureRequestWithId(
        featureRequestId,
        getAuthor,
      );
    if (!featureRequest) {
      throw new NotFoundException('id에 해당하는 feature-request가 없습니다.');
    }
    return featureRequest;
  }

  async getFeatureRequests({ page, title, tagId }: GetFeatureRequestsDto) {
    const { total, featureRequests } =
      await this.featureRequestRepository.findAll(page, title, tagId);

    /* featureRequest이 가지고있는 tag 넣기 */
    const result = await Promise.all(
      featureRequests.map(async (featureRequest) => {
        const tags = await this.tagsRepository.allTagsInFeatureRequest(
          featureRequest.id,
        );
        return { ...featureRequest, tags };
      }),
    );

    return {
      result,
      totalPages: Math.ceil(total / 20),
    };
  }

  async createFeatureRequest(
    { tagNames, ...rest }: CreateFeatureRequestDto,
    user: User,
  ) {
    /* featureRequest생성 */
    const featureRequest =
      await this.featureRequestRepository.createFeatureRequest(rest, user);

    /* tag생성 */
    const tags = await this.tagsRepository.createNonExistTags(tagNames);

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
    const result = await this.findFeatureRequestOrError(featureRequestId, true);
    const tags = await this.tagsRepository.allTagsInFeatureRequest(
      featureRequestId,
    );
    return { featureRequest: { ...result, tags } };
  }

  async editFeatureRequest(
    featureRequestId: number,
    { tagNames, ...editFeatureRequest }: EditFeatureRequestDto,
    user: User,
  ) {
    const featureRequest = await this.findFeatureRequestOrError(
      featureRequestId,
    );
    /* featureRequest을 로그인한 user가 만든게 맞는지 check */
    if (featureRequest.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    await this.featureRequestRepository.save([
      { id: featureRequestId, ...editFeatureRequest },
    ]);
    if (tagNames) {
      await this.featureRequestTagRepository.delete({
        featureRequestId: featureRequest.id,
      });
      const tags = await this.tagsRepository.createNonExistTags(tagNames);
      await this.featureRequestTagRepository.createFeatureRequestTags(
        featureRequest.id,
        tags,
      );
    }
    return true;
  }

  async deleteFeatureRequest(featureRequestId: number, user: User) {
    const featureRequest = await this.findFeatureRequestOrError(
      featureRequestId,
    );
    /* featureRequest을 로그인한 user가 만든게 맞는지 check */
    if (featureRequest.authorId !== user.id) {
      throw new BadRequestException('작성자만 삭제가 가능합니다');
    }
    await this.featureRequestRepository.delete({ id: featureRequest.id });
    return true;
  }
}
