import { User } from './../entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class UserLogInDTO extends PickType(User, ['email'] as const) {}
