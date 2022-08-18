import { PartialType, IntersectionType, PickType } from '@nestjs/mapped-types';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';
import { CreateOutSourcingDto } from './create-outSourcing.dto';

export class EditOutSourcingDto extends PartialType(CreateOutSourcingDto) {}
