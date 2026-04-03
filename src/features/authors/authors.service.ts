import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Author} from './author.entity';
import {CreateAuthorDto, UpdateAuthorDto} from './dto/author.dto';

@Injectable()
export class AuthorsService {
    constructor(@InjectRepository(Author) private repo: Repository<Author>) {
    }

    findAll() {
        return this.repo.find();
    }

    async findOne(id: number) {
        const item = await this.repo.findOne({where: {id}});
        if (!item) throw new NotFoundException(`Avtor #${id} topilmadi`);
        return item;
    }

    create(dto: CreateAuthorDto) {
        return this.repo.save(this.repo.create(dto));
    }

    async update(id: number, dto: UpdateAuthorDto) {
        await this.findOne(id);
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.repo.delete(id);
        return {message: "O'chirildi"};
    }
}
