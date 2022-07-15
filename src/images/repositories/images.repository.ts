import { EntityRepository, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@EntityRepository(Image)
export class ImagesRepository extends Repository<Image> {
  async createImage(createImage: {
    filename: string;
    extension: string;
    filesize: number;
  }): Promise<Image> {
    return this.save(this.create({ ...createImage }));
  }
}
