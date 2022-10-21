import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateOutSourcingDto } from '../dtos/create-outSourcing.dto';
import { OutSourcing } from '../entities/outSourcing.entity';

@EntityRepository(OutSourcing)
export class OutSourcingRepository extends Repository<OutSourcing> {
  async createOutSourcing(
    createOutSourcingDto: {
      title: string;
      content: string;
      coin: number;
      deadline: Date;
      cardImage: string;
    },
    author: User,
  ) {
    return this.save(this.create({ ...createOutSourcingDto, author }));
  }

  async findOneOutSourcingWithId(outSourcingId: number, getAuthor?: boolean) {
    const outSourcing = this.createQueryBuilder('outSourcing').where(
      'outSourcing.id = :outSourcingId',
      { outSourcingId },
    );
    if (getAuthor) {
      outSourcing
        .leftJoin('outSourcing.author', 'author')
        .addSelect([
          'author.email',
          'author.nickname',
          'author.id',
          'author.avatar',
        ]);
    }
    return outSourcing.getOne();
  }

  async findAll(page: number, title?: string, tagId?: number) {
    const outSourcingQuery = this.createQueryBuilder('outSourcing')
      .take(20)
      .skip((page - 1) * 20)
      .leftJoin('outSourcing.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
      .orderBy('outSourcing.updatedAt', 'DESC');
    if (title && title !== 'undefined') {
      outSourcingQuery.where('outSourcing.title like :title', {
        title: `%${title}%`,
      });
    }
    if (tagId) {
      outSourcingQuery
        .leftJoin('outSourcing.outSourcingTags', 'outSourcingTag')
        .andWhere('outSourcingTag.tagId = :tagId', { tagId });
    }
    const [outSourcings, total] = await outSourcingQuery.getManyAndCount();
    return {
      total,
      outSourcings,
    };
  }
  async findAllWithUserId(userId: number, page: number) {
    const outSourcingQuery = this.createQueryBuilder('outSourcing')
      .where('outSourcing.author.id = :userId', { userId })
      .take(20)
      .skip((page - 1) * 20)
      .leftJoin('outSourcing.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
      .orderBy('outSourcing.updatedAt', 'DESC');
    const [outSourcings, total] = await outSourcingQuery.getManyAndCount();
    return {
      total,
      outSourcings,
    };
  }
}
