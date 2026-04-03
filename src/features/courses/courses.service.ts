import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    BadRequestException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Course} from './course.entity';
import {PurchasedCourse} from './purchases/purchased-course.entity';
import {CourseLike} from './likes/course-like.entity';
import {CourseReview} from './reviews/course-review.entity';
import {User} from '../users/user.entity';
import {CreateCourseDto, UpdateCourseDto, CourseQueryDto} from './dto/course.dto';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course) private courseRepo: Repository<Course>,
        @InjectRepository(PurchasedCourse) private purchaseRepo: Repository<PurchasedCourse>,
        @InjectRepository(CourseLike) private likeRepo: Repository<CourseLike>,
        @InjectRepository(CourseReview) private reviewRepo: Repository<CourseReview>,
    ) {
    }

    async findAll(query: CourseQueryDto) {
        const qb = this.courseRepo.createQueryBuilder('c')
            .leftJoinAndSelect('c.author', 'author')
            .leftJoinAndSelect('c.category', 'category')
            .leftJoinAndSelect('c.language', 'language')
            .leftJoinAndSelect('c.difficulty', 'difficulty')
            .where('c.isPublished = true')
            .orderBy('c.createdAt', 'DESC')
            .skip(((query.page || 1) - 1) * (query.limit || 20))
            .take(query.limit || 20);

        if (query.categoryId) qb.andWhere('c.categoryId = :cat', {cat: query.categoryId});
        if (query.languageId) qb.andWhere('c.languageId = :lang', {lang: query.languageId});
        if (query.difficultyId) qb.andWhere('c.difficultyId = :diff', {diff: query.difficultyId});
        if (query.search) qb.andWhere('c.title ILIKE :s', {s: `%${query.search}%`});

        const [courses, total] = await qb.getManyAndCount();
        return {courses, total, page: query.page, limit: query.limit};
    }

    async findOne(id: number) {
        const course = await this.courseRepo.findOne({
            where: {id},
            relations: ['author', 'category', 'language', 'difficulty'],
        });
        if (!course) throw new NotFoundException(`Kurs #${id} topilmadi`);
        return course;
    }

    create(dto: CreateCourseDto) {
        return this.courseRepo.save(this.courseRepo.create(dto));
    }

    async update(id: number, dto: UpdateCourseDto) {
        await this.findOne(id);
        await this.courseRepo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.courseRepo.delete(id);
        return {message: 'Kurs o\'chirildi'};
    }

    // Purchase
    async purchase(courseId: number, user: User) {
        await this.findOne(courseId);
        const exists = await this.purchaseRepo.findOne({where: {courseId, userId: user.id}});
        if (exists) throw new ConflictException('Kurs allaqachon sotib olingan');
        await this.purchaseRepo.save(this.purchaseRepo.create({courseId, userId: user.id}));
        return {message: 'Kurs muvaffaqiyatli sotib olindi'};
    }

    async getMyPurchases(userId: number) {
        return this.purchaseRepo.find({
            where: {userId},
            relations: ['course', 'course.author', 'course.category'],
            order: {createdAt: 'DESC'},
        });
    }

    async checkPurchased(courseId: number, userId: number) {
        return this.purchaseRepo.findOne({where: {courseId, userId}});
    }

    // Like
    async toggleLike(courseId: number, userId: number) {
        await this.findOne(courseId);
        const existing = await this.likeRepo.findOne({where: {courseId, userId}});
        if (existing) {
            await this.likeRepo.delete({courseId, userId});
            await this.courseRepo.decrement({id: courseId}, 'likesCount', 1);
            return {liked: false, message: 'Like olib tashlandi'};
        }
        await this.likeRepo.save(this.likeRepo.create({courseId, userId}));
        await this.courseRepo.increment({id: courseId}, 'likesCount', 1);
        return {liked: true, message: 'Like qo\'yildi'};
    }

    // Review
    async addReview(courseId: number, userId: number, rating: number, comment?: string) {
        await this.findOne(courseId);
        const purchased = await this.checkPurchased(courseId, userId);
        if (!purchased) throw new ForbiddenException('Kursni sotib olmagan foydalanuvchi sharh yoza olmaydi');
        const exists = await this.reviewRepo.findOne({where: {courseId, userId}});
        if (exists) throw new ConflictException('Siz allaqachon sharh yozdingiz');
        if (rating < 1 || rating > 5) throw new BadRequestException('Reyting 1-5 orasida bo\'lishi kerak');

        await this.reviewRepo.save(this.reviewRepo.create({courseId, userId, rating, comment}));
        await this.recalcRating(courseId);
        return {message: 'Sharh qo\'shildi'};
    }

    async getReviews(courseId: number) {
        return this.reviewRepo.find({
            where: {courseId},
            relations: ['user'],
            select: {user: {id: true, fullName: true, profileImage: true}},
            order: {createdAt: 'DESC'},
        });
    }

    async deleteReview(courseId: number, userId: number) {
        const review = await this.reviewRepo.findOne({where: {courseId, userId}});
        if (!review) throw new NotFoundException('Sharh topilmadi');
        await this.reviewRepo.delete({courseId, userId});
        await this.recalcRating(courseId);
        return {message: 'Sharh o\'chirildi'};
    }

    private async recalcRating(courseId: number) {
        const result = await this.reviewRepo
            .createQueryBuilder('r')
            .select('AVG(r.rating)', 'avg')
            .addSelect('COUNT(*)', 'count')
            .where('r.courseId = :courseId', {courseId})
            .getRawOne();
        await this.courseRepo.update(courseId, {
            rating: parseFloat(parseFloat(result.avg || 0).toFixed(1)),
            reviewsCount: parseInt(result.count || 0),
        });
    }
}
