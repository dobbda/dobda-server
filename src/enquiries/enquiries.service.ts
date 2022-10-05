import { OutSourcingRepository } from '../outSourcing/repositiories/outSourcing.repository';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlarmsService } from 'src/alarms/alarms.service';
import { User } from 'src/users/entities/user.entity';
import { CreateEnquiryDto } from './dtos/create-enquiry.dto';
import { GetEnquiryDto } from './dtos/get-enquiry.dto';
import { EnquiriesRepository } from './repositories/enquiries.repository';

@Injectable()
export class EnquiriesService {
  constructor(
    private readonly enquiryRepository: EnquiriesRepository,
    private readonly outSourceRepository: OutSourcingRepository,
    private readonly alarmsService: AlarmsService,
  ) {}

  async getEnquiries(oid: number) {
    console.log(oid);
    const enquiries = await this.enquiryRepository
      .createQueryBuilder('enquiry')
      .where({ outSourcing: oid })
      .leftJoin('enquiry.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
      .orderBy('enquiry.updatedAt', 'DESC')
      .getMany();
    return {
      enquiries,
    };
  }

  async createEnquiry({ content, oid }: CreateEnquiryDto, user: User) {
    /* outSourcing 가져오기 */
    const outSourcing = await this.outSourceRepository.findOne(oid);

    if (outSourcing === null) {
      throw new NotFoundException('잘못된 접근입니다.');
    }

    const enquiry = await this.enquiryRepository.createEnquiry(
      { content },
      outSourcing,
      user,
    );

    await this.outSourceRepository.update(oid, {
      enquiriesCount: outSourcing.enquiriesCount + 1,
    });
    // await this.alarmsService.addEnquiryAlarm(enquiry, user);
    return true;
  }

  async selectEnquiry(enquiryId: number, user: User) {}

  async editEnquiry(content: string, oid: number, user: User) {
    const enquiry = await this.enquiryRepository.findOne({ id: oid });
    if (user.id !== enquiry.authorId) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (enquiry.repliesCount) {
      throw new BadRequestException('댓글이 달린 답변은 수정이 불가능합니다.');
    }
    if (enquiry.selected) {
      throw new BadRequestException('채택된 답변은 수정이 불가능합니다.');
    }

    const newEnquiry = await this.enquiryRepository.save({
      id: oid,
      content: content,
    });
    return newEnquiry;
  }

  async deleteEnquiry(oid: number, user: User) {
    const enquiry = await this.enquiryRepository.findOne({ id: oid });
    const outSourcing = await this.outSourceRepository.findOne(
      enquiry?.outSourcingId,
    );

    if (user.id !== enquiry.authorId) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (enquiry.repliesCount) {
      throw new BadRequestException('댓글이 달린 답변은 수정이 불가능합니다.');
    }
    if (enquiry.selected) {
      throw new BadRequestException('채택된 답변은 수정이 불가능합니다.');
    }
    await this.outSourceRepository.update(outSourcing.id, {
      enquiriesCount: outSourcing.enquiriesCount - 1,
    });

    await this.enquiryRepository.delete({
      id: oid,
    });

    await this.outSourceRepository.update(oid, { enquiriesCount: () => '- 1' });

    return { success: true };
  }
}
