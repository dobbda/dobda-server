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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { runInThisContext } from 'vm';
import { GetAlarmsOutput } from './dtos/get-alarm.dto';
import { AlarmsService } from './alarms.service';

@Controller('alarms')
@ApiTags('알림 API')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Get()
  @ApiOperation({ summary: '알림 가져오기' })
  @ApiCreatedResponse({ description: '알림을 가져온다', type: GetAlarmsOutput })
  @UseGuards(AccessTokenGuard)
  async getAlarms(@CurrentUser() user: User) {
    return this.alarmsService.getAlarm(user);
  }

  @Get('/all')
  @ApiOperation({ summary: '모든 알림 가져오기' })
  @ApiCreatedResponse({ description: '알림을 가져온다', type: GetAlarmsOutput })
  @UseGuards(AccessTokenGuard)
  async getAllAlarms(@CurrentUser() user: User) {
    return this.alarmsService.getAlarms(user);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '알림 체크' })
  @ApiParam({ name: 'id', required: true, description: 'Alarm Id' })
  @ApiCreatedResponse({
    description: 'id에 해당하는 알림을 체크 상태로 변경한다',
  })
  @UseGuards(AccessTokenGuard)
  async viewAlarm(@Param('id') id: number, @CurrentUser() user: User) {
    return this.alarmsService.viewAlarm(id, user);
  }
}
