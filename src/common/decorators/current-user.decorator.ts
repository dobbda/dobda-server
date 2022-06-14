import { JwtPayload } from './../../auth/jwt/types/jwt.payload';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    //CurrentUser에 매개변수가 들어가면 해당 인수를, 없으면 그냥 유저를 리턴
    if (!data) return request.user;
    return request.user[data];
  },
);
