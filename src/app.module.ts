import { EnquiriesModule } from './enquiries/enquiries.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostgresConfigModule } from './config/database/config.module';
import { PostgresConfigService } from './config/database/config.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { AuthModule } from './auth/auth.module';
import { OutSourcingModule } from './outSourcing/outSourcings.module';
import * as Joi from 'joi';
import { CommentsModule } from './comments/comments.module';
import { RepliesModule } from './replies/replies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.dev.env'
          : process.env.NODE_ENV === 'prod'
          ? '.prod.env'
          : '.test.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
        REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    UsersModule,
    CommonModule,
    QuestionsModule,
    AnswersModule,
    CommentsModule,
    AuthModule,
    OutSourcingModule,
    EnquiriesModule,
    RepliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
//미들웨어 추가
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); //모든 엔드포인터에 Logger 미들웨어 적용
  }
}
