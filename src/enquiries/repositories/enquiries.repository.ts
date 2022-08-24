import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Enquiry } from '../entities/enquiry.entity';

@EntityRepository(Enquiry)
export class EnquiriesRepository extends Repository<Enquiry> {

  async createEnquiry(
    createEnquiry: { content: string },
    outSourcing: OutSourcing,
    author: User,
  ): Promise<Enquiry> {
    return this.save(this.create({ ...createEnquiry, outSourcing, author }));
  }
}
