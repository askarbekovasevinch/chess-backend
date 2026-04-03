import {Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '../../users/user.entity';
import {CourseLesson} from './course-lesson.entity';

@Entity('users_lessons')
export class UserLesson {
    @PrimaryColumn({name: 'user_id'}) userId: number;
    @PrimaryColumn({name: 'course_lesson_id'}) courseLessonId: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(() => CourseLesson, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'course_lesson_id'})
    lesson: CourseLesson;

    @ApiProperty({nullable: true})
    @Column({name: 'stopped_at', nullable: true}) stoppedAt: number;

    @ApiProperty()
    @Column({name: 'is_completed', default: false}) isCompleted: boolean;

    @UpdateDateColumn({name: 'updated_at'}) updatedAt: Date;
}
