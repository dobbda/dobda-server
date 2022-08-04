import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import parse from 'node-html-parser';
import sanitizeHtml from 'sanitize-html';
import { UsersRepository } from 'src/users/users.repository';
import { ImagesRepository } from 'src/images/repositories/images.repository';
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
    private readonly imagesRepository: ImagesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly answersService: AnswersService,
  ) {}

  async findQuestionOrError(questionId: number, getAuthor?: boolean) {
    const question = await this.questionsRepository.findOneQuestionWithId(
      questionId,
      getAuthor,
    );
    if (!question) {
      throw new NotFoundException('id에 해당하는 question이 없습니다.');
    }
		const {content, ...reset} = question
    return reset;
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
				const {content, ...reset} = question
        return { ...reset, tagNames: tags };
      }),
    );
    return {
      result,
      totalPages: Math.ceil(total / 20),
    };
  }

  async getQuestion(questionId: number) {// 상세조회 // + Answer // comment?
    const result = await this.findQuestionOrError(questionId, true);
    const tags = await this.tagsRepository.allTagsInQuestion(questionId);
		const answer = await this.answersService.getAnswers({qid: questionId})
    return {
      question: { ...result, tagNames: tags, ...answer },
    };
  }

  async createQuestion({ tagNames, content, ...rest }: 
		CreateQuestionDto, user: User,) {

    /* question생성 */
    const question = await this.questionsRepository.createQuestion(
      { content: content, ...rest },
      user,
    );
    /* tag생성 */
    const tags = await this.tagsRepository.createNonExistTags(tagNames);
    /* questionTag 생성 */
    await this.questionTagsRepository.createQuestionTags(question.id, tags);

    return true;
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
    if (result.accepteAnswerId) {
      throw new BadRequestException(
        '답변이 채택된 게시글은 수정이 불가능합니다.',
      );
    }
    await this.questionsRepository.save([
      {
        id: result.id,
        ...editQuestion,
      },
    ]);
    if (tagNames) {
      await this.questionTagsRepository.delete({ questionId });
      const tags = await this.tagsRepository.createNonExistTags(tagNames);
      await this.questionTagsRepository.createQuestionTags(result.id, tags);
    }
    return true;
  }

  async deleteQuestion(questionId: number, user: User) {
    const result = await this.findQuestionOrError(questionId);
    /*  question을 user가 만든게 맞는지 check */
    if (result.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (result.accepteAnswerId) {
      throw new BadRequestException(
        '답변이 채택된 게시글은 삭제가 불가능합니다.',
      );
    }
    await this.questionsRepository.delete({ id: questionId });
    return true;
  }

  async updateQuestionWatch(questionId: number) {
    const question = await this.findQuestionOrError(questionId);
    await this.questionsRepository.save([
      { id: questionId, watch: question.watch + 1 },
    ]);
    return true;
  }
}
