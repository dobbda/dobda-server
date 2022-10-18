import {
  Body,
  Controller,
  Delete,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto } from './dtos/create-enquiry.dto';
import { GetEnquiryDto, GetEnquiryOutput } from './dtos/get-enquiry.dto';

@Controller('enquiry')
@ApiTags('outSourcing 문의 API<reply parents>')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Patch('/pick')
  @ApiOperation({ summary: '유저선택' })
  @UseGuards(AccessTokenGuard)
  async acceptEnquiry(
    @CurrentUser() user: User,
    @Query('oid') oid: number,
    @Query('eid') eid: number,
  ) {
    return this.enquiryService.pickEnquiry(eid, oid, user);
  }

  @Get('/:oid')
  @ApiOperation({ summary: '문의 조회' })
  @ApiCreatedResponse({
    description: '문의 조회',
    type: GetEnquiryOutput,
  })
  async getEnquiry(@Param('oid') oid: number) {
    return this.enquiryService.getEnquiry(oid);
  }

  @Post()
  @ApiOperation({ summary: '문의 등록' })
  @ApiBody({ type: CreateEnquiryDto })
  @ApiCreatedResponse({ description: '문의을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async createEnquiry(
    @Body() createEnquiryDto: CreateEnquiryDto,
    @CurrentUser() user: User,
  ) {
    return this.enquiryService.createEnquiry(createEnquiryDto, user);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '문의 수정' })
  @ApiBody({ type: '{content:string}' })
  @ApiCreatedResponse({ description: '문의을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async editEnquiry(
    @Param('id') eid: number,
    @Body('content') content: string,
    @CurrentUser() user: User,
  ) {
    return this.enquiryService.editEnquiry(content, eid, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '문의삭제' })
  @ApiCreatedResponse({ description: '문의를 삭제한다' })
  @UseGuards(AccessTokenGuard)
  async deledteEnquiry(@Param('id') aid: number, @CurrentUser() user: User) {
    return this.enquiryService.deleteEnquiry(aid, user);
  }
}
