import { PartialType } from '@nestjs/swagger';
import { CreateReplyDto } from './create-reply.dto';

export class EditReplyDto extends PartialType(CreateReplyDto) {}
