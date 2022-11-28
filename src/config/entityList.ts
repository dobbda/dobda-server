import { Alarm } from 'src/alarms/entities/alarm.entity';
import { Answer } from 'src/answers/entities/answer.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Enquiry } from 'src/enquiry/entities/enquiry.entity';
import { Noti } from 'src/notis/entities/noti.entity';
import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { OutSourcingTag } from 'src/outSourcing/entities/outSourcingTag.entity';
import { CoinHistory } from 'src/payment/entities/coinHistory.entity';
import { CoinReserv } from 'src/payment/entities/coinReserv.entity';
import { Payment } from 'src/payment/entities/payments.entity';
import { Question } from 'src/questions/entities/question.entity';
import { QuestionTag } from 'src/questions/entities/questionTag.entity';
import { Tag } from 'src/questions/entities/tag.entity';
import { Reply } from 'src/replies/entities/reply.entity';
import { Portfolio } from 'src/users/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';

export const entityList = [
  User,
  OutSourcing,
  OutSourcingTag,
  Tag,
  Question,
  QuestionTag,
  Alarm,
  Answer,
  Comment,
  Payment,
  Enquiry,
  Reply,
  Noti,
  CoinHistory,
  CoinReserv,
  Portfolio,
];
