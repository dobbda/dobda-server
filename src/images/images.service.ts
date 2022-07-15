import { Injectable } from '@nestjs/common';
import { ImagesRepository } from './repositories/images.repository';

@Injectable()
export class ImagesService {
  constructor(private readonly imageRepository: ImagesRepository) {}
}
