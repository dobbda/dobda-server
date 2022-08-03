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
    //***서비스에서 체크해서 없으면 가입해야돼서 response하면 안됨 ****
    // try {
    //   const user = await this.findOne({ email });
    //   if (!user) throw new Error('처리되지 않은 오류 : findUserByEmail');
    //   return user;
    // } catch (error) {
    //   throw new BadRequestException('사용자를 찾지 못했습니다.');
    // }
  }

  //개발용 모든 유저 목록
  async list(): Promise<User[]> {
    return await this.find();
  }
}
