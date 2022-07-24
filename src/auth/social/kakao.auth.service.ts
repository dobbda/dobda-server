import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import axios, { AxiosResponse } from "axios";
import { UsersRepository } from "src/users/users.repository";
import { AuthService } from "../auth.service";
import { GithubUserDto } from "../dtos/social-user.dto";

@Injectable()
export class KakaoAuthService {
    constructor(
        private usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private authService: AuthService,
      ) {}
    
      async getKakaoInfo(code: string){
      }
}