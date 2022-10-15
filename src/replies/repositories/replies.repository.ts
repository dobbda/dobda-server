import { User } from 'src/users/entities/user.entity';
import { Reply } from 'src/replies/entities/reply.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Enquiry } from 'src/enquiry/entities/enquiry.entity';

@EntityRepository(Reply)
export class RepliesRepository extends Repository<Reply> {
  async createReply(
    createReply: { content: string },
    enquiry: Enquiry,
    author: User,
  ): Promise<Reply> {
    return this.save(this.create({ ...createReply, author, enquiry }));
  }

  async findOneReplyWithId(replyId: number, getAuthor?: boolean) {
    const reply = this.createQueryBuilder('reply').where(
      'reply.id = :replyId',
      { replyId },
    );

    if (getAuthor) {
      reply
        .leftJoin('reply.author', 'author')
        .addSelect([
          'author.email',
          'author.nickname',
          'author.id',
          'author.avatar',
        ]);
    }
    return reply.getOne();
  }
}
