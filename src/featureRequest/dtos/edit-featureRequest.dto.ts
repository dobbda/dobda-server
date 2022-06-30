import { PartialType, IntersectionType, PickType } from '@nestjs/mapped-types';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { CreateFeatureRequestDto } from './create-featureRequest.dto';

export class EditFeatureRequestDto extends PartialType(
  IntersectionType(
    PickType(CreateFeatureRequestDto, ['title', 'content', 'deadline']),
    CreateTagsDto,
  ),
) {}