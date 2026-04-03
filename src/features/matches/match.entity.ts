import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { MatchType, WinnerType} from "@/core/enums";

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => User) @JoinColumn({ name: 'first_user_id' }) firstUser: User;
  @Column({ name: 'first_user_id' }) firstUserId: number;

  @ManyToOne(() => User) @JoinColumn({ name: 'second_user_id' }) secondUser: User;
  @Column({ name: 'second_user_id' }) secondUserId: number;

  @ApiProperty({ enum: MatchType })
  @Column({ type: 'enum', enum: MatchType, default: MatchType.RAPID })
  type: MatchType;

  @ApiProperty({ enum: WinnerType, nullable: true })
  @Column({ type: 'enum', enum: WinnerType, nullable: true })
  winner: WinnerType;

  @ApiProperty({ nullable: true }) @Column({ type: 'text', nullable: true }) pgn: string;
  @ApiProperty({ nullable: true }) @Column({ nullable: true }) duration: number;

  @CreateDateColumn({ name: 'played_at' }) playedAt: Date;
}
