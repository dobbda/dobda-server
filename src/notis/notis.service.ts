import { CreateNotiDto } from './dtos/create-noti.dto';
import { Injectable } from '@nestjs/common';
import { Noti } from './entities/noti.entity';
import { NotisRepository } from './repositories/notis.repository';

@Injectable()
export class NotisService {
  constructor(private readonly notisRepository: NotisRepository) {}

  async getNotis() {
    return this.notisRepository.findAll(1);
  }
  async getNoti(id: number) {
    return this.notisRepository.findOne(id);
  }
  async createNoti(createNoti: CreateNotiDto) {
    this.notisRepository.createNoti(createNoti);
    return true;
  }
}
