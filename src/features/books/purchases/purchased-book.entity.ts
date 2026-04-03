import {Entity, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn} from 'typeorm';
import {User} from '../../users/user.entity';
import {Book} from '../book.entity';

@Entity('purchased_books')
export class PurchasedBook {
    @PrimaryColumn({name: 'user_id'}) userId: number;
    @PrimaryColumn({name: 'book_id'}) bookId: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'}) user: User;

    @ManyToOne(() => Book, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'book_id'}) book: Book;

    @CreateDateColumn({name: 'created_at'}) createdAt: Date;
}
