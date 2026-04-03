import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {BaseEntity} from '../../common/entities/base.entity';
import {Course} from '../course.entity';

@Entity('course_sections')
export class CourseSection extends BaseEntity {
    @ManyToOne(() => Course, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'course_id'})
    course: Course;

    @Column({name: 'course_id'})
    courseId: number;

    @ApiProperty()
    @Column({length: 256})
    title: string;

    @ApiProperty({nullable: true})
    @Column({nullable: true}) order: number;
}
