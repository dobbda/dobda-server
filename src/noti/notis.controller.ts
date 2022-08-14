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
import { GetNotisOutput } from './dtos/get-noti.dto';
import { NotisService } from './notis.service';

@Controller('notis')
@ApiTags('알림 API')
export class NotisController {
  constructor(private readonly notisService: NotisService) {}

  @Get()
  @ApiOperation({ summary: '알림 가져오기' })
  @ApiCreatedResponse({ description: '알림을 가져온다', type: GetNotisOutput })
  @UseGuards(AccessTokenGuard)
  async getNotis(@CurrentUser() user: User) {
    return this.notisService.getNotis(user);
  }

  @Get('/all')
  @ApiOperation({ summary: '모든 알림 가져오기' })
  @ApiCreatedResponse({ description: '알림을 가져온다', type: GetNotisOutput })
  @UseGuards(AccessTokenGuard)
  async getAllNotis(@CurrentUser() user: User) {
    return this.notisService.getAllNotis(user);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '알림 체크' })
  @ApiParam({ name: 'id', required: true, description: 'Noti Id' })
  @ApiCreatedResponse({
    description: 'id에 해당하는 알림을 체크 상태로 변경한다',
  })
  @UseGuards(AccessTokenGuard)
  async viewNoti(@Param('id') notiId: number, @CurrentUser() user: User) {
    return this.notisService.viewNoti(notiId, user);
  }
}
