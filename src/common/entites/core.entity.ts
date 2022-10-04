import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity extends BaseEntity {
  @ApiProperty({
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '생성 날짜',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: '수정 날짜',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
