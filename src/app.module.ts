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
import { PaymentModule } from './payment/payment.module';

import { Answer } from './answers/entities/answer.entity';
import { Enquiry } from './enquiries/entities/enquiry.entity';
import { Alarm } from './alarms/entities/alarm.entity';
import { OutSourcing } from './outSourcing/entities/outSourcing.entity';
import { OutSourcingTag } from './outSourcing/entities/outSourcingTag.entity';
import { Payment } from './payment/entities/payments.entity';
import { Question } from './questions/entities/question.entity';
import { QuestionTag } from './questions/entities/questionTag.entity';
import { Tag } from './questions/entities/tag.entity';
import { Reply } from './replies/entities/reply.entity';
import { User } from './users/entities/user.entity';
import { Comment } from './comments/entities/comment.entity';

import { AdminModule } from '@adminjs/nestjs';
import AdminJS from 'admin-bro';
import { Database, Resource } from 'admin-bro-typeorm';
import { NotisModule } from './notis/notis.module';
import { Noti } from './notis/entities/noti.entity';
AdminJS.registerAdapter({ Database, Resource });

const authenticate = async (email: string, password: string) => {
  const DEFAULT_ADMIN = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PWD,
  };
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

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

    AdminModule.createAdmin({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [
          User,
          OutSourcing,
          Question,
          OutSourcingTag,
          Tag,
          QuestionTag,
          Alarm,
          Answer,
          Comment,
          Payment,
          Enquiry,
          Reply,
          Noti,
        ],
        branding: {
          companyName: 'DOBDA',
          logo: 'https://dobda.s3.ap-northeast-2.amazonaws.com/logo.svg',
        },
      },
      auth: {
        authenticate,
        cookieName: 'ADMINS',
        cookiePassword: process.env.ACCESS_TOKEN_SECRET_KEY,
      },
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
    PaymentModule,
    NotisModule,
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
