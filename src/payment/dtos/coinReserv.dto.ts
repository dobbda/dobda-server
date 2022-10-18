import { PayType } from './../entities/payments.entity';
import { CoinReserv } from 'src/payment/entities/coinReserv.entity';
import { PaginationOuput } from 'src/common/dtos/pagination.dto';
import { Question } from 'src/questions/entities/question.entity';
import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateReservDto {
  readonly type: PayType;

  readonly coin: number;

  readonly user: User;
  //type이 withdraw일경우 question, outSourcing은 필요없음
  readonly question?: Question;

  readonly outSourcing?: OutSourcing;
}

export class CoinReservOut extends PaginationOuput {
  result: CoinReserv[];
}
