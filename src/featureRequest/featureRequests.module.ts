import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsRepository } from 'src/questions/repositories/tags.repository';
import { FeatureRequestController } from './featureRequests.controller';
import { FeatureRequestService } from './featureRequests.service';
import { FeatureRequestRepository } from './repositiories/featureRequest.repository';
import { FeatureRequestTagRepository } from './repositiories/featureRequestTag.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagsRepository,
      FeatureRequestRepository,
      FeatureRequestTagRepository,
    ]),
  ],
  controllers: [FeatureRequestController],
  providers: [FeatureRequestService],
})
export class FeatureRequestModule {}
