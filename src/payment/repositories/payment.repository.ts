import { EntityRepository, Repository } from 'typeorm';
import { Payment } from '../entities/payments.entity';

@EntityRepository(Payment)
export class PaymentsRepository extends Repository<Payment> {}
