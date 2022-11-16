import { UsersRepository } from '../users/repositories/users.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsRepository } from 'src/questions/repositories/tags.repository';
import { OutSourcingController } from './outSourcings.controller';
import { OutSourcingService } from './outSourcings.service';
import { OutSourcingRepository } from './repositiories/outSourcing.repository';
import { OutSourcingTagRepository } from './repositiories/outSourcingTag.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagsRepository,
      OutSourcingRepository,
      OutSourcingTagRepository,
      UsersRepository,
    ]),
  ],
  controllers: [OutSourcingController],
  providers: [OutSourcingService],
})
export class OutSourcingModule {}
