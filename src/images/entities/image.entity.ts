import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Image extends CoreEntity {
  @ApiProperty({
    description: '파일 이름(확장자 포함)',
    required: true,
  })
  @Column()
  @IsString()
  filename: string;

  @ApiProperty({
    description: '파일 확장자',
    required: true,
  })
  @Column()
  @IsString()
  extension: string;

  @ApiProperty({
    description: '파일 크기',
    required: true,
  })
  @Column()
  @IsNumber()
  filesize: number;
}
