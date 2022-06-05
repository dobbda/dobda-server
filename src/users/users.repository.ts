import { UserRegisterDTO } from './dtos/user-register.dto';
import { User } from './entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userRegisterDto: UserRegisterDTO): Promise<void> {
    const { email } = userRegisterDto;

    const temp = await this.findOne({ email });
    if (temp) throw new UnauthorizedException('이미 존재하는 이메일입니다.');

    const user = this.create(userRegisterDto);

    try {
      await this.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async list() {
    return await this.find();
  }
}
