import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CourseSection} from './course-section.entity';
import {Course} from '../course.entity';

export class CreateSectionDto {
    title: string;
    order?: number;
}

@Injectable()
export class CourseSectionsService {
    constructor(
        @InjectRepository(CourseSection) private repo: Repository<CourseSection>,
        @InjectRepository(Course) private courseRepo: Repository<Course>,
    ) {
    }

    findByCourse(courseId: number) {
        return this.repo.find({where: {courseId}, order: {order: 'ASC'}});
    }

    async findOne(id: number) {
        const item = await this.repo.findOne({where: {id}});
        if (!item) throw new NotFoundException(`Bo'lim #${id} topilmadi`);
        return item;
    }

    async create(courseId: number, dto: CreateSectionDto) {
        const course = await this.courseRepo.findOne({where: {id: courseId}});
        if (!course) throw new NotFoundException('Kurs topilmadi');
        const section = await this.repo.save(this.repo.create({...dto, courseId}));
        await this.courseRepo.increment({id: courseId}, 'sectionsCount', 1);
        return section;
    }

    async update(id: number, dto: Partial<CreateSectionDto>) {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const section = await this.findOne(id);
        await this.repo.delete(id);
        await this.courseRepo.decrement({id: section.courseId}, 'sectionsCount', 1);
        return {message: "Bo'lim o'chirildi"};
    }
}
