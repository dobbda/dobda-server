import { IsBoolean, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';

import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Noti extends CoreEntity {
  @ApiProperty({
    description: '메인 등록 여부',
  })
  @Column({ default: false })
  @IsBoolean()
  main: boolean;

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
    description: 'main image url',
  })
  @Column({ nullable: true })
  @IsUrl()
  image: string;
}
