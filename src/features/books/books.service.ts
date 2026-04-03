import {
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
    BadRequestException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Book} from './book.entity';
import {BookLike} from './likes/book-like.entity';
import {BookReview} from './reviews/book-review.entity';
import {PurchasedBook} from './purchases/purchased-book.entity';
import {CreateBookDto, UpdateBookDto, BookQueryDto} from './dto/book.dto';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book) private bookRepo: Repository<Book>,
        @InjectRepository(BookLike) private likeRepo: Repository<BookLike>,
        @InjectRepository(BookReview) private reviewRepo: Repository<BookReview>,
        @InjectRepository(PurchasedBook) private purchaseRepo: Repository<PurchasedBook>,
    ) {
    }

    async findAll(query: BookQueryDto) {
        const qb = this.bookRepo.createQueryBuilder('b')
            .leftJoinAndSelect('b.author', 'author')
            .leftJoinAndSelect('b.category', 'category')
            .leftJoinAndSelect('b.language', 'language')
            .leftJoinAndSelect('b.difficulty', 'difficulty')
            .where('b.isPublished = true')
            .orderBy('b.createdAt', 'DESC')
            .skip(((query.page || 1) - 1) * (query.limit || 20))
            .take(query.limit || 20);

        if (query.categoryId) qb.andWhere('b.categoryId = :cat', {cat: query.categoryId});
        if (query.languageId) qb.andWhere('b.languageId = :lang', {lang: query.languageId});
        if (query.difficultyId) qb.andWhere('b.difficultyId = :diff', {diff: query.difficultyId});
        if (query.search) qb.andWhere('b.title ILIKE :s', {s: `%${query.search}%`});

        const [books, total] = await qb.getManyAndCount();
        return {books, total, page: query.page, limit: query.limit};
    }

    async findOne(id: number) {
        const book = await this.bookRepo.findOne({
            where: {id},
            relations: ['author', 'category', 'language', 'difficulty'],
        });
        if (!book) throw new NotFoundException(`Kitob #${id} topilmadi`);
        return book;
    }

    create(dto: CreateBookDto) {
        return this.bookRepo.save(this.bookRepo.create(dto));
    }

    async update(id: number, dto: UpdateBookDto) {
        await this.findOne(id);
        await this.bookRepo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.bookRepo.delete(id);
        return {message: 'Kitob o\'chirildi'};
    }

    async purchase(bookId: number, userId: number) {
        await this.findOne(bookId);
        const exists = await this.purchaseRepo.findOne({where: {bookId, userId}});
        if (exists) throw new ConflictException('Kitob allaqachon sotib olingan');
        await this.purchaseRepo.save(this.purchaseRepo.create({bookId, userId}));
        return {message: 'Kitob muvaffaqiyatli sotib olindi'};
    }

    getMyPurchases(userId: number) {
        return this.purchaseRepo.find({
            where: {userId},
            relations: ['book', 'book.author', 'book.category'],
            order: {createdAt: 'DESC'},
        });
    }

    async toggleLike(bookId: number, userId: number) {
        await this.findOne(bookId);
        const existing = await this.likeRepo.findOne({where: {bookId, userId}});
        if (existing) {
            await this.likeRepo.delete({bookId, userId});
            await this.bookRepo.decrement({id: bookId}, 'likesCount', 1);
            return {liked: false, message: 'Like olib tashlandi'};
        }
        await this.likeRepo.save(this.likeRepo.create({bookId, userId}));
        await this.bookRepo.increment({id: bookId}, 'likesCount', 1);
        return {liked: true, message: 'Like qo\'yildi'};
    }

    async addReview(bookId: number, userId: number, rating: number, comment?: string) {
        await this.findOne(bookId);
        const purchased = await this.purchaseRepo.findOne({where: {bookId, userId}});
        if (!purchased) throw new ForbiddenException('Kitobni sotib olmagan foydalanuvchi sharh yoza olmaydi');
        const exists = await this.reviewRepo.findOne({where: {bookId, userId}});
        if (exists) throw new ConflictException('Siz allaqachon sharh yozdingiz');
        if (rating < 1 || rating > 5) throw new BadRequestException('Reyting 1-5 orasida bo\'lishi kerak');
        await this.reviewRepo.save(this.reviewRepo.create({bookId, userId, rating, comment}));
        await this.recalcRating(bookId);
        return {message: 'Sharh qo\'shildi'};
    }

    getReviews(bookId: number) {
        return this.reviewRepo.find({
            where: {bookId},
            relations: ['user'],
            select: {user: {id: true, fullName: true, profileImage: true}},
            order: {createdAt: 'DESC'},
        });
    }

    async deleteReview(bookId: number, userId: number) {
        const review = await this.reviewRepo.findOne({where: {bookId, userId}});
        if (!review) throw new NotFoundException('Sharh topilmadi');
        await this.reviewRepo.delete({bookId, userId});
        await this.recalcRating(bookId);
        return {message: 'Sharh o\'chirildi'};
    }

    private async recalcRating(bookId: number) {
        const result = await this.reviewRepo.createQueryBuilder('r')
            .select('AVG(r.rating)', 'avg').addSelect('COUNT(*)', 'count')
            .where('r.bookId = :bookId', {bookId}).getRawOne();
        await this.bookRepo.update(bookId, {
            rating: parseFloat(parseFloat(result.avg || 0).toFixed(1)),
            reviewsCount: parseInt(result.count || 0),
        });
    }
}
