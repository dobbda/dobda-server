import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CoinService } from './coin.service';
import { SendCoinDto } from './dtos/send-coin.dto';

@Controller('coin')
@ApiTags('코인 API')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  /* 
    코인을 전송한다.
    url: coin (POST)
  */
  @Post()
  @ApiOperation({ summary: '코인 전송' })
  @ApiBody({ type: SendCoinDto })
  @ApiCreatedResponse({ description: '댓글을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async sendCoin(@Body() sendCoinDto: SendCoinDto, @CurrentUser() user: User) {
    return this.coinService.sendCoin(sendCoinDto, user);
  }
}
