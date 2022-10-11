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
  @Redirect('http://52.79.237.3:8080/admin', 302)
  getDocs() {
    console.log(process.env.ADMIN_URL, adm);
    return { url: 'http://52.79.237.3:8080/admin' };
  }
}
