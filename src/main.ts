import { QueryFailedExceptionFilter } from './common/exceptions/query-exception.filter';
import { QueryFailedError } from 'typeorm';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new QueryFailedExceptionFilter(),
  );

  await app.listen(3000);
}
bootstrap();
