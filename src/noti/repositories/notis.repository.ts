import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Noti } from '../entities/noti.entity';

@EntityRepository(Noti)
export class NotisRepository extends Repository<Noti> {}
