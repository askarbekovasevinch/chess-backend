import {Entity, Column} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {BaseEntity} from '../../common/entities/base.entity';

@Entity('book_categories')
export class BookCategory extends BaseEntity {
    @ApiProperty()
    @Column({length: 64, unique: true})
    title: string;
}
