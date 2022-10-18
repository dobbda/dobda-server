import { CoinReserv } from 'src/payment/entities/coinReserv.entity';
import { Question } from 'src/questions/entities/question.entity';
import { CoinReservOut, CreateReservDto } from './dtos/coinReserv.dto';
import { CoinHistorysRepository } from './repositories/coinHistory.repository';
import { User } from 'src/users/entities/user.entity';
import { PaymentsRepository } from './repositories/payment.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { CreatePaymentDto } from './dtos/payment.dto';
import { PayType } from './entities/payments.entity';
import { CoinReservsRepository } from './repositories/coinReserv.repository';
import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { CoinHistoryOut } from './dtos/coinHistory.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly histRepository: CoinHistorysRepository,
    private readonly reservsRepository: CoinReservsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAllCoinHistory(user: User, page: number): Promise<CoinReservOut> {
    /**
     * 코인 히스토리[] 조회
     */
    const { hists, total } = await this.reservsRepository.findAll(
      user.id,
      page,
    );
    return {
      result: hists,
      totalPages: Math.ceil(total / 20),
    };
  }

  async findAllCoinReserv(user: User, page: number): Promise<CoinReservOut> {
    /**
     * 임시 저장된 코인 정보 조회
     */
    const { hists, total } = await this.reservsRepository.findAll(
      user.id,
      page,
    );

    return {
      result: hists,
      totalPages: Math.ceil(total / 20),
    };
  }

  async reservToUser(user: User, reserv: CoinReserv) {
    user.coin += reserv.coin;
    await this.usersRepository.save(user);

    await this.reservsRepository.delete({ id: reserv.id }); //완료된 reserv는 삭제
  }

  async userToReserv(reservDto: CreateReservDto) {
    /** outSourcing || question ||
     * 유저의 코인을  금액만큼 reserv로
     * reserv코인은 확정된것이 아니므로 코인 기록은 남기지 않는다.
     */
    console.log('userToresv 쪽', reservDto);
    const { coin, user, type, question, outSourcing } = reservDto;
    user.coin -= coin;
    await this.usersRepository.save(user);
    await this.reservsRepository.createCoinReserv(reservDto);
  }

  async tossCoin(
    user: User,
    toUserId: number,
    type: PayType,
    question?: Question,
    outSourcing?: OutSourcing,
  ) {
    /** question or outSourcing이 완료시
     * reserv에 저장된 coin을 유저코인에 적용
     */
    console.log('reserv확인1 :');

    const toUser = await this.usersRepository.findUserByAuthorId(toUserId);
    console.log(type == PayType.QUESTION, toUser);

    const reserv = await this.reservsRepository.findOne(
      type === PayType.QUESTION ? { question } : { outSourcing },
    );
    console.log('reserv확인3: ', reserv);
    await this.reservToUser(toUser, reserv); // toUser에게 전달후 reserv 삭제

    // 기록 남기기
    await this.histRepository.createCoinHistory({
      user: user,
      toUserId: toUserId,
      type: type,
      coin: -reserv.coin,
    });
    await this.histRepository.createCoinHistory({
      user: toUser,
      toUserId: user.id,
      type: type,
      coin: reserv.coin,
    });

    return true;
  }
}
