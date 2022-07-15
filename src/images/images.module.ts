import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImagesRepository } from './repositories/images.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesRepository])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
