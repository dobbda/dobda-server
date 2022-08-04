import { UserRegisterDTO } from './dtos/user-register.dto';
import { User } from './entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(userRegisterDto: UserRegisterDTO): Promise<User> {
    const { email } = userRegisterDto;

    const checkUser = await this.findOne({ email });
    if (checkUser)
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');

    const user = this.create(userRegisterDto);
    try {
      await this.save(user);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }
  async findUserByAuthorId(authorId: number): Promise<any> {
    const find = await this.findOne({ id: authorId });
    if (!find) throw new Error('Invalid');
    const { coin, refreshToken, createdAt, updatedAt, ...users } = find;
    return users;
  }

  //개발용 모든 유저 목록
  async list(): Promise<User[]> {
    return await this.find();
  }
}
