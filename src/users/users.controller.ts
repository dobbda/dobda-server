import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //로그인 되어있는 유저 정보 조회
  @Get('myinfo')
  @ApiOperation({ summary: '현재 로그인 되어 있는 유저 정보 조회' })
  @ApiCreatedResponse({ description: '유저 정보', type: User })
  @UseGuards(AccessTokenGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get('/:id')
  @ApiOperation({ summary: ':id 유저 정보 조회' })
  @ApiCreatedResponse({ description: '유저 정보', type: User })
  async getUserProfile(@Param('id') id: number) {

    return this.usersService.getUserInfo(id);
  }

  //개발용 모든 유저 목록
  @Get('list')
  @ApiOperation({ summary: 'DB에 있는 모든 유저 정보 조회' })
  @ApiCreatedResponse({ description: '유저 리스트', type: [User] })
  async list() {
    return this.usersService.list();
  }
}
