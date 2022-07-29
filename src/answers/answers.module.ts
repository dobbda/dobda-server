import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnswersRepository } from './repositories/answers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AnswersRepository])],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
