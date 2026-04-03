import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CourseLesson} from './course-lesson.entity';
import {UserLesson} from './user-lesson.entity';
import {Course} from '../course.entity';
import {PurchasedCourse} from '../purchases/purchased-course.entity';

@Injectable()
export class CourseLessonsService {
    constructor(
        @InjectRepository(CourseLesson) private lessonRepo: Repository<CourseLesson>,
        @InjectRepository(UserLesson) private userLessonRepo: Repository<UserLesson>,
        @InjectRepository(Course) private courseRepo: Repository<Course>,
        @InjectRepository(PurchasedCourse) private purchaseRepo: Repository<PurchasedCourse>,
    ) {
    }

    async findBySection(sectionId: number) {
        return this.lessonRepo.find({where: {courseSectionId: sectionId}, order: {order: 'ASC'}});
    }

    async findOne(id: number) {
        const lesson = await this.lessonRepo.findOne({where: {id}});
        if (!lesson) throw new NotFoundException(`Dars #${id} topilmadi`);
        return lesson;
    }

    async create(dto: any) {
        const lesson = await this.lessonRepo.save(this.lessonRepo.create(dto));
        await this.courseRepo.increment({id: dto.courseId}, 'lessonsCount', 1);
        return lesson;
    }

    async update(id: number, dto: any) {
        await this.findOne(id);
        await this.lessonRepo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const lesson = await this.findOne(id);
        await this.lessonRepo.delete(id);
        await this.courseRepo.decrement({id: lesson.courseId}, 'lessonsCount', 1);
        return {message: 'Dars o\'chirildi'};
    }

    async updateProgress(lessonId: number, userId: number, stoppedAt: number, isCompleted: boolean) {
        const lesson = await this.findOne(lessonId);
        let userLesson = await this.userLessonRepo.findOne({where: {courseLessonId: lessonId, userId}});

        if (userLesson) {
            await this.userLessonRepo.update({courseLessonId: lessonId, userId}, {stoppedAt, isCompleted});
        } else {
            await this.userLessonRepo.save(this.userLessonRepo.create({
                courseLessonId: lessonId,
                userId,
                stoppedAt,
                isCompleted
            }));
        }

        if (isCompleted) {
            await this.checkCourseCompletion(lesson.courseId, userId);
        }

        return {message: 'Progress saqlandi'};
    }

    async getCourseProgress(courseId: number, userId: number) {
        const total = await this.lessonRepo.count({where: {courseId}});
        const completed = await this.userLessonRepo.count({
            where: {lesson: {courseId}, userId, isCompleted: true},
            relations: ['lesson'],
        });
        return {total, completed, percentage: total ? Math.round((completed / total) * 100) : 0};
    }

    private async checkCourseCompletion(courseId: number, userId: number) {
        const total = await this.lessonRepo.count({where: {courseId}});
        const completed = await this.userLessonRepo.count({
            where: {lesson: {courseId}, userId, isCompleted: true},
            relations: ['lesson'],
        });
        if (total > 0 && total === completed) {
            await this.purchaseRepo.update({courseId, userId}, {isCompleted: true});
        }
    }
}
