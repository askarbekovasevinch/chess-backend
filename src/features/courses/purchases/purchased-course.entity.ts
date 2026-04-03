import {Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '../../users/user.entity';
import {Course} from '../course.entity';

@Entity('purchased_courses')
export class PurchasedCourse {
    @PrimaryColumn({name: 'user_id'}) userId: number;
    @PrimaryColumn({name: 'course_id'}) courseId: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'}) user: User;

    @ManyToOne(() => Course, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'course_id'}) course: Course;

    @ApiProperty()
    @Column({name: 'is_completed', default: false}) isCompleted: boolean;

    @CreateDateColumn({name: 'created_at'}) createdAt: Date;
}
