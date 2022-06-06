import { PartialType, IntersectionType, PickType } from '@nestjs/mapped-types';
import { CreateQuestionDto, CreateTagsDto } from './create-question.dto';

export class EditQuestionDto extends PartialType(
  IntersectionType(
    PickType(CreateQuestionDto, ['title', 'content']),
    CreateTagsDto,
  ),
) {}
