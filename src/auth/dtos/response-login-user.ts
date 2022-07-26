import { User } from "src/users/entities/user.entity"
import { Tokens } from "../jwt/types/jwt.token"

export class ResLoginUser {
	tokens:Tokens
	user:User
}