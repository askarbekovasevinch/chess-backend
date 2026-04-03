import {Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '../users/user.entity';
import {ReportType} from "@/core/enums";

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn() id: number;

    @ManyToOne(() => User) @JoinColumn({name: 'user_id'}) user: User;
    @Column({name: 'user_id'}) userId: number;

    @ApiProperty() @Column({name: 'target_id'}) targetId: number;

    @ApiProperty({enum: ReportType})
    @Column({type: 'enum', enum: ReportType})
    type: ReportType;

    @ApiProperty()
    @Column({length: 256}) reason: string;

    @ApiProperty()
    @Column({name: 'is_reviewed', default: false}) isReviewed: boolean;

    @CreateDateColumn({name: 'created_at'}) createdAt: Date;
}
