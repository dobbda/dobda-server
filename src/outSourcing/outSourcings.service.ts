import { UsersRepository } from '../users/repositories/users.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TagsRepository } from 'src/questions/repositories/tags.repository';
import { CreateOutSourcingDto } from './dtos/create-outSourcing.dto';
import { OutSourcingRepository } from './repositiories/outSourcing.repository';
import { OutSourcingTagRepository } from './repositiories/outSourcingTag.repository';
import { EditOutSourcingDto } from './dtos/edit-outSourcing.dto';
import { GetOutSourcingsDto } from './dtos/get-outSourcings.dto';
import { User } from 'src/users/entities/user.entity';
import { Progress } from './types/progressType';
@Injectable()
export class OutSourcingService {
  constructor(
    private readonly outSourcingRepository: OutSourcingRepository,
    private readonly outSourcingTagRepository: OutSourcingTagRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async findOutSourcingOrError(outSourcingId: number, getAuthor?: boolean) {
    const outSourcing =
      await this.outSourcingRepository.findOneOutSourcingWithId(
        outSourcingId,
        getAuthor,
      );
    if (!outSourcing) {
      throw new NotFoundException('id에 해당하는 feature-request가 없습니다.');
    }
    return outSourcing;
  }

  async getOutSourcings({ page, keyword }: GetOutSourcingsDto) {
    let keywordId = null;
    // 키워드로 금색시
    if (keyword) {
      keywordId = (await this.tagsRepository.findOne({ name: keyword }))?.id;
    }
    const { total, outSourcings } = await this.outSourcingRepository.findAll(
      page,
      keywordId,
      keyword,
    );

    /* outSourcing이 가지고있는 tag 넣기 */
    const result = await Promise.all(
      outSourcings.map(async (outSourcing) => {
        const tags = await this.tagsRepository.allTagsInOutSourcing(
          outSourcing.id,
        );
        const { content, ...v } = outSourcing;
        return { ...v, tagNames: tags };
      }),
    );

    return {
      result,
      total,
      totalPages: Math.ceil(total / 20),
    };
  }
  async getUserOutSourcings(user: User, page: number) {
    const { total, outSourcings } =
      await this.outSourcingRepository.findAllWithUserId(user.id, page);

    /* outSourcing이 가지고있는 tag 넣기 */
    const result = await Promise.all(
      outSourcings.map(async (outSourcing) => {
        const tags = await this.tagsRepository.allTagsInOutSourcing(
          outSourcing.id,
        );
        return { ...outSourcing, tagNames: tags };
      }),
    );

    return {
      total,
      result,
      totalPages: Math.ceil(total / 20),
    };
  }

  async createOutSourcing(
    { tagNames, ...rest }: CreateOutSourcingDto,
    user: User,
  ) {
    /* outSourcing생성 */
    const outSourcing = await this.outSourcingRepository.createOutSourcing(
      rest,
      user,
    );

    /* tag생성 */
    const tags = await this.tagsRepository.createNonExistTags(tagNames);

    /* outSourcingTag 생성 */
    await this.outSourcingTagRepository.createOutSourcingTags(
      outSourcing.id,
      tags,
    );

    const getTags = tags.map((tag) => {
      return { name: tag.name };
    });

    await this.userRepository.update(user.id, {
      outSourcingCount: user.outSourcingCount + 1,
    });

    return {
      ...outSourcing,
      tagNames: getTags,
      author: {
        email: user.email,
        nickname: user.nickname,
        id: user.id,
        avatar: user.avatar,
      },
    };
  }

  async getOneOutSourcing(outSourcingId: number) {
    const result = await this.findOutSourcingOrError(outSourcingId, true);
    const tags = await this.tagsRepository.allTagsInOutSourcing(outSourcingId);
    await this.outSourcingRepository.update(outSourcingId, {
      watch: result.watch + 1,
    });
    result.watch += 1;
    return { ...result, tagNames: tags };
  }

  async editOutSourcing(
    outSourcingId: number,
    { tagNames, ...editOutSourcing }: EditOutSourcingDto,
    user: User,
  ) {
    const outSourcing = await this.findOutSourcingOrError(outSourcingId);
    /* outSourcing을 로그인한 user가 만든게 맞는지 check */
    if (outSourcing.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정이 가능합니다');
    }
    if (!this.canUpdateAndDelete(outSourcing.progress)) {
      throw new BadRequestException(
        '답변이 채택된 게시글은 수정이 불가능합니다.',
      );
    }

    const update = await this.outSourcingRepository.save([
      { id: outSourcingId, ...editOutSourcing },
    ]);
    await this.outSourcingTagRepository.delete({
      outSourcingId: outSourcing.id,
    });
    const tags = await this.tagsRepository.createNonExistTags(tagNames);
    await this.outSourcingTagRepository.createOutSourcingTags(
      outSourcing.id,
      tags,
    );
    const getTags = tags.map((tag) => {
      return { name: tag.name };
    });

    return {
      ...update[0],
      tagNames: getTags,
      author: {
        email: user.email,
        nickname: user.nickname,
        id: user.id,
        avatar: user.avatar,
      },
    };
  }

  async deleteOutSourcing(outSourcingId: number, user: User) {
    const outSourcing = await this.findOutSourcingOrError(outSourcingId);
    /* outSourcing을 로그인한 user가 만든게 맞는지 check */
    if (outSourcing.authorId !== user.id) {
      throw new BadRequestException('작성자만 수정 가능합니다.');
    }
    if (!this.canUpdateAndDelete(outSourcing.progress)) {
      throw new BadRequestException(
        '프로젝트에 선택된 유저가 있어 삭제가 불가능 합니다.',
      );
    }
    await this.outSourcingRepository.delete({ id: outSourcing.id });
    await this.userRepository.update(user.id, {
      outSourcingCount: user.outSourcingCount - 1,
    });

    return true;
  }

  async updateOutSourcingWatch(outSourcingId: number) {
    // const outSourcing = await this.findOutSourcingOrError(outSourcingId);
    try {
      await this.outSourcingRepository.update(outSourcingId, {
        watch: () => 'watch - 1',
      });
      return true;
    } catch {
      return false;
    }
  }

  canUpdateAndDelete(progress: Progress) {
    return progress == Progress.Pending;
  }
}
