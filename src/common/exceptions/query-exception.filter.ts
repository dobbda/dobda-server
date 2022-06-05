import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

/*
  Response body 형식.
  로직중 QueryFailedError가 발생했을 때 붙는 커스텀 예외필터
  
  {
      success: false,
      response: null,
      error: {
          message: '예외 메시지',
          status: 400,
      }
  }
  */

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    Logger.log(exception);

    response.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      response: null,
      error: {
        message: exception,
        status: 400,
      },
    });
  }
}
