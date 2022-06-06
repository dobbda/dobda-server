import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

/*
Response body 형식.
로직중 HttpException이 발생했을 때 붙는 커스텀 예외필터

{
    success: false,
    response: null,
    error: {
        message: '예외 메시지',
        status: 500,
    }
}
*/

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    //error가 object일 경우 네스트에서 자동 생성해준 에러 객체. 여기서 message를 직접 명시
    const error = exception.getResponse() as
      | string
      | { message: string | string[] };

    //개발자가 직접 인자값으로 에러를 핸들링해줬을 경우 (String) || 네스트에서 자동으로 에러처리를 해줬을 경우 (Object)
    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        response: null,
        error: {
          message: error,
          status,
        },
      });
    } else {
      response.status(status).json({
        success: false,
        response: null,
        error: {
          message: error.message,
          status,
        },
      });
    }
  }
}
