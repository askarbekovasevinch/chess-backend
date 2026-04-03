import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoursesController} from './courses.controller';
import {CoursesService} from './courses.service';
import {Course} from './course.entity';
import {CourseCategory} from './categories/course-category.entity';
import {CourseSection} from './sections/course-section.entity';
import {CourseLesson} from './lessons/course-lesson.entity';
import {UserLesson} from './lessons/user-lesson.entity';
import {PurchasedCourse} from './purchases/purchased-course.entity';
import {CourseLike} from './likes/course-like.entity';
import {CourseReview} from './reviews/course-review.entity';
import {CourseCategoriesController} from './categories/course-categories.controller';
import {CourseCategoriesService} from './categories/course-categories.service';
import {CourseSectionsController} from './sections/course-sections.controller';
import {CourseSectionsService} from './sections/course-sections.service';
import {CourseLessonsController} from './lessons/course-lessons.controller';
import {CourseLessonsService} from './lessons/course-lessons.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        Course,
        CourseCategory,
        CourseSection,
        CourseLesson,
        UserLesson,
        PurchasedCourse,
        CourseLike,
        CourseReview,
    ])],

    controllers: [CoursesController,
        CourseCategoriesController,
        CourseSectionsController,
        CourseLessonsController],

    providers: [CoursesService,
        CourseCategoriesService,
        CourseSectionsService,
        CourseLessonsService],

    exports: [CoursesService],
})
export class CoursesModule {
}
