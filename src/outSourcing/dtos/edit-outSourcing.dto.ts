import { PartialType, IntersectionType, PickType } from '@nestjs/mapped-types';
import { CreateOutSourcingDto } from './create-outSourcing.dto';

export class EditOutSourcingDto extends PartialType(CreateOutSourcingDto) {}
