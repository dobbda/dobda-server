import { Injectable } from '@nestjs/common';
import { Noti } from './entities/noti.entity';
import { NotisRepository } from './repositories/notis.repository';

@Injectable()
export class NotisService {
  constructor(private readonly notisRepository: NotisRepository) {}

  async getNotis() {
    return this.notisRepository.findAll(1);
  }
}
