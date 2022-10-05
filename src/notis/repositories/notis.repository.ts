import { EntityRepository, Repository } from 'typeorm';
import { CreateNotiDto } from '../dtos/create-noti.dto';

import { Noti } from '../entities/noti.entity';

@EntityRepository(Noti)
export class NotisRepository extends Repository<Noti> {
  async createNoti(createNoti: CreateNotiDto): Promise<Noti> {
    return this.save(this.create({ ...createNoti }));
  }

  async findAll(page: number) {
    const noti = this.createQueryBuilder('noti')
      .take(30)
      .skip((page - 1) * 30);

    const [notis, total] = await noti.getManyAndCount();

    return {
      notis,
      total,
    };
  }
}
