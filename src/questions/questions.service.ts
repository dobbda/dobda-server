import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entities/user.entity';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { EditQuestionDto } from './dtos/edit-question.dto';
import { GetQuestionsDto } from './dtos/get-questions.dto';
import { QuestionsRepository } from './repositories/questions.repository';
import { QuestionTagsRepository } from './repositories/questionTags.repository';
import { TagsRepository } from './repositories/tags.repository';
import { AnswersService } from 'src/answers/answers.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly questionTagsRepository: QuestionTagsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly answersService: AnswersService,
  ) {}

  async findQuestionOrError(questionId: number, getAuthor?: boolean) {
    const question = await this.questionsRepository.findOneQuestionWithId(
      questionId,
      getAuthor,
    );
    if (!question) {
      throw new NotFoundException('게시글이 삭제되었거나 잘못된 접근입니다.');
    }
    return question;
  }

  async getQuestions({ page, title, tagId }: GetQuestionsDto) {
    const { total, questions } = await this.questionsRepository.findAll(
      page,
      title,
      tagId,
    );
    const result = await Promise.all(
      questions.map(async (question) => {
        const tags = await this.tagsRepository.allTagsInQuestion(question.id);
        const { content, ...reset } = question;
        return { ...reset, tagNames: tags };
      }),
    );
    return {
      result,
      totalPages: Math.ceil(total / 20),
    };
  }

  async getOneQuestion(questionId: number) {
    // 상세조회 // + Answer // comment?
    try {
      if (questionId) {
        const result = await this.findQuestionOrError(questionId, true);
        await this.questionsRepository.update(questionId, {
          watch: () => `watch + 1`,
        });
        result.watch += 1;
        const tags = await this.tagsRepository.allTagsInQuestion(questionId);
        // const answer = await this.answersService.getAnswers({ qid: questionId });
        return {
          ...result,
          tagNames: tags,
        };
      }
    } catch {}
  }

  async createQuestion(
    { tagNames, content, ...rest }: CreateQuestionDto,
    user: User,
  ) {
    /* question생성 */
    const question = await this.questionsRepository.createQuestion(
      { content: content, ...rest },
      user,
    );
    /* tag생성 */
    const tags = await this.tagsRepository.createNonExistTags(tagNames);
    /* questionTag 생성 */
    await this.questionTagsRepository.createQuestionTags(question.id, tags);
    const getTags = tags.map((tag) => {
      return { name: tag.name };
    });

    await this.usersRepository.update(user.id, {
      questionsCount: user.questionsCount + 1,
    });

    return {
      ...question,
      tagNames: getTags,
      author: {
        email: user.email,
        nickname: user.nickname,
        id: user.id,
        avatar: user.avatar,
      },
    };
  }

  async editQuestion(
    questionId: number,
    { tagNames, ...editQuestion }: EditQuestionDto,
    user: User,
  ) {
    const result = await this.findQuestionOrError(questionId);
    /*  question을 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (result.acceptedAnswerId) {
      throw new BadRequestException(
        '답변이 채택된 게시글은 수정이 불가능합니다.',
      );
    }
    const newQuestion = await this.questionsRepository.save([
      {
        id: result.id,
        ...editQuestion,
      },
    ]);

    await this.questionTagsRepository.delete({ questionId });
    const tags = await this.tagsRepository.createNonExistTags(tagNames);
    await this.questionTagsRepository.createQuestionTags(result.id, tags);

    const getTags = tags.map((tag) => {
      return { name: tag.name };
    });

    return {
      ...newQuestion[0],
      tagNames: getTags,
      author: {
        email: user.email,
        nickname: user.nickname,
        id: user.id,
        avatar: user.avatar,
      },
    };
  }

  async deleteQuestion(questionId: number, user: User) {
    const result = await this.findQuestionOrError(questionId);
    /*  question을 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (result.acceptedAnswerId || result.answersCount > 0) {
      throw new BadRequestException(
        '답변이 달린 게시글은 삭제가 불가능합니다.',
      );
    }
    await this.questionsRepository.delete({ id: questionId });
    return true;
  }

  // async updateQuestionWatch(questionId: number) {
  //   // const question = await this.findQuestionOrError(questionId);
  //   // await this.questionsRepository.save([
  //   //   { id: questionId, watch: question.watch + 1 },
  //   // ]);
  // 	await this.questionsRepository.update(questionId,{
  // 		watch:()=>"watch + 1"
  // 	})
  //   return true;
  // }
}
