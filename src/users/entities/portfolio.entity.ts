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
  @Column()
  @IsString()
  card: string;

  @ApiProperty({
    type: JSON.stringify,
    description: 'content',
  })
  @Column()
  @IsString()
  content: string;

  @OneToOne((type) => User, (user: User) => user.portfolio)
  @JoinColumn()
  user: User;

  @RelationId((portfolio: Portfolio) => portfolio.user)
  userId: number;
}
