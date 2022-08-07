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
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { GetAnswersDto, GetAnswersOutput } from './dtos/get-answer.dto';
import { NotisService } from './notis.service';

@Controller('notis')
@ApiTags('알림 API')
export class NotisController {
  constructor(private readonly notisService: NotisService) {}
}
