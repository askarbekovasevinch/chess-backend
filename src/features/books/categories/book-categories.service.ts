import {Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BookCategory} from './book-category.entity';

@Injectable()
export class BookCategoriesService {
    constructor(@InjectRepository(BookCategory) private repo: Repository<BookCategory>) {
    }

    findAll() {
        return this.repo.find({order: {title: 'ASC'}});
    }

    async findOne(id: number) {
        const item = await this.repo.findOne({where: {id}});
        if (!item) throw new NotFoundException(`Kitob kategoriyasi #${id} topilmadi`);
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
