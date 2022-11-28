import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

const adm = process.env.ADMIN_URL;
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redirect/admin')
  @Redirect('http://15.164.39.106:8080/admin', 302)
  getDocs() {
    return { url: 'http://15.164.39.106:8080/admin' };
  }
}
