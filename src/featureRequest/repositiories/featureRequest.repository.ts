import { EntityRepository, Repository } from 'typeorm';
import { CreateFeatureRequestDto } from '../dtos/create-featureRequest.dto';
import { FeatureRequest } from '../entities/featureRequest.entity';

@EntityRepository(FeatureRequest)
export class FeatureRequestRepository extends Repository<FeatureRequest> {
  async createFeatureRequest(createFeatureRequestDto: CreateFeatureRequestDto) {
    return this.save(this.create({ ...createFeatureRequestDto }));
  }

  async findOneFeatureRequestWithId(featureRequestId: number) {
    return this.createQueryBuilder('featureRequest')
      .where('featureRequest.id = :featureRequestId', { featureRequestId })
      .leftJoin('featureRequest.author', 'author')
      .addSelect(['author.email', 'author.nickname'])
      .getOne();
  }

  async findAll(page: number, title?: string, tagId?: number) {
    const featureRequestQuery = this.createQueryBuilder('featureRequest')
      .take(20)
      .skip((page - 1) * 20);
    if (title) {
      featureRequestQuery.where('featureRequest.title like :title', {
        title: `%${title}%`,
      });
    }
    if (tagId) {
      featureRequestQuery
        .leftJoin('featureRequest.featureRequestTags', 'featureRequestTag')
        .andWhere('featureRequestTag.tagId = :tagId', { tagId });
    }
    const [featureRequests, total] =
      await featureRequestQuery.getManyAndCount();
    return {
      total,
      featureRequests,
    };
  }
}
