import { Question } from 'src/questions/entities/question.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateImageDto } from '../dtos/create-image.dto';
import { Image } from '../entities/image.entity';

@EntityRepository(Image)
export class ImagesRepository extends Repository<Image> {
  async createImage(
    createImage: CreateImageDto,
    question: Question,
  ): Promise<Image> {
    return this.save(this.create({ ...createImage, question }));
  }
}
