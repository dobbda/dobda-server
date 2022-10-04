import { NotFoundException } from '@nestjs/common';
import { skip } from 'rxjs';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePaymentDto } from '../dtos/creat-payment.dto';
import { Payment } from '../entities/payments.entity';

@EntityRepository(Payment)
export class PaymentsRepository extends Repository<Payment> {
  async createPayment(createPayment: CreatePaymentDto): Promise<Payment> {
    return this.save(this.create({ ...createPayment }));
  }

  async findAll(userId: number, page: number) {
    const payment = this.createQueryBuilder('payment')
      .take(50)
      .skip((page - 1) * 50)
      .where('payment.user.id = :userId', {
        userId,
      });
    const [payments, total] = await payment.getManyAndCount();

    return {
      payments,
      total,
    };
  }
}
