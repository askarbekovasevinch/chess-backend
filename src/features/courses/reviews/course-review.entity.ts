import {Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, Index} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '../../users/user.entity';
import {Course} from '../course.entity';

@Entity('course_reviews')
@Index(['userId', 'courseId'], {unique: true})
export class CourseReview {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'user_id'})
    userId: number;

    @Column({name: 'course_id'})
    courseId: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(() => Course, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'course_id'})
    course: Course;

    @ApiProperty()
    @Column()
    rating: number;

    @ApiProperty({nullable: true})
    @Column({length: 512, nullable: true})
    comment: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;
}
