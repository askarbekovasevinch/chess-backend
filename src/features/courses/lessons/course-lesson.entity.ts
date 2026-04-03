import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {BaseEntity} from '../../common/entities/base.entity';
import {Course} from '../course.entity';
import {CourseSection} from '../sections/course-section.entity';

@Entity('course_lessons')
export class CourseLesson extends BaseEntity {
    @ManyToOne(() => Course, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'course_id'})
    course: Course;

    @Column({name: 'course_id'}) courseId: number;

    @ManyToOne(() => CourseSection, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'course_section_id'})
    section: CourseSection;

    @Column({name: 'course_section_id'}) courseSectionId: number;

    @ApiProperty()
    @Column({length: 128}) title: string;

    @ApiProperty({nullable: true})
    @Column({type: 'text', nullable: true})
    content: string;

    @ApiProperty({nullable: true})
    @Column({length: 128, nullable: true})
    thumbnail: string;

    @ApiProperty()
    @Column({length: 256}) video: string;

    @ApiProperty({nullable: true})
    @Column({nullable: true})
    duration: number;

    @ApiProperty({nullable: true})
    @Column({nullable: true})
    order: number;

    @ApiProperty()
    @Column({name: 'is_free', default: false})
    isFree: boolean;
}
