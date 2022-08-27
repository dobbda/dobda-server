import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { AnswersRepository } from 'src/answers/repositories/answers.repository';
import { EnquiriesRepository } from 'src/enquiries/repositories/enquiries.repository';
import { NotisService } from 'src/noti/notis.service';
import { User } from 'src/users/entities/user.entity';
import { CreateReplyDto } from './dtos/create-reply.dto';
import { EditReplyDto } from './dtos/edit-reply.dto';
import { GetReplyDto } from './dtos/get-reply.dto';
import { RepliesRepository } from './repositories/replies.repository';

@Injectable()
export class RepliesService {
  constructor(
    private readonly repliesRepository: RepliesRepository,
    private readonly enquiriesRepository: EnquiriesRepository,
    private readonly notisService: NotisService,
  ) {}

  async getReplies({ eid }: GetReplyDto) {
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
    const enquiry = await this.enquiriesRepository.findOne(eid);

    if (!enquiry) return;
    await this.enquiriesRepository.save([
      {
        id: enquiry.id,
        repliesCount: enquiry.repliesCount + 1,
      },
    ]);

    const reply = await this.repliesRepository.createReply(
      { content },
      enquiry,
      user,
    );

    await this.notisService.addReplyNoti(reply, user);

    return true;
  }

  async editReply(
    replyId: number,
    { ...editReply }: EditReplyDto,
    user: User,
  ) {
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
    const result = await this.repliesRepository.findOneReplyWithId(
      rid,
      null,
    );

    if (!result) {
      throw new NotFoundException('댓글이 삭제되었거나 잘못된 접근입니다.');
    }

    /*  question을 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }

    await this.repliesRepository.delete({ id: rid });
    return true;
  }
}
