import { Progress } from './../outSourcing/types/progressType';
import { UsersRepository } from './../users/users.repository';
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
import { EnquiryRepository } from './repositories/enquiry.repository';

@Injectable()
export class EnquiryService {
  constructor(
    private readonly enquiryRepository: EnquiryRepository,
    private readonly outSourceRepository: OutSourcingRepository,
    private readonly alarmsService: AlarmsService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getEnquiry(oid: number) {
    const enquiry = await this.enquiryRepository
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
      enquiry,
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
      enquiryCount: outSourcing.enquiryCount + 1,
    });

    if (user.id !== outSourcing.authorId) {
      /**알람 */
      const toUsser = await this.usersRepository.findOne(outSourcing.authorId);
      await this.alarmsService.addEnquiryAlarm(enquiry, outSourcing, toUsser);
    }
    return true;
  }

  async editEnquiry(content: string, oid: number, user: User) {
    const enquiry = await this.enquiryRepository.findOne({ id: oid });
    if (user.id !== enquiry.authorId) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (enquiry.repliesCount) {
      throw new BadRequestException('댓글이 달린 답변은 수정이 불가능합니다.');
    }
    if (enquiry.picked) {
      throw new BadRequestException('채택된 답변은 수정이 불가능합니다.');
    }
    enquiry.content = content;
    const newEnquiry = await this.enquiryRepository.save(enquiry);
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
    if (enquiry.picked) {
      throw new BadRequestException('채택된 답변은 수정이 불가능합니다.');
    }
    await this.outSourceRepository.update(outSourcing.id, {
      enquiryCount: outSourcing.enquiryCount - 1,
    });

    await this.enquiryRepository.delete({
      id: oid,
    });

    await this.outSourceRepository.update(oid, { enquiryCount: () => '- 1' });

    return { success: true };
  }

  async pickEnquiry(eid: number | string, oid: number | string, user: User) {
    const enquiry = await this.enquiryRepository.findOne(eid);
    if (enquiry.picked) {
      throw new BadRequestException('이미 선택한 유저가 있습니다.');
    }

    const outSourcing = await this.outSourceRepository.findOne(oid);
    const toUsser = await this.usersRepository.findOne(enquiry.authorId);
    enquiry.picked = true;
    outSourcing.pickEnquiry = enquiry;
    outSourcing.progress = Progress.Pick;
    await this.enquiryRepository.save(enquiry);
    await this.outSourceRepository.save(outSourcing);
    await this.alarmsService.addPickEnquiryAlarm(enquiry, outSourcing, toUsser);
    return true;
  }
}
