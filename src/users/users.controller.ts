import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //로그인 되어있는 유저 정보 조회
  @Get()
  @UseGuards(AccessTokenGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  //개발용 모든 유저 목록
  @Get('list')
  async list() {
    return this.usersService.list();
  }
}
