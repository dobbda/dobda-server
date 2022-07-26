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

  async createImages(images: string[], question: Question): Promise<boolean> {
    const values = images.map((url) =>
      this.create({ url, question: question }),
    );
    await this.createQueryBuilder()
      .insert()
      .into(Image)
      .values([...values])
      .execute();
    return true;
  }
}
