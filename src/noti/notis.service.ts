import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { User } from 'src/users/entities/user.entity';
import { CreateNotiDto } from './dtos/create-noti.dto';
import { GetNoti, GetNotisOutput } from './dtos/get-noti.dto';
import { Noti, NotiType } from './entities/noti.entity';
import { NotisRepository } from './repositories/notis.repository';

@Injectable()
export class NotisService {
  constructor(private readonly notisRepository: NotisRepository) {}

  async createNoti(dto: CreateNotiDto) {
    await this.notisRepository.createNoti(dto);
  }

  async getNotis(user: User): Promise<GetNotisOutput> {
    const result = await this.notisRepository.find({
      where: {
        to: user,
      },
      take: 5,
    });

    return {
      notis: result.map((x) => {
        return {
          id: x.id,
          type: x.type,
          createdAt: x.createdAt,
          content: x.content,
        };
      }),
    };
  }

  async getAllNotis(user: User): Promise<GetNotisOutput> {
    const result = await this.notisRepository.find({
      where: {
        to: user,
      },
    });

    return {
      notis: result.map((x) => {
        return {
          id: x.id,
          type: x.type,
          createdAt: x.createdAt,
          content: x.content,
        };
      }),
    };
  }

  async viewNoti(id: number, user: User) {
    const noti = await this.notisRepository.findOneNotiWithId(id);
    if (!noti) {
      throw new NotFoundException('id에 해당하는 noti가 없습니다.');
    }

    if (noti.to.id !== user.id) {
      throw new ForbiddenException('잘못된 요청입니다.');
    }

    noti.checked = true;

    this.notisRepository.save(noti);

    return null;
  }
}
