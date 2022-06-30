import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Answer } from 'src/answers/entities/answer.entity';
import { FeatureRequest } from 'src/featureRequest/entities/featureRequest.entity';
import { FeatureRequestTag } from 'src/featureRequest/entities/featureRequestTag.entity';
import { Question } from 'src/questions/entities/question.entity';
import { QuestionTag } from 'src/questions/entities/questionTag.entity';
import { Tag } from 'src/questions/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: +this.configService.get<number>('DB_PORT'),
      host: this.configService.get<string>('DB_HOST'),
      database: this.configService.get<string>('DB_NAME'),
      synchronize: true,
      logging: true,
      entities: [
        User,
        FeatureRequest,
        FeatureRequestTag,
        Tag,
        Question,
        QuestionTag,
        Answer,
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
