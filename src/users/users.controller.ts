import { UserRegisterDTO } from './dtos/user-register.dto';
import { UsersService } from './users.service';
import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  async list() {
    return this.UsersService.list();
  }

  @Post()
  async signUp(@Body() userRegisterDto: UserRegisterDTO): Promise<void> {
    return await this.UsersService.registerUser(userRegisterDto);
  }

  @Post('login')
  logIn(@Body() body: any) {
    return this.UsersService.logIn(body);
  }
}
