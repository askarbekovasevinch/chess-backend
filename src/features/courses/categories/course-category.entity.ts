import {Entity, Column} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {BaseEntity} from '../../common/entities/base.entity';

@Entity('course_categories')
export class CourseCategory extends BaseEntity {
    @ApiProperty()
    @Column({length: 64, unique: true})
    title: string;
}
