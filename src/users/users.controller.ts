import { CreatePortfolio } from './dtos/portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserUpdateDTO } from './dtos/user-update.dto';

@Controller('users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // portfolio ///////////////////////////////////////////////////////
  @Post('pf')
  @ApiOperation({ summary: '현재 로그인 되어 있는 유저 정보 조회' })
  @UseGuards(AccessTokenGuard)
  async createPortfolio(
    @Body() pfData: CreatePortfolio,
    @CurrentUser() user: User,
  ) {
    return await this.usersService.createPortfolio(pfData, user);
  }

  @Patch('pf/:id')
  @ApiOperation({ summary: '현재 로그인 되어 있는 유저 정보 조회' })
  @UseGuards(AccessTokenGuard)
  async updatePortfolio(
    @Body() pfData: CreatePortfolio,
    @CurrentUser() user: User,
    @Param('id') id: number,
  ) {
    return await this.usersService.updatePortfolio(pfData, id, user);
  }

  @Get('/pf')
  @ApiOperation({ summary: 'user portfolio' })
  async findOne(@Query('userId') userId: number) {
    return this.usersService.getOnePortfolio(userId);
  }

  @Get('pfs')
  @ApiOperation({ summary: 'portfolio list' })
  async findAll(@Query('page') page: number) {
    return this.usersService.getAllPortfolio(page);
  }

  //로그인 되어있는 유저 정보 조회
  @Get('myinfo')
  @ApiOperation({ summary: '현재 로그인 되어 있는 유저 정보 조회' })
  @ApiCreatedResponse({ description: '유저 정보', type: User })
  @UseGuards(AccessTokenGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }
  // portfolio end ///////////////////////////////////////////////////////

  @Patch('myinfo')
  @ApiOperation({ summary: '현재 로그인 되어 있는 유저 정보 조회' })
  @ApiCreatedResponse({ description: '유저 정보', type: User })
  @UseGuards(AccessTokenGuard)
  async updateMyInfo(
    @Body() userUpdateDto: UserUpdateDTO,
    @CurrentUser() currentUser: User,
  ) {
    console.log(userUpdateDto);
    return await this.usersService.userUpdate(userUpdateDto, currentUser);
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
