import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BooksController} from './books.controller';
import {BooksService} from './books.service';
import {Book} from './book.entity';
import {BookCategory} from './categories/book-category.entity';
import {BookLike} from './likes/book-like.entity';
import {BookReview} from './reviews/book-review.entity';
import {PurchasedBook} from './purchases/purchased-book.entity';
import {BookCategoriesController} from './categories/book-categories.controller';
import {BookCategoriesService} from './categories/book-categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        Book,
        BookCategory,
        BookLike,
        BookReview,
        PurchasedBook])],

    controllers: [
        BooksController,
        BookCategoriesController],

    providers: [BooksService,
        BookCategoriesService],

    exports: [BooksService],
})
export class BooksModule {
}
