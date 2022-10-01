import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dtos/create-enquiry.dto';
import { GetEnquiryDto, GetEnquiriesOutput } from './dtos/get-enquiry.dto';

@Controller('enquiries')
@ApiTags('outSourcing 문의 API<reply parents>')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Get('/:oid')
  @ApiOperation({ summary: '문의 조회' })
  @ApiCreatedResponse({
    description: '문의 조회',
    type: GetEnquiriesOutput,
  })
  async getEnquiries(@Param('oid') getEnquiryDto: GetEnquiryDto) {
    return this.enquiriesService.getEnquiries(getEnquiryDto);
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
    return this.enquiriesService.createEnquiry(createEnquiryDto, user);
  }

  @Get('/select/:id')
  @ApiOperation({ summary: '문의 선택' })
  @ApiParam({ name: 'id', required: true, description: 'enquiry Id' })
  @ApiCreatedResponse({
    description: 'id에 해당하는 문의 글에 결제프로세스를 진행한다',
  })
  @UseGuards(AccessTokenGuard)
  async acceptEnquiry(
    @Param('id') enquiryId: number,
    @CurrentUser() user: User,
  ) {
    return this.enquiriesService.selectEnquiry(enquiryId, user);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '문의 수정' })
  @ApiBody({ type: '{content:string}' })
  @ApiCreatedResponse({ description: '문의을 등록한다' })
  @UseGuards(AccessTokenGuard)
  async editEnquiry(
    @Param('id') aid: number,
    @Body('content') content: string,
    @CurrentUser() user: User,
  ) {
    return this.enquiriesService.editEnquiry(content, aid, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '문의삭제' })
  @ApiCreatedResponse({ description: '문의를 삭제한다' })
  @UseGuards(AccessTokenGuard)
  async deledteEnquiry(@Param('id') aid: number, @CurrentUser() user: User) {
    return this.enquiriesService.deleteEnquiry(aid, user);
  }
}
