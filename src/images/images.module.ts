import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesRepository } from './repositories/images.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesRepository])],
})
export class ImagesModule {}
