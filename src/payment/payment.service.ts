import { User } from 'src/users/entities/user.entity';
import { PaymentsRepository } from './repositories/payment.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetPaymentDto, OutPayments } from './dtos/get-payment.dto';
import { UsersRepository } from 'src/users/users.repository';
import { CreatePaymentDto } from './dtos/creat-payment.dto';
import { PayType } from './entities/payments.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAllPayments(userId: number, page: number) {
    const { payments, total } = await this.paymentsRepository.findAll(
      userId,
      page,
    );

    return {
      payments,
      totalPages: Math.ceil(total / 20),
    };
  }

  async tossCoin(user: User, toUserId: number, value: number, type: PayType) {
    const toUser = await this.usersRepository.findUserByAuthorId(toUserId);
    if (!toUser) return;

    user.coin -= value;
    toUser.coin += value;

    await this.usersRepository.save([user, toUser]);
    await this.paymentsRepository.createPayment({
      user: user,
      toUserId: toUserId,
      type: type,
      coin: -value,
    });
    await this.paymentsRepository.createPayment({
      user: toUser,
      toUserId: user.id,
      type: type,
      coin: value,
    });

    return true;
  }
}
