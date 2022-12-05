import { User } from './user.entity';
import { IsBoolean, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';

import { Column, Entity, JoinColumn, OneToOne, RelationId } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Portfolio extends CoreEntity {
  @ApiProperty({
    description: 'public or private',
  })
  @Column({ default: true })
  @IsBoolean()
  public: boolean;

  @ApiProperty({
    type: JSON.stringify,
    description: 'MAIN CARD CONTENTS',
  })
  @Column({ nullable: true, type: 'json' })
  @IsString()
  card: string;

  @ApiProperty({
    type: JSON.stringify,
    description: 'content',
  })
  @Column({ nullable: true, type: 'json' })
  @IsString()
  content: string;

  @OneToOne((type) => User, (user: User) => user.portfolio)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((portfolio: Portfolio) => portfolio.user)
  userId: number;

  @ApiProperty({ description: '분야' })
  @Column({ nullable: true, type: 'json' })
  workField: string[];

  @ApiProperty({ description: '스킬' })
  @Column({ type: 'json', nullable: true })
  skill: string[];

  @Column({ nullable: true })
  job: string;
}

export class Image {
  uid?: string;
  name?: string;
  url?: string;
  fileName?: string;
}
