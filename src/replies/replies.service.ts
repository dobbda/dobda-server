import { OutSourcingRepository } from './../outSourcing/repositiories/outSourcing.repository';
import { OutSourcing } from './../outSourcing/entities/outSourcing.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AnswersRepository } from 'src/answers/repositories/answers.repository';
import { EnquiryRepository } from 'src/enquiry/repositories/enquiry.repository';
import { AlarmsService } from 'src/alarms/alarms.service';
import { User } from 'src/users/entities/user.entity';
import { CreateReplyDto } from './dtos/create-reply.dto';
import { EditReplyDto } from './dtos/edit-reply.dto';
import { GetReplyDto } from './dtos/get-reply.dto';
import { RepliesRepository } from './repositories/replies.repository';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class RepliesService {
  constructor(
    private readonly repliesRepository: RepliesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly enquiryRepository: EnquiryRepository,
    private readonly outSourcingRepository: OutSourcingRepository,
    private readonly alarmsService: AlarmsService,
  ) {}

  async getReplies(eid: number) {
    const replies = await this.repliesRepository
      .createQueryBuilder('reply')
      .where({ enquiry: eid })
      .leftJoin('reply.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
      .orderBy('reply.updatedAt', 'DESC')
      .getMany();
    return {
      replies,
    };
  }

  async createReply({ eid, content }: CreateReplyDto, user: User) {
    /* Question 가져오기 */
    const enquiry = await this.enquiryRepository.findOne(eid);
    const outSourcing = await this.outSourcingRepository.findOne(
      enquiry.outSourcingId,
    );

    if (!enquiry) return;

    const reply = await this.repliesRepository.createReply(
      { content },
      enquiry,
      user,
    );

    await this.enquiryRepository.update(enquiry.id, {
      repliesCount: enquiry.repliesCount + 1,
    });

    if (user.id !== outSourcing.authorId) {
      const toUser = await this.usersRepository.findOne(outSourcing.authorId);
      await this.alarmsService.addReplyAlarm(reply, outSourcing, toUser);
    }
    if (user.id !== enquiry.authorId) {
      const toUser = await this.usersRepository.findOne(enquiry.authorId);
      await this.alarmsService.addReplyAlarm(reply, outSourcing, toUser);
    }

    return true;
  }

  async editReply(replyId: number, { ...editReply }: EditReplyDto, user: User) {
    const result = await this.repliesRepository.findOneReplyWithId(
      replyId,
      null,
    );

    if (!result) {
      throw new NotFoundException('댓글이 삭제되었거나 잘못된 접근입니다.');
    }

    /*  reply를 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    const newReply = await this.repliesRepository.save([
      {
        id: result.id,
        ...editReply,
      },
    ]);

    return {
      ...newReply[0],
      author: {
        email: user.email,
        nickname: user.nickname,
        id: user.id,
        avatar: user.avatar,
      },
    };
  }

  async deleteReply(rid: number, user: User) {
    const result = await this.repliesRepository.findOneReplyWithId(rid, null);

    if (!result) {
      throw new NotFoundException('댓글이 삭제되었거나 잘못된 접근입니다.');
    }

    /*  question을 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    await this.enquiryRepository.update(rid, { repliesCount: () => '- 1' });
    await this.repliesRepository.delete({ id: rid });
    return true;
  }
}
