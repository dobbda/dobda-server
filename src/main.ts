import { QueryFailedExceptionFilter } from './common/exceptions/query-exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from './common/utils/setupSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new QueryFailedExceptionFilter(),
  );

  app.use(cookieParser());

  //Swagger 관련 셋업
  setupSwagger(app);

  await app.listen(8080);
}
bootstrap();
