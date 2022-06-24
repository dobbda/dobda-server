import { User } from './../entities/user.entity';
import { PickType } from '@nestjs/swagger';

//회원 정보에 대한 DTO.
//Github, 등등 연동시 추가 및 리팩토링 예정
export class UserLogInDTO extends PickType(User, [
  'email',
  'refreshToken',
] as const) {}
