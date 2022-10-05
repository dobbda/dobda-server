import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { GetAlarmsOutput } from 'src/alarms/dtos/get-alarm.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Noti } from './entities/noti.entity';
import { NotisService } from './notis.service';

@Controller('notis')
export class NotisController {
  constructor(private readonly notisService: NotisService) {}
  @Get()
  @ApiOperation({ summary: '공지사항 가져오기' })
  async getAlarms() {
    return this.notisService.getNotis();
  }
}
