import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/*
Response body 형식.
res가 성공일 때 붙는 인터셉터 (post-request)

{
    success: true,
    response: { data },
    error: null
}
*/
@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        response: data,
        error: null,
      })),
    );
  }
}
