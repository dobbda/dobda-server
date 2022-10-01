import { Reply } from 'src/replies/entities/reply.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Answer } from 'src/answers/entities/answer.entity';
import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { OutSourcingTag } from 'src/outSourcing/entities/outSourcingTag.entity';
import { Question } from 'src/questions/entities/question.entity';
import { QuestionTag } from 'src/questions/entities/questionTag.entity';
import { Tag } from 'src/questions/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Image } from 'src/images/entities/image.entity';
import { Noti } from 'src/noti/entities/noti.entity';
import { Enquiry } from 'src/enquiries/entities/enquiry.entity';
import { Payment } from 'src/payment/entities/payments.entity';
@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      username: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      port: +this.configService.get<number>('POSTGRES_PORT'),
      host: this.configService.get<string>('POSTGRES_HOST'),
      database: this.configService.get<string>('POSTGRES_DB'),
      synchronize: true,
      logging: true,
      entities: [
        User,
        OutSourcing,
        OutSourcingTag,
        Tag,
        Question,
        QuestionTag,
        Noti,
        Answer,
        Comment,
        Payment,
        Image,
        Enquiry,
        Reply,
      ],
      migrations: ['src/migration/**/*.ts'],
      subscribers: ['src/subscriber/**/*.ts'],
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscriber',
      },
    };
  }
}
