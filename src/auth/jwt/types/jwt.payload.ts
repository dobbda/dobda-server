export class JwtPayload {
  email: string;
  sub: string; //식별자
  refreshToken?: string;
}
