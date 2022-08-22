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

  async getOutSourcings({ page, title, tagId }: GetOutSourcingsDto) {
    const { total, outSourcings } = await this.outSourcingRepository.findAll(
      page,
      title,
      tagId,
    );

    /* outSourcing이 가지고있는 tag 넣기 */
    const result = await Promise.all(
      outSourcings.map(async (outSourcing) => {
        const tags = await this.tagsRepository.allTagsInOutSourcing(
          outSourcing.id,
        );
        return { ...outSourcing, tags };
      }),
    );

    return {
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
		
    return {
      ...outSourcing,
      tagNames: getTags,
      author: { email: user.email, nickname: user.nickname, id: user.id, avatar:user.avatar},
    };
  }

  async getOutSourcing(outSourcingId: number) {
    const result = await this.findOutSourcingOrError(outSourcingId, true);
    const tags = await this.tagsRepository.allTagsInOutSourcing(outSourcingId);
    return { outSourcing: { ...result, tags } };
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
    console.log(editOutSourcing);
    await this.outSourcingRepository.save([
      { id: outSourcingId, ...editOutSourcing },
    ]);
    if (tagNames) {
      await this.outSourcingTagRepository.delete({
        outSourcingId: outSourcing.id,
      });
      const tags = await this.tagsRepository.createNonExistTags(tagNames);
      await this.outSourcingTagRepository.createOutSourcingTags(
        outSourcing.id,
        tags,
      );
    }
    return true;
  }

  async deleteOutSourcing(outSourcingId: number, user: User) {
    const outSourcing = await this.findOutSourcingOrError(outSourcingId);
    /* outSourcing을 로그인한 user가 만든게 맞는지 check */
    if (outSourcing.authorId !== user.id) {
      throw new BadRequestException('작성자만 삭제가 가능합니다');
    }
    if (!this.canUpdateAndDelete(outSourcing.progress)) {
      throw new BadRequestException(
        '답변이 채택된 게시글은 삭제가 불가능합니다.',
      );
    }
    await this.outSourcingRepository.delete({ id: outSourcing.id });
    return true;
  }

  async updateOutSourcingWatch(outSourcingId: number) {
    const outSourcing = await this.findOutSourcingOrError(outSourcingId);
    await this.outSourcingRepository.save([
      { id: outSourcingId, watch: outSourcing.watch + 1 },
    ]);
    return true;
  }

  canUpdateAndDelete(progress: Progress) {
    return progress == Progress.Pending;
  }
}
