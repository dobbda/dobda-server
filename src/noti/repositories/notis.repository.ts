import { NotFoundException } from '@nestjs/common';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateNotiDto } from '../dtos/create-noti.dto';
import { Noti } from '../entities/noti.entity';

@EntityRepository(Noti)
export class NotisRepository extends Repository<Noti> {
  async createNoti(createNoti: CreateNotiDto): Promise<Noti> {
    return this.save(this.create({ ...createNoti }));
  }

  async findOneNotiWithId(notiId: number) {
    const noti = this.createQueryBuilder('noti').where('noti.id = :notiId', {
      notiId,
    });
    return noti.getOne();
  }
}
