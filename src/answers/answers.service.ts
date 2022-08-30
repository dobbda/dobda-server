import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotisService } from 'src/noti/notis.service';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { GetAnswersDto } from './dtos/get-answer.dto';
import { AnswersRepository } from './repositories/answers.repository';

@Injectable()
export class AnswersService {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly notisService: NotisService,
    private readonly userRepository: UsersRepository,
  ) {}

  async getAnswers({ qid }: GetAnswersDto) {
    const answers = await this.answersRepository
      .createQueryBuilder('answer')
      .where({ question: qid })
      .leftJoin('answer.author', 'author')
      .addSelect([
        'author.email',
        'author.nickname',
        'author.id',
        'author.avatar',
      ])
      .orderBy('answer.updatedAt', 'DESC')
      .getMany();
    return {
      answers,
    };
  }

  async createAnswer({ content, qid }: CreateAnswerDto, user: User) {
    /* question 가져오기 */
    const question = await this.questionsRepository.findOne(qid);

    if (question === null) {
      throw new NotFoundException('잘못된 접근입니다.');
    }
    await this.questionsRepository.update(qid, {
			answersCount: ()=> '+ 1'
		});
        
		// await this.questionsRepository.update(questionId,{
		// 	watch:()=>"watch + 1"
		// })
    const answer = await this.answersRepository.createAnswer(
      { content },
      question,
      user,
    );
    
    await this.notisService.addAnswerNoti(answer, user);
    return true;
  }

	// 채택
  async acceptAnswer(answerId: number, user: User) {
    const answer = await this.answersRepository.findOne(answerId);// answer.question이 undefined으로 나옴
    const question = await this.questionsRepository.findOne(answer.questionId);

		if (question.acceptedAnswerId ) {
      throw new ForbiddenException('이미 채택된 답변이 있습니다.');
    }
    if (question.authorId !== user.id) {
      throw new ForbiddenException('질문자만 답변을 채택할 수 있습니다.');
    }
    if (question.authorId == answer.authorId) {
      throw new ForbiddenException('본인 답변은 채택할 수 없습니다.');
    }

    answer.accepted = true;
    question.acceptedAnswerId = answer.id;
    question.acceptedAnswer = answer;
		answer.question=question
    await this.answersRepository.save(answer);
    await this.questionsRepository.save(question);

    await this.notisService.addAcceptNoti(answer, user);

		await this.userRepository.update(user.id, {setAcceptCount: ()=> "+ 1"});
		await this.userRepository.update(answer.authorId, {getAcceptCount: ()=> "+ 1"});

		if(question.coin >0){ // 코인 이동
			await this.userRepository.update(answer.authorId, {coin: ()=> `+ ${question.coin}`});
			await this.userRepository.update(user.id, {coin: ()=> `- ${question.coin}`});
		}
        
    return true;
  }
    
  async editAnswer(content: string, aid: number, user: User) {
    const answer = await this.answersRepository.findOne({ id: aid });
    if (user.id !== answer.authorId) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (answer.commentsCount) {
      throw new BadRequestException('댓글이 달린 답변은 수정이 불가능합니다.');
    }
    if (answer.accepted) {
      throw new BadRequestException('채택된 답변은 수정이 불가능합니다.');
    }

    const newAnswer = await this.answersRepository.save({
      id: aid,
      content: content,
    });
    return newAnswer;
  }


  async deleteAnswer(aid: number, user: User) {
    const answer = await this.answersRepository.findOne({ id: aid });
    const question = await this.questionsRepository.findOne(answer.questionId);
    if (user.id !== answer.authorId) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (answer.commentsCount) {
      throw new BadRequestException('댓글이 달린 답변은 수정이 불가능합니다.');
    }
    if (answer.accepted) {
      throw new BadRequestException('채택된 답변은 수정이 불가능합니다.');
    }

    await this.answersRepository.delete({
      id: aid,
    });
		
    await this.questionsRepository.update(question.id, {
			answersCount: ()=> "- 1"
		});

		return {success:true}
  }
}
