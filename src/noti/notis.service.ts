import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { User } from 'src/users/entities/user.entity';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { GetAnswersDto } from './dtos/get-answer.dto';
import { NotisRepository } from './repositories/notis.repository';

@Injectable()
export class NotisService {
  constructor(private readonly notisRepository: NotisRepository) {}
}
