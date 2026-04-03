import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {BaseEntity} from '../common/entities/base.entity';
import {Author} from '../authors/author.entity';
import {CourseCategory} from './categories/course-category.entity';
import {Language} from '../languages/language.entity';
import {Difficulty} from '../difficulties/difficulty.entity';

@Entity('courses')
export class Course extends BaseEntity {
    @ManyToOne(() => Author) @JoinColumn({name: 'author_id'})
    author: Author;
    @Column({name: 'author_id'}) authorId: number;

    @ManyToOne(() => CourseCategory) @JoinColumn({name: 'category_id'})
    category: CourseCategory;
    @Column({name: 'category_id'}) categoryId: number;

    @ManyToOne(() => Language) @JoinColumn({name: 'language_id'})
    language: Language;
    @Column({name: 'language_id'}) languageId: number;

    @ManyToOne(() => Difficulty) @JoinColumn({name: 'difficulty_id'})
    difficulty: Difficulty;
    @Column({name: 'difficulty_id'}) difficultyId: number;

    @ApiProperty()
    @Column({length: 128})
    title: string;

    @ApiProperty()
    @Column({length: 128}) image: string;

    @ApiProperty()
    @Column({type: 'decimal', precision: 12, scale: 2}) price: number;

    @ApiProperty({nullable: true})
    @Column({name: 'new_price', type: 'decimal', precision: 12, scale: 2, nullable: true}) newPrice: number;

    @ApiProperty()
    @Column({name: 'reviews_count', default: 0}) reviewsCount: number;

    @ApiProperty({nullable: true})
    @Column({type: 'decimal', precision: 2, scale: 1, nullable: true}) rating: number;

    @ApiProperty()
    @Column({name: 'sections_count', default: 0}) sectionsCount: number;

    @ApiProperty()
    @Column({name: 'lessons_count', default: 0}) lessonsCount: number;

    @ApiProperty()
    @Column({name: 'likes_count', default: 0}) likesCount: number;

    @ApiProperty()
    @Column({name: 'is_published', default: false}) isPublished: boolean;

    @ApiProperty({nullable: true})
    @Column({type: 'text', nullable: true}) description: string;
}
