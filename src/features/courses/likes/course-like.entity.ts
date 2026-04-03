import {Entity, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn} from 'typeorm';
import {User} from '../../users/user.entity';
import {Course} from '../course.entity';

@Entity('course_likes')
export class CourseLike {
    @PrimaryColumn({name: 'user_id'}) userId: number;
    @PrimaryColumn({name: 'course_id'}) courseId: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'}) user: User;

    @ManyToOne(() => Course, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'course_id'}) course: Course;

    @CreateDateColumn({name: 'created_at'}) createdAt: Date;
}
