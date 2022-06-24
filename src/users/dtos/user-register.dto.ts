import { User } from 'src/users/entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class UserRegisterDTO extends PickType(User, [
  'email',
  'name',
  'nickname',
] as const) {}
