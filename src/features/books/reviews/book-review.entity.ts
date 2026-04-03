import {Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, Index} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '../../users/user.entity';
import {Book} from '../book.entity';

@Entity('book_reviews')
@Index(['userId', 'bookId'], {unique: true})
export class BookReview {
    @PrimaryGeneratedColumn() id: number;

    @Column({name: 'user_id'}) userId: number;

    @Column({name: 'book_id'}) bookId: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'}) user: User;

    @ManyToOne(() => Book, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'book_id'}) book: Book;

    @ApiProperty()
    @Column() rating: number;

    @ApiProperty({nullable: true})
    @Column({length: 512, nullable: true}) comment: string;

    @CreateDateColumn({name: 'created_at'}) createdAt: Date;
}
