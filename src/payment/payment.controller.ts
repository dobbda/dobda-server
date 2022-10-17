import { PaymentService } from './payment.service';
import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { GetAlarmsOutput } from 'src/alarms/dtos/get-alarm.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('payments')
@ApiTags('코인관리 & 코인히스토리 API')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('history/:page')
  @ApiOperation({ summary: '알림 가져오기' })
  @ApiCreatedResponse({ description: '알림을 가져온다', type: GetAlarmsOutput })
  @UseGuards(AccessTokenGuard)
  async getCoinHistory(@CurrentUser() user: User, @Param('page') page: number) {
    return this.paymentService.findAllCoinHistory(user, page);
  }
  @Get('reserv/:page')
  @ApiOperation({ summary: '알림 가져오기' })
  @ApiCreatedResponse({ description: '알림을 가져온다', type: GetAlarmsOutput })
  @UseGuards(AccessTokenGuard)
  async getCoinReserv(@CurrentUser() user: User, @Param('page') page: number) {
    return this.paymentService.findAllCoinReserv(user, page);
  }
}
