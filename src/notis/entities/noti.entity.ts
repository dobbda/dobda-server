import { IsBoolean, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';

import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Noti extends CoreEntity {
  @ApiProperty({
    description: 'title',
  })
  @Column()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'content',
  })
  @Column()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'notion link? ',
  })
  @Column({ nullable: true })
  @IsUrl()
  link?: string;
}
