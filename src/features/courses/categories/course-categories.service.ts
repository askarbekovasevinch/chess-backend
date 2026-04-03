import {Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CourseCategory} from './course-category.entity';

@Injectable()
export class CourseCategoriesService {
    constructor(@InjectRepository(CourseCategory) private repo: Repository<CourseCategory>) {
    }

    findAll() {
        return this.repo.find({order: {title: 'ASC'}});
    }

    async findOne(id: number) {
        const item = await this.repo.findOne({where: {id}});
        if (!item) throw new NotFoundException(`Kategoriya #${id} topilmadi`);
        return item;
    }

    async create(title: string) {
        const exists = await this.repo.findOne({where: {title}});
        if (exists) throw new ConflictException('Bu kategoriya mavjud');
        return this.repo.save(this.repo.create({title}));
    }

    async update(id: number, title: string) {
        await this.findOne(id);
        await this.repo.update(id, {title});
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.repo.delete(id);
        return {message: "O'chirildi"};
    }
}
