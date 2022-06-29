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
}
